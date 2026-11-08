import { createHmac, timingSafeEqual } from "node:crypto";
import { recordOrder } from "@/lib/shop/sheet";
import { getOrderLines, getSquareConfig } from "@/lib/shop/square";

function verifySignature(rawBody: string, signature: string | null): boolean {
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  const url = process.env.SQUARE_WEBHOOK_URL;
  if (!key || !url || !signature) return false;
  const expected = createHmac("sha256", key).update(url + rawBody).digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifySignature(rawBody, request.headers.get("x-square-hmacsha256-signature"))) {
    return new Response("invalid signature", { status: 401 });
  }

  let event: { type?: string; data?: { object?: { payment?: { status?: string; order_id?: string } } } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("bad request", { status: 400 });
  }

  // 決済が完了したときだけ処理する（それ以外のイベントは受け取って終了）
  const payment = event.data?.object?.payment;
  if (!event.type?.startsWith("payment.") || payment?.status !== "COMPLETED" || !payment.order_id) {
    return new Response("ignored", { status: 200 });
  }

  const config = getSquareConfig();
  if (!config) return new Response("not configured", { status: 503 });

  try {
    const items = await getOrderLines(config, payment.order_id);
    if (items.length > 0) await recordOrder({ orderId: payment.order_id, items });
    return new Response("ok", { status: 200 });
  } catch {
    // 5xx を返すと Square が再送する。注文IDで二重処理は防止済み
    return new Response("error", { status: 500 });
  }
}
