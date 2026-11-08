"use client";

import Link from "next/link";
import { useState } from "react";
import { hasOptions, variantLabel, type Product } from "@/lib/shop/products";
import { useCart } from "@/lib/shop/cart";

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
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-bold text-[#3d3d3d] mb-1">
          {title}
          <span className="text-red-500 ml-1 text-xs">必須</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => {
            const out = !isAvailable(o);
            return (
              <button
                key={o}
                type="button"
                disabled={out}
                onClick={() => select(setter, o)}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                  o === selected
                    ? "border-[#1a3060] bg-[#1a3060] text-white"
                    : out
                      ? "border-gray-200 text-gray-300 line-through cursor-not-allowed"
                      : "border-gray-300 text-[#3d3d3d] hover:border-[#1a3060]"
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {optional && renderGroup("フレーム", frames, frame, frameAvailable, setFrame)}
      {optional && renderGroup("レンズ", lenses, lens, lensAvailable, setLens)}

      {variant && inStock && variant.stock <= 3 && (
        <p className="text-xs text-orange-600">
          {variantLabel(variant)}
          {optional ? "：" : ""}残り{variant.stock}点
        </p>
      )}
      {variant && !inStock && (
        <p className="text-xs text-red-600">
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
        disabled={!inStock}
        className="w-full py-3 rounded-lg bg-[#1a3060] text-white font-bold text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        {optional && (!frame || !lens) ? "フレームとレンズを選択してください" : "カートに入れる"}
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
