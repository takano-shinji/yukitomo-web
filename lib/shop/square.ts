import "server-only";

type SquareConfig = { baseUrl: string; token: string; locationId: string; version: string };

export function getSquareConfig(): SquareConfig | null {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;
  if (!token || !locationId) return null;
  const production = process.env.SQUARE_ENVIRONMENT === "production";
  return {
    token,
    locationId,
    baseUrl: production ? "https://connect.squareup.com" : "https://connect.squareupsandbox.com",
    version: process.env.SQUARE_API_VERSION ?? "2026-09-16",
  };
}

export type CheckoutLineItem = {
  variantId: string;
  name: string;
  variationName: string;
  quantity: number;
  /** 税込単価（円） */
  unitPrice: number;
};

export async function createPaymentLink(params: {
  config: SquareConfig;
  items: CheckoutLineItem[];
  shippingFee: number;
  redirectUrl: string;
  /** 紹介者コード（入力があったときだけ）。ステッカー同梱の目印になる */
  referralCode?: string;
  /** お知らせメールの受け取りに同意したか */
  newsletter?: boolean;
}): Promise<string> {
  const { config, items, shippingFee, redirectUrl, referralCode, newsletter } = params;

  const body = {
    idempotency_key: crypto.randomUUID(),
    order: {
      location_id: config.locationId,
      ...(referralCode ? { reference_id: `紹介:${referralCode}`.slice(0, 40) } : {}),
      metadata: {
        ...(referralCode ? { referral_code: referralCode } : {}),
        newsletter: newsletter ? "yes" : "no",
      },
      line_items: items.map((i) => ({
        name: i.name,
        ...(i.variationName ? { variation_name: i.variationName } : {}),
        quantity: String(i.quantity),
        // Webhookで注文を受け取ったとき、どの商品かを特定するために持たせる
        metadata: { variant_id: i.variantId },
        base_price_money: { amount: i.unitPrice, currency: "JPY" },
      })),
    },
    checkout_options: {
      ask_for_shipping_address: true,
      redirect_url: redirectUrl,
      ...(shippingFee > 0
        ? {
            shipping_fee: {
              name: "送料",
              charge: { amount: shippingFee, currency: "JPY" },
            },
          }
        : {}),
    },
  };

  const res = await fetch(`${config.baseUrl}/v2/online-checkout/payment-links`, {
    method: "POST",
    headers: {
      "Square-Version": config.version,
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);
  const url: unknown = json?.payment_link?.url;
  if (!res.ok || typeof url !== "string") {
    // 詳細はサーバーログのみに残し、クライアントには返さない
    console.error("Square createPaymentLink failed", res.status, JSON.stringify(json?.errors ?? json));
    throw new Error("square_error");
  }
  return url;
}

export type SquareOrderLine = { variantId: string; qty: number; amount: number };

/** 注文IDから、商品ごとの数量・金額と紹介者コードを取得する（送料は含まない） */
export async function getOrder(
  config: SquareConfig,
  orderId: string,
): Promise<{ lines: SquareOrderLine[]; referralCode: string; newsletter: boolean }> {
  const res = await fetch(`${config.baseUrl}/v2/orders/${encodeURIComponent(orderId)}`, {
    headers: { "Square-Version": config.version, Authorization: `Bearer ${config.token}` },
    cache: "no-store",
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.order) {
    console.error("Square getOrder failed", res.status, JSON.stringify(json?.errors ?? json));
    throw new Error("square_error");
  }
  const rawLines: unknown[] = json.order.line_items ?? [];
  const referralCode = String(json.order.metadata?.referral_code ?? "");
  const newsletter = json.order.metadata?.newsletter === "yes";
  const lines = rawLines.flatMap((l) => {
    const item = l as {
      quantity?: string;
      metadata?: Record<string, string>;
      total_money?: { amount?: number };
    };
    const variantId = item.metadata?.variant_id;
    const qty = Number(item.quantity);
    if (!variantId || !Number.isInteger(qty)) return [];
    return [{ variantId, qty, amount: Number(item.total_money?.amount ?? 0) }];
  });
  return { lines, referralCode, newsletter };
}
