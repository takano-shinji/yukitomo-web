/** 送料（税込）。全国一律 */
export const SHIPPING_FEE = 800;
/** 商品合計（税込・送料を除く）がこの金額以上で送料無料 */
export const FREE_SHIPPING_THRESHOLD = 15000;

export function calcShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

export function formatYen(n: number): string {
  return `¥${n.toLocaleString("ja-JP")}`;
}
