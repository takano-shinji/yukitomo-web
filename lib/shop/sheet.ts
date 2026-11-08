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
const TTL_MS = 20_000;

/**
 * variantId → 在庫数。開発中でスプレッドシート未設定のときは null（コード内の初期値を使う）。
 * 設定済みで取得に失敗した場合は例外を投げる（古い在庫で販売しないため）。
 * fresh=true で短時間キャッシュを使わず最新を取得する（決済前の確認用）。
 */
export async function getStockMap(options?: { fresh?: boolean }): Promise<StockMap | null> {
  if (!isSheetConfigured()) {
    // 本番で未設定のまま販売しないよう、開発時以外はエラーにする
    if (process.env.NODE_ENV === "production") throw new Error("sheet_not_configured");
    return null;
  }
  if (!options?.fresh && cache && Date.now() - cache.at < TTL_MS) return cache.stock;
  const json = await call({ action: "stock" });
  cache = { at: Date.now(), stock: json.stock as StockMap };
  return cache.stock;
}

export async function recordOrder(order: {
  orderId: string;
  items: { variantId: string; qty: number; amount: number }[];
}) {
  const json = await call({ action: "order", ...order });
  cache = null;
  return json as { ok: true; duplicate?: boolean };
}
