import { findVariant, variantLabel } from "@/lib/shop/products";
import { allow, clientIp } from "@/lib/shop/rateLimit";
import { calcShipping } from "@/lib/shop/shipping";
import { getStockMap } from "@/lib/shop/sheet";
import { createPaymentLink, getSquareConfig } from "@/lib/shop/square";
import { SITE_URL } from "@/lib/site";

type Body = {
  lines?: { variantId?: unknown; productId?: unknown; qty?: unknown }[];
  referralCode?: unknown;
  newsletter?: unknown;
};

/**
 * 紹介者コードを整える（全角→半角、前後の空白と制御文字を除去、30文字まで）。
 * スプレッドシートに書くので、先頭の = + - @ は数式として実行されないよう取り除く。
 */
function cleanReferralCode(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .replace(/^[=+\-@\s]+/, "")
    .slice(0, 30);
}

function bad(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const config = getSquareConfig();
  if (!config) return bad("決済の準備ができていません。しばらくしてからお試しください。", 503);

  // 連打対策：1人あたり1分に8回、サイト全体で1分に60回まで
  // （全体の上限は、スプレッドシートの日次上限を使い切られないための保険）
  if (!allow(`ip:${clientIp(request)}`, 8, 60_000) || !allow("global", 60, 60_000)) {
    return bad("アクセスが集中しています。少し時間をおいてお試しください。", 429);
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return bad("リクエストが正しくありません。");
  }
  if (!Array.isArray(body.lines) || body.lines.length === 0 || body.lines.length > 20) {
    return bad("カートが空です。");
  }

  // 在庫はスプレッドシートの最新値で確認する（未設定ならコード内の初期値）
  let stockMap: Record<string, number> | null;
  try {
    stockMap = await getStockMap({ fresh: true });
  } catch {
    return bad("在庫の確認に失敗しました。時間をおいてお試しください。", 503);
  }

  // 価格・在庫はクライアントの値を信用せず、サーバー側のデータで検証する
  const items = [];
  // 同じ商品を複数行に分けて送られても在庫を超えないよう、商品ごとの合計数量を数える
  const requested = new Map<string, number>();
  for (const line of body.lines) {
    if (typeof line.productId !== "string" || typeof line.variantId !== "string") {
      return bad("カートの内容が正しくありません。");
    }
    const qty = line.qty;
    if (typeof qty !== "number" || !Number.isInteger(qty) || qty < 1 || qty > 10) {
      return bad("数量が正しくありません。");
    }
    const found = findVariant(line.productId, line.variantId);
    if (!found) return bad("販売終了の商品がカートに含まれています。");
    const available = stockMap ? (stockMap[found.variant.id] ?? 0) : found.variant.stock;
    const total = (requested.get(found.variant.id) ?? 0) + qty;
    requested.set(found.variant.id, total);
    if (available < total) {
      return bad(`「${[found.product.name, variantLabel(found.variant)].filter(Boolean).join("／")}」の在庫が足りません。`, 409);
    }
    items.push({
      variantId: found.variant.id,
      name: found.product.name,
      variationName: variantLabel(found.variant),
      quantity: qty,
      unitPrice: found.product.price,
    });
  }

  const referralCode = cleanReferralCode(body.referralCode);

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const shippingFee = calcShipping(subtotal);

  try {
    const url = await createPaymentLink({
      config,
      items,
      shippingFee,
      redirectUrl: `${SITE_URL}/shop/thanks`,
      referralCode,
      newsletter: body.newsletter === true,
    });
    return Response.json({ url });
  } catch {
    return bad("決済ページの作成に失敗しました。時間をおいてお試しください。", 502);
  }
}
