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
}): Promise<string> {
  const { config, items, shippingFee, redirectUrl } = params;

  const body = {
    idempotency_key: crypto.randomUUID(),
    order: {
      location_id: config.locationId,
      line_items: items.map((i) => ({
        name: i.name,
        variation_name: i.variationName,
        quantity: String(i.quantity),
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
