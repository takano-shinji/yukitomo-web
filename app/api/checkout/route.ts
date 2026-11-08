import { findVariant } from "@/lib/shop/products";
import { calcShipping } from "@/lib/shop/shipping";
import { createPaymentLink, getSquareConfig } from "@/lib/shop/square";
import { SITE_URL } from "@/lib/site";

type Body = { lines?: { variantId?: unknown; productId?: unknown; qty?: unknown }[] };

function bad(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const config = getSquareConfig();
  if (!config) return bad("決済の準備ができていません。しばらくしてからお試しください。", 503);

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return bad("リクエストが正しくありません。");
  }
  if (!Array.isArray(body.lines) || body.lines.length === 0 || body.lines.length > 20) {
    return bad("カートが空です。");
  }

  // 価格・在庫はクライアントの値を信用せず、サーバー側のデータで検証する
  const items = [];
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
    if (found.variant.stock < qty) {
      return bad(`「${found.product.name}（${found.variant.label}）」の在庫が足りません。`, 409);
    }
    items.push({
      name: found.product.name,
      variationName: found.variant.label,
      quantity: qty,
      unitPrice: found.product.price,
    });
  }

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const shippingFee = calcShipping(subtotal);

  try {
    const url = await createPaymentLink({
      config,
      items,
      shippingFee,
      redirectUrl: `${SITE_URL}/shop/thanks`,
    });
    return Response.json({ url });
  } catch {
    return bad("決済ページの作成に失敗しました。時間をおいてお試しください。", 502);
  }
}
