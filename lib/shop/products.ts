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
  /** 商品画像URL（1枚目が一覧・カートのメイン画像）。未設定の間はプレースホルダーを表示する */
  images?: string[];
  /** 商品ページの下に大きく表示する説明画像（レンズの特長など） */
  detailImages?: string[];
  /** 商品ページの下に箇条書きで出す特長（カタログ記載の内容） */
  features?: string[];
  /** 付属品 */
  includes?: string[];
  /** 商品説明の下に出す注意書き */
  notice?: string;
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
    images: ["/shop/sfera2/2.jpg", "/shop/sfera2/1.jpg", "/shop/sfera2/flipup.jpg", "/shop/sfera2/uc2.jpg", "/shop/sfera2/lens-all.jpg", "/shop/sfera2/3.jpg", "/shop/sfera2/4.jpg"],
    name: "【Adn】SferaⅡ 球面フリップアップゴーグル",
    brand: "Adn",
    category: "goggles",
    price: 22000,
    summary: "ウルトラコントラスト調光レンズ搭載の球面フリップタイプ。",
    description:
      "未来的でスタイリッシュ。圧倒的な広さと立体感のある視界を実現する、球面レンズモデルです。Aereoシリーズと同様に、フォトクロミック（調光）レンズとフリップアップ機構を採用し、レンズ内の曇りを素早く解消できます。Sferaはイタリア語で「球体」を意味します。",
    detailImages: ["/shop/sfera2/uc2.jpg"],
    features: [
      "球面レンズ：圧倒的な広さと立体感のある視界",
      "ウルトラコントラスト（UC）レンズ：青緑・黄・オレンジの光を軽減し、雪面の凹凸やラインをくっきり映します",
      "フォトクロミック（調光）ミラーダブルレンズ（曇り止め加工）：紫外線量でレンズ濃度が変わります",
      "UVカット加工：紫外線をレンズ内部に透過させません",
      "フリップアップ機構：レンズを90°まで跳ね上げて、リフト乗車時などに空気を取り込み、レンズ内の曇りを素早く解消できます",
      "マグネットシステム：レンズを跳ね上げたときや交換するときも、簡単かつしっかりフレームに固定できます",
      "マグネット式フェイススポンジ：工具なしで着脱できます",
      "アジアンフィット：ノーズピースを含め、日本人の顔の形に合わせた設計で、長時間でも快適な装着感です",
      "交換可能なサイドバックルストラップ：ワンタッチでフレームから着脱できます",
      "アンチスリップシリコン：ストラップ裏の波状シリコンが滑走中のズレを抑え、ヘルメット使用時に特に効果的です",
      "眼鏡使用可能（眼鏡のサイズによります）",
      "レンズカラー：アイスブルー／ゴールド／ルビーレッド",
    ],
    includes: [
      "EVAケース",
      "ポーチ",
      "プロテクトボックス",
    ],
    notice:
      "※レンズはウルトラコントラスト（UC）レンズです。掲載の商品写真の一部は、レンズの表記が旧仕様のものを含みます。",
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
    images: ["/shop/aereo2/1.jpg", "/shop/aereo2/2.jpg", "/shop/aereo2/4.jpg", "/shop/aereo2/uc2.jpg", "/shop/aereo2/lens-all.jpg", "/shop/aereo2/3.jpg", "/shop/aereo2/5.jpg"],
    name: "【Adn】AereoⅡ 平面フリップアップゴーグル",
    brand: "Adn",
    category: "goggles",
    price: 22000,
    summary: "ウルトラコントラスト調光レンズ搭載の平面フリップタイプ。",
    description:
      "Aereoはイタリア語で「平面」の意味。レンズはフリップアップ機構により、前方に90°跳ね上げることができます。リフト乗車時など空気を大きく取り込むことで、レンズ内の曇りを素早く解消。Adnゴーグルのスタンダードモデルながら、余分な歪みの少ない平面フォトクロミック（調光）レンズを採用しています。",
    detailImages: ["/shop/aereo2/uc2.jpg"],
    features: [
      "平面レンズ：余分な歪みの少ない視界",
      "ウルトラコントラスト（UC）レンズ：青緑・黄・オレンジの光を軽減し、雪面の凹凸やラインをくっきり映します",
      "フォトクロミック（調光）ミラーダブルレンズ（曇り止め加工）：紫外線量でレンズ濃度が変わります",
      "UVカット加工：紫外線をレンズ内部に透過させません",
      "フリップアップ機構：レンズを90°まで跳ね上げて、リフト乗車時などに空気を取り込み、レンズ内の曇りを素早く解消できます",
      "マグネットシステム：レンズを跳ね上げたときや交換するときも、簡単かつしっかりフレームに固定できます",
      "アジアンフィット：ノーズピースを含め、日本人の顔の形に合わせた設計で、長時間でも快適な装着感です",
      "交換可能なサイドバックルストラップ：ワンタッチでフレームから着脱できます",
      "アンチスリップシリコン：ストラップ裏の波状シリコンが滑走中のズレを抑え、ヘルメット使用時に特に効果的です",
      "眼鏡使用可能（眼鏡のサイズによります）",
      "レンズカラー：アイスブルー／ゴールド／ルビーレッド",
    ],
    includes: [
      "EVAケース",
      "ポーチ",
      "プロテクトボックス",
    ],
    notice:
      "※レンズはウルトラコントラスト（UC）レンズです。掲載の商品写真の一部は、レンズの表記が旧仕様のものを含みます。",
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
    images: ["/shop/sfera2-sponge/1.jpg", "/shop/sfera2-sponge/2.jpg", "/shop/sfera2-sponge/3.jpg", "/shop/sfera2-sponge/4.jpg", "/shop/sfera2-sponge/5.jpg", "/shop/sfera2-sponge/6.jpg"],
    name: "【Adn】SferaⅡ 交換用スポンジ ヨーロピアンタイプ",
    brand: "Adn",
    category: "parts",
    // 税抜2,500円 → 税込2,750円
    price: 2750,
    summary: "SferaⅡ用の交換スポンジ。鼻が高い方向け。",
    description:
      "SferaⅡ用の交換スポンジ（ヨーロピアンタイプ）です。鼻が高い方向けのタイプです。SferaⅡのフェイススポンジはマグネット式で、工具なしで着脱できます。",
    variants: [{ id: "sfera2-sponge", stock: 3 }],
  },
];

/** 一覧・カートに出すメイン画像 */
export function mainImage(product: Product): string | undefined {
  return product.images?.[0];
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function findVariant(productId: string, variantId: string) {
  const product = getProduct(productId);
  const variant = product?.variants.find((v) => v.id === variantId);
  return product && variant ? { product, variant } : undefined;
}
