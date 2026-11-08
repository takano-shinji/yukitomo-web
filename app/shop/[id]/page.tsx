import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_LABEL, PRODUCTS } from "@/lib/shop/products";
import { getProductById } from "@/lib/shop/catalog";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatYen } from "@/lib/shop/shipping";
import ProductImage from "../ProductImage";
import AddToCart from "./AddToCart";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "商品が見つかりません", robots: { index: false } };
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/shop/${product.id}` },
  };
}

// 在庫は常に最新（スプレッドシート）を表示する
export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">
      <nav className="text-xs text-gray-400">
        <Link href="/shop" className="hover:text-[#1a3060]">
          ショップ
        </Link>
        <span className="mx-2">/</span>
        <span>{CATEGORY_LABEL[product.category]}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square rounded-xl overflow-hidden bg-gray-50">
          <ProductImage src={product.image} alt={product.name} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-lg md:text-xl font-bold text-[#3d3d3d] leading-relaxed">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-[#1a3060]">
              {formatYen(product.price)}
              <span className="text-xs font-normal text-gray-400 ml-1">税込</span>
            </p>
          </div>

          <AddToCart product={product} />

          <p className="text-sm text-[#3d3d3d] leading-relaxed">{product.description}</p>

          <p className="text-xs text-gray-500 border-t border-gray-100 pt-4">
            送料：全国一律{formatYen(SHIPPING_FEE)}（{formatYen(FREE_SHIPPING_THRESHOLD)}以上で無料）
          </p>
        </div>
      </div>
    </main>
  );
}
