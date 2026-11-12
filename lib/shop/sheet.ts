import "server-only";
import { revalidateTag, unstable_cache } from "next/cache";

const STOCK_TAG = "stock";

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

let refreshing: Promise<StockMap> | null = null;

/** 同時に何度も取得しないよう、取得中ならその結果を共有する（決済前の確認用） */
function refresh(): Promise<StockMap> {
  if (!refreshing) {
    refreshing = call({ action: "stock" })
      .then((json) => json.stock as StockMap)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

/**
 * 表示用の在庫。Next.js のデータキャッシュに載せるので、サーバーレスのインスタンスが
 * 入れ替わっても共有される。20秒を過ぎたら、古い在庫を先に返して裏で取得し直す。
 */
const getCachedStock = unstable_cache(
  async (): Promise<StockMap> => (await call({ action: "stock" })).stock as StockMap,
  ["shop-stock"],
  { revalidate: 20, tags: [STOCK_TAG] },
);

/**
 * variantId → 在庫数。開発中でスプレッドシート未設定のときは null（コード内の初期値を使う）。
 * 設定済みで取得に失敗した場合は例外を投げる（古い在庫で販売しないため）。
 * fresh=true でキャッシュを使わず最新を取得する（決済前の確認用）。
 * スプレッドシートの応答は数秒かかるため、通常の表示ではキャッシュした在庫を返す。
 */
export async function getStockMap(options?: { fresh?: boolean }): Promise<StockMap | null> {
  if (!isSheetConfigured()) {
    // 本番で未設定のまま販売しないよう、開発時以外はエラーにする
    if (process.env.NODE_ENV === "production") throw new Error("sheet_not_configured");
    return null;
  }
  if (options?.fresh) return refresh();
  return getCachedStock();
}

export async function recordOrder(order: {
  orderId: string;
  items: { variantId: string; qty: number; amount: number }[];
  referralCode?: string;
  email?: string;
  newsletter?: boolean;
}) {
  const json = await call({ action: "order", ...order });
  // 注文が入ったら、表示用の在庫キャッシュをすぐ捨てる
  revalidateTag(STOCK_TAG, { expire: 0 });
  return json as { ok: true; duplicate?: boolean };
}
