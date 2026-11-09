import "server-only";

type StockMap = Record<string, number>;

function getConfig() {
  const url = process.env.STOCK_SHEET_URL;
  const key = process.env.STOCK_SHEET_SECRET;
  return url && key ? { url, key } : null;
}

export function isSheetConfigured(): boolean {
  return getConfig() !== null;
}

async function call(body: Record<string, unknown>) {
  const config = getConfig();
  if (!config) throw new Error("sheet_not_configured");
  const res = await fetch(config.url, {
    method: "POST",
    // Apps Script は text/plain で受け取るのが確実
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ key: config.key, ...body }),
    redirect: "follow",
    cache: "no-store",
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.ok) {
    console.error("Sheet call failed", body.action, res.status, json?.error);
    throw new Error("sheet_error");
  }
  return json;
}

let cache: { at: number; stock: StockMap } | null = null;
let refreshing: Promise<StockMap> | null = null;
// この間は取得し直さない / この間は古い在庫を先に出して、裏で取得し直す
const FRESH_MS = 20_000;
const STALE_MS = 10 * 60_000;

async function fetchStock(): Promise<StockMap> {
  const json = await call({ action: "stock" });
  cache = { at: Date.now(), stock: json.stock as StockMap };
  return cache.stock;
}

/** 同時に何度も取得しないよう、取得中ならその結果を共有する */
function refresh(): Promise<StockMap> {
  if (!refreshing) {
    refreshing = fetchStock().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

/**
 * variantId → 在庫数。開発中でスプレッドシート未設定のときは null（コード内の初期値を使う）。
 * 設定済みで取得に失敗した場合は例外を投げる（古い在庫で販売しないため）。
 * fresh=true でキャッシュを使わず最新を取得する（決済前の確認用）。
 * スプレッドシートの応答は数秒かかるため、通常の表示では少し古い在庫を先に返し、裏で更新する。
 */
export async function getStockMap(options?: { fresh?: boolean }): Promise<StockMap | null> {
  if (!isSheetConfigured()) {
    // 本番で未設定のまま販売しないよう、開発時以外はエラーにする
    if (process.env.NODE_ENV === "production") throw new Error("sheet_not_configured");
    return null;
  }
  // 決済前の確認でも、取得中のものがあれば相乗りして、スプレッドシートへの同時呼び出しを増やさない
  if (options?.fresh) return refresh();
  if (cache) {
    const age = Date.now() - cache.at;
    if (age < FRESH_MS) return cache.stock;
    if (age < STALE_MS) {
      refresh().catch(() => {});
      return cache.stock;
    }
  }
  return refresh();
}

export async function recordOrder(order: {
  orderId: string;
  items: { variantId: string; qty: number; amount: number }[];
  referralCode?: string;
  email?: string;
  newsletter?: boolean;
}) {
  const json = await call({ action: "order", ...order });
  cache = null;
  return json as { ok: true; duplicate?: boolean };
}
