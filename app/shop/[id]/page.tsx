import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_LABEL, PRODUCTS } from "@/lib/shop/products";
import { getProductById } from "@/lib/shop/catalog";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatYen } from "@/lib/shop/shipping";
import Gallery from "./Gallery";
import { focusRing } from "../ui";
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
    <main className="max-w-5xl mx-auto px-6 py-8 md:py-12 flex flex-col gap-8 md:gap-12">
      <nav aria-label="パンくず" className="text-xs text-gray-500">
        <Link href="/shop" className={`hover:text-[#1a3060] ${focusRing}`}>
          ショップ
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span>{CATEGORY_LABEL[product.category]}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-8 md:gap-12 items-start">
        <Gallery images={product.images} alt={product.name} />

        <div className="flex flex-col gap-7 md:sticky md:top-24">
          <div className="flex flex-col gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-[#3d3d3d] leading-snug">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-[#1a3060]">
              {formatYen(product.price)}
              <span className="text-xs font-normal text-gray-500 ml-1.5">税込</span>
            </p>
          </div>

          <AddToCart product={product} />

          <p className="text-sm text-[#3d3d3d] leading-loose">{product.description}</p>

          {product.notice && (
            <p className="text-xs text-gray-600 leading-relaxed border-l-2 border-[#1a3060]/25 pl-3">
              {product.notice}
            </p>
          )}

          <p className="text-xs text-gray-600 border-t border-gray-100 pt-4">
            送料：全国一律{formatYen(SHIPPING_FEE)}（{formatYen(FREE_SHIPPING_THRESHOLD)}以上で無料）
          </p>
        </div>
      </div>

      {product.detailImages?.map((src) => (
        <Image
          key={src}
          src={src}
          alt={`${product.name} の特長`}
          width={1600}
          height={2261}
          sizes="(min-width: 672px) 672px, 100vw"
          className="w-full h-auto max-w-2xl mx-auto rounded-xl border border-gray-100"
        />
      ))}
    </main>
  );
}
