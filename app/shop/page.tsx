import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORY_LABEL, hasOptions, mainImage, type Product } from "@/lib/shop/products";
import { getProducts } from "@/lib/shop/catalog";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatYen } from "@/lib/shop/shipping";
import ProductImage from "./ProductImage";
import { focusRing } from "./ui";

export const metadata: Metadata = {
  title: "ショップ",
  description: "雪ともオンラインショップ。選手の活動を支える応援アイテム。",
  alternates: { canonical: "/shop" },
};

// 在庫は常に最新（スプレッドシート）を表示する
export const dynamic = "force-dynamic";

/** 「フレーム2色 × レンズ3色」のように、選べる色の数を一言で示す */
function optionSummary(p: Product): string | null {
  if (!hasOptions(p)) return null;
  const count = (key: "frame" | "lens") =>
    new Set(p.variants.flatMap((v) => (v[key] ? [v[key]] : []))).size;
  const parts = [
    count("frame") > 0 && `フレーム${count("frame")}色`,
    count("lens") > 0 && `レンズ${count("lens")}色`,
  ].filter(Boolean);
  return parts.join(" × ");
}

export default async function ShopPage() {
  const PRODUCTS = await getProducts();
  return (
    <main className="flex flex-col">
      {/* ヒーロー：画面の端から端まで */}
      <section className="relative w-full overflow-hidden aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] bg-gray-100">
        <img
          src="/shop/hero.jpg"
          alt="新雪のゲレンデと青空"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 md:pb-12 text-center flex flex-col gap-3 text-white">
          <h1 className="text-3xl md:text-5xl font-bold tracking-wide drop-shadow-lg">雪ともオンラインショップ</h1>
          <p className="text-xs md:text-sm text-white/90 drop-shadow">
            全国一律{formatYen(SHIPPING_FEE)}／{formatYen(FREE_SHIPPING_THRESHOLD)}以上のご購入で送料無料
          </p>
        </div>
      </section>

      <div className="max-w-4xl w-full mx-auto px-6 py-12 flex flex-col gap-10">
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {PRODUCTS.map((p) => {
          const soldOut = p.variants.every((v) => v.stock <= 0);
          return (
            <Link
              key={p.id}
              href={`/shop/${p.id}`}
              className={`group flex flex-col rounded-xl border border-gray-100 overflow-hidden transition-shadow hover:shadow-md ${focusRing}`}
            >
              <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                  <ProductImage src={mainImage(p)} alt={p.name} />
                </div>
                {soldOut && (
                  <span className="absolute top-3 left-3 bg-[#3d3d3d] text-white text-xs px-2 py-1 rounded">
                    SOLD OUT
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col gap-2">
                <span className="text-xs text-gray-500">{CATEGORY_LABEL[p.category]}</span>
                <h2 className="text-base font-bold text-[#3d3d3d] leading-relaxed group-hover:text-[#1a3060] transition-colors">
                  {p.name}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">{p.summary}</p>
                {optionSummary(p) && <p className="text-xs text-gray-500">{optionSummary(p)}</p>}
                <p className="mt-1 text-lg font-bold text-[#1a3060]">
                  {formatYen(p.price)}
                  <span className="text-xs font-normal text-gray-500 ml-1">税込</span>
                </p>
              </div>
            </Link>
          );
        })}
      </section>
      </div>
    </main>
  );
}
