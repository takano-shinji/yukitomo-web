"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/shop/products";
import { useCart } from "@/lib/shop/cart";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [variantId, setVariantId] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((v) => v.id === variantId);
  const max = variant ? Math.min(variant.stock, 10) : 1;

  function handleAdd() {
    if (!variant || variant.stock <= 0) return;
    add(product.id, variant.id, qty, variant.stock);
    setAdded(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-bold text-[#3d3d3d] mb-1">
          レンズカラー<span className="text-red-500 ml-1 text-xs">必須</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((v) => {
            const out = v.stock <= 0;
            const selected = v.id === variantId;
            return (
              <button
                key={v.id}
                type="button"
                disabled={out}
                onClick={() => {
                  setVariantId(v.id);
                  setQty(1);
                  setAdded(false);
                }}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                  selected
                    ? "border-[#1a3060] bg-[#1a3060] text-white"
                    : out
                      ? "border-gray-200 text-gray-300 line-through cursor-not-allowed"
                      : "border-gray-300 text-[#3d3d3d] hover:border-[#1a3060]"
                }`}
              >
                {v.label}
                {out && <span className="ml-1 text-xs no-underline">（売切）</span>}
              </button>
            );
          })}
        </div>
        {variant && variant.stock <= 3 && variant.stock > 0 && (
          <p className="text-xs text-orange-600">残り{variant.stock}点</p>
        )}
      </fieldset>

      <div className="flex items-center gap-3">
        <label htmlFor="qty" className="text-sm font-bold text-[#3d3d3d]">
          数量
        </label>
        <select
          id="qty"
          value={qty}
          disabled={!variant}
          onChange={(e) => setQty(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-50"
        >
          {Array.from({ length: Math.max(max, 1) }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!variant}
        className="w-full py-3 rounded-lg bg-[#1a3060] text-white font-bold text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        {variant ? "カートに入れる" : "レンズカラーを選択してください"}
      </button>

      {added && (
        <p className="text-sm text-[#3d3d3d]">
          カートに追加しました。
          <Link href="/shop/cart" className="text-[#1a3060] underline ml-2">
            カートを見る
          </Link>
        </p>
      )}
    </div>
  );
}
