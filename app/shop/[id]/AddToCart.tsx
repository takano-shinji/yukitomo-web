"use client";

import Link from "next/link";
import { useState } from "react";
import { hasOptions, variantLabel, type Product } from "@/lib/shop/products";
import { useCart } from "@/lib/shop/cart";
import { SWATCH, btnPrimary, focusRing, linkBtnPrimary, linkBtnSecondary } from "../ui";

function unique(values: string[]) {
  return Array.from(new Set(values));
}

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [frame, setFrame] = useState("");
  const [lens, setLens] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const optional = hasOptions(product);
  const frames = unique(product.variants.flatMap((v) => (v.frame ? [v.frame] : [])));
  const lenses = unique(product.variants.flatMap((v) => (v.lens ? [v.lens] : [])));

  // 相手側の選択と組み合わせたときに在庫があるか
  const frameAvailable = (f: string) =>
    product.variants.some((v) => v.frame === f && (!lens || v.lens === lens) && v.stock > 0);
  const lensAvailable = (l: string) =>
    product.variants.some((v) => v.lens === l && (!frame || v.frame === frame) && v.stock > 0);

  const variant = optional
    ? frame && lens
      ? product.variants.find((v) => v.frame === frame && v.lens === lens)
      : undefined
    : product.variants[0];
  const inStock = !!variant && variant.stock > 0;
  const max = variant ? Math.min(variant.stock, 10) : 1;

  function select(setter: (v: string) => void, value: string) {
    setter(value);
    setQty(1);
    setAdded(false);
  }

  function handleAdd() {
    if (!variant || !inStock) return;
    add(product.id, variant.id, qty, variant.stock);
    setAdded(true);
  }

  function renderGroup(
    title: string,
    options: string[],
    selected: string,
    isAvailable: (o: string) => boolean,
    setter: (v: string) => void,
  ) {
    return (
      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2.5 flex items-baseline gap-2 text-sm font-bold text-[#3d3d3d]">
          {title}
          <span className="text-xs font-normal text-gray-500">{selected || "選んでください"}</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => {
            const out = !isAvailable(o);
            const active = o === selected;
            return (
              <button
                key={o}
                type="button"
                disabled={out}
                aria-pressed={active}
                onClick={() => select(setter, o)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-sm transition-colors ${focusRing} ${
                  active
                    ? "border-[#1a3060] bg-[#1a3060] text-white"
                    : out
                      ? "cursor-not-allowed border-gray-200 text-gray-300"
                      : "border-gray-300 text-[#3d3d3d] hover:border-[#1a3060]"
                }`}
              >
                {SWATCH[o] && (
                  <span
                    aria-hidden
                    className={`h-4 w-4 rounded-full border ${
                      active ? "border-white/70" : "border-black/20"
                    } ${out ? "opacity-40" : ""}`}
                    style={{ background: SWATCH[o] }}
                  />
                )}
                <span className={out ? "line-through" : ""}>{o}</span>
                {out && <span className="text-[10px] no-underline">売切</span>}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {optional && (
        <div className="flex flex-col gap-5">
          {renderGroup("フレーム", frames, frame, frameAvailable, setFrame)}
          {renderGroup("レンズ", lenses, lens, lensAvailable, setLens)}
        </div>
      )}

      {variant && inStock && variant.stock <= 3 && (
        <p className="text-sm text-orange-700">
          {variantLabel(variant)}
          {optional ? "：" : ""}残り{variant.stock}点
        </p>
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
          {optional && (!frame || !lens)
            ? !frame && !lens
              ? "フレームとレンズを選んでください"
              : !frame
                ? "フレームを選んでください"
                : "レンズを選んでください"
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
