"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/shop/cart";
import { findVariant } from "@/lib/shop/products";
import {
  FREE_SHIPPING_THRESHOLD,
  calcShipping,
  formatYen,
} from "@/lib/shop/shipping";
import ProductImage from "../ProductImage";

export default function CartPage() {
  const { lines, setQty, remove } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            productId: l.productId,
            variantId: l.variantId,
            qty: l.qty,
          })),
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || typeof json?.url !== "string") {
        setError(json?.error ?? "決済ページの作成に失敗しました。時間をおいてお試しください。");
        setSubmitting(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("通信に失敗しました。時間をおいてお試しください。");
      setSubmitting(false);
    }
  }

  const items = lines.flatMap((l) => {
    const found = findVariant(l.productId, l.variantId);
    return found ? [{ ...l, ...found }] : [];
  });

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const shipping = calcShipping(subtotal);
  const total = subtotal + shipping;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <main className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8">
      <h1 className="text-xl md:text-2xl font-bold text-[#3d3d3d]">カート</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-sm text-gray-500">カートに商品がありません。</p>
          <Link href="/shop" className="text-sm text-[#1a3060] underline">
            ショップに戻る
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex flex-col divide-y divide-gray-100 border-y border-gray-100">
            {items.map((i) => (
              <li key={i.variantId} className="flex gap-4 py-5">
                <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-50">
                  <ProductImage src={i.product.image} alt={i.product.name} />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <Link
                    href={`/shop/${i.product.id}`}
                    className="text-sm font-bold text-[#3d3d3d] leading-relaxed hover:text-[#1a3060]"
                  >
                    {i.product.name}
                  </Link>
                  <p className="text-xs text-gray-500">レンズカラー：{i.variant.label}</p>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <select
                        aria-label="数量"
                        value={i.qty}
                        onChange={(e) => setQty(i.variantId, Number(e.target.value))}
                        className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                      >
                        {Array.from({ length: Math.min(i.variant.stock, 10) }, (_, n) => n + 1).map(
                          (n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ),
                        )}
                      </select>
                      <button
                        type="button"
                        onClick={() => remove(i.variantId)}
                        className="text-xs text-gray-400 underline hover:text-red-500"
                      >
                        削除
                      </button>
                    </div>
                    <p className="text-sm font-bold text-[#3d3d3d]">
                      {formatYen(i.product.price * i.qty)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <section className="flex flex-col gap-3 text-sm text-[#3d3d3d]">
            <div className="flex justify-between">
              <span>小計（税込）</span>
              <span>{formatYen(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>送料</span>
              <span>{shipping === 0 ? "無料" : formatYen(shipping)}</span>
            </div>
            {remaining > 0 && (
              <p className="text-xs text-orange-600">
                あと{formatYen(remaining)}のご購入で送料無料になります。
              </p>
            )}
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold">
              <span>合計</span>
              <span className="text-[#1a3060]">{formatYen(total)}</span>
            </div>
          </section>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={submitting}
            className="w-full py-3 rounded-lg bg-[#1a3060] text-white font-bold text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {submitting ? "決済ページへ移動中…" : "レジに進む（Squareで決済）"}
          </button>
          <p className="text-xs text-gray-500 text-center">
            お支払いと配送先のご入力は、Squareの安全な決済ページで行います。
          </p>
        </>
      )}
    </main>
  );
}
