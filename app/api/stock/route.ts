import { getProducts } from "@/lib/shop/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getProducts();
  const stock: Record<string, number> = {};
  products.forEach((p) => p.variants.forEach((v) => (stock[v.id] = v.stock)));
  return Response.json({ stock });
}
