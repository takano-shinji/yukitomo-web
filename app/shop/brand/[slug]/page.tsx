import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_LABEL, mainImage } from "@/lib/shop/products";
import { getProducts } from "@/lib/shop/catalog";
import { BRANDS, BRAND_INTRO, brandBySlug, brandSlug } from "@/lib/shop/brands";
import { formatYen } from "@/lib/shop/shipping";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import JsonLd from "@/app/components/JsonLd";
import ProductImage from "../../ProductImage";
import { focusRing } from "../../ui";

export const dynamicParams = false;

export function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: brandSlug(b) }));
}

// 在庫は常に最新（スプレッドシート）を表示する
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = brandBySlug(slug);
  if (!brand) return {};

  const products = (await getProducts()).filter((p) => p.brand === brand);
  const title = `${brand} ゴーグル・交換用パーツの通販`;
  const description = `${brand} のゴーグル・交換用パーツを雪ともオンラインショップで販売。${products
    .map((p) => p.name.replace(/^【[^】]*】/, ""))
    .join("、")}など。`;
  const url = `/shop/brand/${slug}`;
  const image = products[0]?.images?.[0];

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: products.length === 0 ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "ja_JP",
      title,
      description,
      url,
      images: image ? [image] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = brandBySlug(slug);
  if (!brand) notFound();

  const products = (await getProducts()).filter((p) => p.brand === brand);
  const intro = BRAND_INTRO[brand];
  const pageUrl = `${SITE_URL}/shop/brand/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#page`,
        name: `${brand} ゴーグル・交換用パーツの通販`,
        url: pageUrl,
        about: { "@type": "Brand", name: brand },
      },
      {
        "@type": "ItemList",
        itemListElement: products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          url: `${SITE_URL}/shop/${p.id}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "ショップ", item: `${SITE_URL}/shop` },
          { "@type": "ListItem", position: 3, name: brand, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <main className="max-w-4xl w-full mx-auto px-6 py-8 md:py-12 flex flex-col gap-8">
      <JsonLd data={jsonLd} />
      <nav aria-label="パンくず" className="text-xs text-gray-500">
        <Link href="/shop" className={`hover:text-[#1a3060] ${focusRing}`}>
          ショップ
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span>{brand}</span>
      </nav>

      <header className="flex flex-col gap-4">
        <h1 className="text-xl md:text-3xl font-bold text-[#3d3d3d] leading-snug">
          {brand} ゴーグル・交換用パーツ
        </h1>
        {intro && (
          <>
            <p className="text-sm text-[#3d3d3d] leading-loose">{intro.lead}</p>
            <ul className="list-disc pl-5 text-sm text-[#3d3d3d] leading-loose">
              {intro.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </>
        )}
      </header>

      <section aria-labelledby="brand-products" className="flex flex-col gap-5">
        <h2 id="brand-products" className="text-lg font-bold text-[#3d3d3d]">
          {brand} の商品一覧
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map((p) => {
            const soldOut = p.variants.every((v) => v.stock <= 0);
            return (
              <Link
                key={p.id}
                href={`/shop/${p.id}`}
                className={`group flex flex-col rounded-xl border border-gray-100 overflow-hidden transition-shadow hover:shadow-md ${focusRing}`}
              >
                <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                  <ProductImage src={mainImage(p)} alt={p.name} sizes="(min-width: 640px) 400px, 100vw" />
                  {soldOut && (
                    <span className="absolute top-3 left-3 bg-[#3d3d3d] text-white text-xs px-2 py-1 rounded">
                      SOLD OUT
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <span className="text-xs text-gray-500">{CATEGORY_LABEL[p.category]}</span>
                  <h3 className="text-base font-bold text-[#3d3d3d] leading-relaxed group-hover:text-[#1a3060] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.summary}</p>
                  <p className="mt-1 text-lg font-bold text-[#1a3060]">
                    {formatYen(p.price)}
                    <span className="text-xs font-normal text-gray-500 ml-1">税込</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
