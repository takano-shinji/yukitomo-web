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
      "Adn は、雪山での体験から生まれた2025年生まれのゴーグルブランドです。キャッチコピーは「Adventure Refined.（自然と冒険を、洗練という形で）」。不要な要素をそぎ落としたシンプルな造形で、顔に静かに馴染みます。日本人の骨格に合わせたフィット感と、光の移ろいに応じて色が変わるフォトクロミック（調光）レンズが特長です。",
    points: [
      "球面タイプの SferaⅡ と、平面タイプの AereoⅡ から選べます",
      "ウルトラコントラスト（UC）レンズが、青緑・黄・オレンジの光を軽減して、雪面の凹凸やラインをくっきり見せます",
      "フリップアップ機構で、リフト乗車時などにレンズ内の曇りを素早く解消できます",
      "アジアンフィットで、長時間の装着でも疲れにくい設計です",
      "ストラップは交換可能。EVAケース、ポーチ、プロテクトボックスが付属します",
      "SferaⅡ 用の交換スポンジ（ヨーロピアンタイプ）も取り扱っています",
    ],
  },
};
