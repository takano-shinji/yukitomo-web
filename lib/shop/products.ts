export type Variant = {
  id: string;
  /** フレームの色（選択肢のない商品は未設定） */
  frame?: string;
  /** レンズの色（選択肢のない商品は未設定） */
  lens?: string;
  stock: number;
};

/** 「フレーム:Black / レンズ:Blue」の形。選択肢のない商品は空文字。 */
export function variantLabel(v: Pick<Variant, "frame" | "lens">): string {
  const parts = [v.frame && `フレーム:${v.frame}`, v.lens && `レンズ:${v.lens}`].filter(Boolean);
  return parts.join(" / ");
}

/** フレーム・レンズの選択が必要な商品か */
export function hasOptions(product: Product): boolean {
  return product.variants.some((v) => v.frame || v.lens);
}

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
  /** フレーム×レンズの組み合わせ（両方とも必須選択） */
  variants: Variant[];
};

export const CATEGORY_LABEL: Record<Product["category"], string> = {
  goggles: "ゴーグル",
  parts: "ゴーグルパーツ",
  goods: "グッズ",
  apparel: "アパレル",
};

// 在庫(stock)は開発時の初期値。本番ではスプレッドシートの値が使われる。
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
      { id: "sfera2-black-blue", frame: "Black", lens: "Blue", stock: 5 },
      { id: "sfera2-black-red", frame: "Black", lens: "Red", stock: 5 },
      { id: "sfera2-black-gold", frame: "Black", lens: "Gold", stock: 5 },
      { id: "sfera2-white-blue", frame: "White", lens: "Blue", stock: 5 },
      { id: "sfera2-white-red", frame: "White", lens: "Red", stock: 5 },
      { id: "sfera2-white-gold", frame: "White", lens: "Gold", stock: 5 },
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
      { id: "aereo2-black-blue", frame: "Black", lens: "Blue", stock: 5 },
      { id: "aereo2-black-red", frame: "Black", lens: "Red", stock: 5 },
      { id: "aereo2-black-gold", frame: "Black", lens: "Gold", stock: 5 },
      { id: "aereo2-white-blue", frame: "White", lens: "Blue", stock: 5 },
      { id: "aereo2-white-red", frame: "White", lens: "Red", stock: 5 },
      { id: "aereo2-white-gold", frame: "White", lens: "Gold", stock: 5 },
    ],
  },
  {
    id: "sfera2-sponge",
    name: "【Adn】SferaⅡ 交換用スポンジ ヨーロピアンタイプ",
    brand: "Adn",
    category: "parts",
    // 税抜2,500円 → 税込2,750円
    price: 2750,
    summary: "SferaⅡ用の交換スポンジ。鼻が高い方向け。",
    description: "SferaⅡ用の交換スポンジ（ヨーロピアンタイプ）です。鼻が高い方向けのタイプです。",
    variants: [{ id: "sfera2-sponge", stock: 3 }],
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
