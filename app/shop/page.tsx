import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORY_LABEL, PRODUCTS } from "@/lib/shop/products";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatYen } from "@/lib/shop/shipping";
import ProductImage from "./ProductImage";

export const metadata: Metadata = {
  title: "ショップ",
  description: "雪ともオンラインショップ。選手の活動を支える応援アイテム。",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-10">
      <section className="text-center flex flex-col gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-[#3d3d3d]">雪ともオンラインショップ</h1>
        <p className="text-sm text-[#3d3d3d]">選手が輝く業界へ。売上は選手の活動費を支えます。</p>
        <p className="text-xs text-gray-500">
          全国一律{formatYen(SHIPPING_FEE)}／{formatYen(FREE_SHIPPING_THRESHOLD)}以上のご購入で送料無料
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {PRODUCTS.map((p) => {
          const soldOut = p.variants.every((v) => v.stock <= 0);
          return (
            <Link
              key={p.id}
              href={`/shop/${p.id}`}
              className="group flex flex-col rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3] bg-gray-50 relative">
                <ProductImage src={p.image} alt={p.name} />
                {soldOut && (
                  <span className="absolute top-3 left-3 bg-[#3d3d3d] text-white text-xs px-2 py-1 rounded">
                    SOLD OUT
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col gap-2">
                <span className="text-xs text-gray-400">{CATEGORY_LABEL[p.category]}</span>
                <h2 className="text-sm font-bold text-[#3d3d3d] leading-relaxed">{p.name}</h2>
                <p className="text-xs text-gray-500">{p.summary}</p>
                <p className="text-base font-bold text-[#1a3060]">
                  {formatYen(p.price)}
                  <span className="text-xs font-normal text-gray-400 ml-1">税込</span>
                </p>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
