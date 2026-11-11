"use client";

import Link from "next/link";
import { useState } from "react";
import { hasOptions, variantLabel, type Product } from "@/lib/shop/products";
import { useCart } from "@/lib/shop/cart";
import { SWATCH, btnPrimary, focusRing, linkBtnPrimary, linkBtnSecondary } from "../ui";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [variantId, setVariantId] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const optional = hasOptions(product);

  const variant = optional
    ? product.variants.find((v) => v.id === variantId)
    : product.variants[0];
  const inStock = !!variant && variant.stock > 0;
  const max = variant ? Math.min(variant.stock, 10) : 1;

  function swatch(name: string, active: boolean, out: boolean) {
    if (!SWATCH[name]) return null;
    return (
      <span
        aria-hidden
        className={`h-4 w-4 shrink-0 rounded-full border ${
          active ? "border-white/70" : "border-black/20"
        } ${out ? "opacity-40" : ""}`}
        style={{ background: SWATCH[name] }}
      />
    );
  }

  function selectVariant(id: string) {
    setVariantId(id);
    setQty(1);
    setAdded(false);
  }

  function handleAdd() {
    if (!variant || !inStock) return;
    add(product.id, variant.id, qty, variant.stock);
    setAdded(true);
  }

  return (
    <div className="flex flex-col gap-6">
      {optional && (
        <fieldset className="flex flex-col gap-2.5">
          <legend className="mb-2.5 text-sm font-bold text-[#3d3d3d]">
            種類を選んでください（在庫数を確認できます）
          </legend>
          <div className="flex flex-col gap-2">
            {product.variants.map((v) => {
              const out = v.stock <= 0;
              const active = v.id === variantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={out}
                  aria-pressed={active}
                  onClick={() => selectVariant(v.id)}
                  className={`flex min-h-14 items-center justify-between gap-3 rounded-lg border px-4 py-2 text-left text-sm transition-colors ${focusRing} ${
                    active
                      ? "border-[#1a3060] bg-[#1a3060] text-white"
                      : out
                        ? "cursor-not-allowed border-gray-200 text-gray-300"
                        : "border-gray-300 text-[#3d3d3d] hover:border-[#1a3060]"
                  }`}
                >
                  <span className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${out ? "line-through" : "font-bold"}`}>
                    {v.frame && (
                      <>
                        {swatch(v.frame, active, out)}
                        <span>フレーム:{v.frame}</span>
                      </>
                    )}
                    {v.frame && v.lens && <span>/</span>}
                    {v.lens && (
                      <>
                        {swatch(v.lens, active, out)}
                        <span>レンズ:{v.lens}</span>
                      </>
                    )}
                  </span>
                  <span
                    className={`shrink-0 text-xs ${
                      active ? "text-white" : v.stock <= 3 && !out ? "text-orange-700" : ""
                    }`}
                  >
                    {out ? "売切" : `在庫 ${v.stock}点`}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {variant && !inStock && (
        <p className="text-sm text-red-700">
          {optional ? "この組み合わせは売り切れです。" : "売り切れです。"}
        </p>
      )}

      <div className="flex items-center gap-3">
        <label htmlFor="qty" className="text-sm font-bold text-[#3d3d3d]">
          数量
        </label>
        <select
          id="qty"
          value={qty}
          disabled={!inStock}
          onChange={(e) => setQty(Number(e.target.value))}
          className={`min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm disabled:bg-gray-50 ${focusRing}`}
        >
          {Array.from({ length: Math.max(max, 1) }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* スマホでは画面の下に固定して、いつでも押せるようにする */}
      <div className="sticky bottom-0 z-10 -mx-6 border-t border-gray-100 bg-white/95 px-6 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
        <button type="button" onClick={handleAdd} disabled={!inStock} className={btnPrimary}>
          {optional && !variant
            ? "種類を選んでください"
            : !inStock
              ? "売り切れ"
              : "カートに入れる"}
        </button>
        {added && (
          <div role="status" className="mt-3 flex flex-col gap-3">
            <p className="text-center text-sm font-bold text-[#1a3060]">カートに入れました</p>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/shop" className={linkBtnSecondary}>
                買い物を続ける
              </Link>
              <Link href="/shop/cart" className={linkBtnPrimary}>
                購入手続きへ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
