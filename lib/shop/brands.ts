import { PRODUCTS } from "./products";

/** ブランド名 → URL用スラッグ（/shop/brand/adn）。 */
export function brandSlug(brand: string): string {
  return brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const BRANDS: string[] = Array.from(new Set(PRODUCTS.map((p) => p.brand)));

export function brandBySlug(slug: string): string | undefined {
  return BRANDS.find((b) => brandSlug(b) === slug);
}

/** ブランドページに載せる紹介文。商品データ（商品説明）に書かれている内容だけを使う。 */
export const BRAND_INTRO: Record<string, { lead: string; points: string[] }> = {
  Adn: {
    lead:
      "雪ともオンラインショップで取り扱っている Adn の商品です。ウルトラコントラスト（UC）調光レンズとフリップアップ機構を備えたゴーグルと、交換用パーツを販売しています。",
    points: [
      "球面タイプの SferaⅡ と、平面タイプの AereoⅡ から選べます",
      "ウルトラコントラスト（UC）調光レンズが、雪面の凹凸やライディングラインをくっきり見せます",
      "フリップアップ機構つき。バンド・スポンジの交換に対応し、専用ポーチが付属します",
      "フレームとレンズの色の組み合わせを選べます",
      "交換用スポンジ（ヨーロピアンタイプ）も取り扱っています",
    ],
  },
};
