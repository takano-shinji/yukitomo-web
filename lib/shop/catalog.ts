import "server-only";
import { PRODUCTS, type Product } from "./products";
import { getStockMap } from "./sheet";

function merge(products: Product[], stock: Record<string, number> | null): Product[] {
  if (!stock) return products;
  return products.map((p) => ({
    ...p,
    variants: p.variants.map((v) => ({ ...v, stock: stock[v.id] ?? 0 })),
  }));
}

/** 商品一覧（在庫はスプレッドシートの値で上書き）。取得に失敗したら在庫0として扱う。 */
export async function getProducts(options?: { fresh?: boolean }): Promise<Product[]> {
  try {
    return merge(PRODUCTS, await getStockMap(options));
  } catch {
    return PRODUCTS.map((p) => ({ ...p, variants: p.variants.map((v) => ({ ...v, stock: 0 })) }));
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.id === id);
}
