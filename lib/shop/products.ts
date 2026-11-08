export type Variant = {
  id: string;
  /** レンズカラー名 */
  label: string;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: "goggles" | "parts" | "goods" | "apparel";
  /** 税込価格（円） */
  price: number;
  summary: string;
  description: string;
  /** 商品画像URL。未設定の間はプレースホルダーを表示する */
  image?: string;
  /** レンズカラーなどの選択肢（必須選択） */
  variants: Variant[];
};

export const CATEGORY_LABEL: Record<Product["category"], string> = {
  goggles: "ゴーグル",
  parts: "ゴーグルパーツ",
  goods: "グッズ",
  apparel: "アパレル",
};

// TODO: 本番ではスプレッドシート（在庫連携）から読み込む。今はダミーデータ。
export const PRODUCTS: Product[] = [
  {
    id: "sfera2",
    name: "【Adn】SferaⅡ 球面フリップアップゴーグル",
    brand: "Adn",
    category: "goggles",
    price: 22000,
    summary: "調光レンズ搭載の球面フリップタイプ。",
    description:
      "調光レンズとフリップアップ機構を備えた球面タイプのゴーグル。バンド・スポンジの交換に対応し、専用ポーチが付属します。",
    variants: [
      { id: "sfera2-silver", label: "ミラーシルバー", stock: 5 },
      { id: "sfera2-blue", label: "ミラーブルー", stock: 3 },
      { id: "sfera2-clear", label: "クリア", stock: 0 },
    ],
  },
  {
    id: "aereo2",
    name: "【Adn】AereoⅡ 平面フリップアップゴーグル",
    brand: "Adn",
    category: "goggles",
    price: 22000,
    summary: "調光レンズ搭載の平面フリップタイプ。",
    description:
      "調光レンズとフリップアップ機構を備えた平面タイプのゴーグル。バンド・スポンジの交換に対応し、専用ポーチが付属します。",
    variants: [
      { id: "aereo2-silver", label: "ミラーシルバー", stock: 4 },
      { id: "aereo2-gold", label: "ミラーゴールド", stock: 2 },
    ],
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function findVariant(productId: string, variantId: string) {
  const product = getProduct(productId);
  const variant = product?.variants.find((v) => v.id === variantId);
  return product && variant ? { product, variant } : undefined;
}
