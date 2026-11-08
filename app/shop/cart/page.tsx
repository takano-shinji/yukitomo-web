"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/shop/cart";
import { findVariant, mainImage, variantLabel } from "@/lib/shop/products";
import {
  FREE_SHIPPING_THRESHOLD,
  calcShipping,
  formatYen,
} from "@/lib/shop/shipping";
import ProductImage from "../ProductImage";
import { btnOnNavy, focusRing, focusRingLight } from "../ui";

export default function CartPage() {
  const { lines, setQty, remove } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [stock, setStock] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/stock")
      .then((r) => r.json())
      .then((j) => alive && setStock(j.stock ?? null))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

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
          referralCode,
          newsletter,
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
    if (!found) return [];
    const available = stock ? (stock[l.variantId] ?? 0) : found.variant.stock;
    return [{ ...l, ...found, available }];
  });

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const shipping = calcShipping(subtotal);
  const total = subtotal + shipping;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <main className="max-w-5xl mx-auto px-6 pt-8 pb-16 md:py-12 flex flex-col gap-8">
      <h1 className="text-xl md:text-2xl font-bold text-[#3d3d3d]">カート</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-5 rounded-2xl bg-[#f5f8fc] py-20 text-center">
          <p className="text-sm text-gray-600">カートに商品がありません。</p>
          <Link
            href="/shop"
            className={`inline-flex min-h-11 items-center rounded-lg bg-[#1a3060] px-6 text-sm font-bold text-white transition-colors hover:bg-[#14264d] ${focusRing}`}
          >
            商品を見る
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_340px] md:gap-12 md:items-start">
          <ul className="flex flex-col divide-y divide-gray-100 border-y border-gray-100">
            {items.map((i) => (
              <li key={i.variantId} className="flex gap-4 py-6">
                <Link
                  href={`/shop/${i.product.id}`}
                  className={`w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 ${focusRing}`}
                  aria-label={`${i.product.name}のページを見る`}
                >
                  <ProductImage src={mainImage(i.product)} alt="" fit="contain" />
                </Link>
                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <Link
                    href={`/shop/${i.product.id}`}
                    className={`text-sm font-bold text-[#3d3d3d] leading-relaxed hover:text-[#1a3060] ${focusRing}`}
                  >
                    {i.product.name}
                  </Link>
                  {variantLabel(i.variant) && (
                    <p className="text-xs text-gray-600">{variantLabel(i.variant)}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <select
                        aria-label="数量"
                        value={i.qty}
                        onChange={(e) => setQty(i.variantId, Number(e.target.value))}
                        className={`min-h-10 rounded-lg border border-gray-300 bg-white px-2.5 text-sm ${focusRing}`}
                      >
                        {Array.from({ length: Math.min(Math.max(i.available, i.qty), 10) }, (_, n) => n + 1).map(
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
                        className={`text-xs text-gray-500 underline hover:text-red-600 ${focusRing}`}
                      >
                        削除
                      </button>
                    </div>
                    <p className="text-base font-bold text-[#3d3d3d]">
                      {formatYen(i.product.price * i.qty)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <section
            aria-label="ご注文の合計"
            className="flex flex-col gap-4 rounded-2xl bg-[#1a3060] p-6 text-sm text-white md:sticky md:top-24"
          >
            <div className="flex flex-col gap-2">
              {remaining > 0 ? (
                <p className="text-xs text-white/85">
                  あと<strong className="text-white">{formatYen(remaining)}</strong>で送料無料になります
                </p>
              ) : (
                <p className="text-xs font-bold text-white">送料無料です</p>
              )}
              <div
                role="progressbar"
                aria-label="送料無料までの金額"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className="h-1.5 overflow-hidden rounded-full bg-white/25"
              >
                <div
                  className="h-full rounded-full bg-white transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <dl className="flex flex-col gap-3">
              <div className="flex justify-between">
                <dt>小計（税込）</dt>
                <dd>{formatYen(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>送料</dt>
                <dd>{shipping === 0 ? "無料" : formatYen(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-white/25 pt-4 text-base font-bold">
                <dt>合計</dt>
                <dd className="text-lg">{formatYen(total)}</dd>
              </div>
            </dl>

            <div className="flex flex-col gap-1.5 border-t border-white/25 pt-4">
              <label htmlFor="referral" className="text-sm font-bold">
                紹介者コード<span className="ml-1 text-xs font-normal text-white/75">（任意）</span>
              </label>
              <input
                id="referral"
                type="text"
                value={referralCode}
                maxLength={30}
                autoComplete="off"
                onChange={(e) => setReferralCode(e.target.value)}
                className={`min-h-11 rounded-lg bg-white px-3 text-sm text-[#3d3d3d] placeholder:text-gray-400 ${focusRingLight}`}
                placeholder="お持ちの方は入力してください"
              />
              <p className="text-xs leading-relaxed text-white/85">
                入力すると、<strong className="text-white">雪ともステッカーをプレゼント</strong>します。
              </p>
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-white/90">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className={`mt-0.5 h-4 w-4 shrink-0 accent-white ${focusRingLight}`}
              />
              <span>
                雪ともからの新商品・イベントのお知らせメールを受け取る
                <span className="text-white/70">（決済ページで入力するメールアドレスに送ります。いつでも停止できます）</span>
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-lg bg-white px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={submitting}
              className={btnOnNavy}
            >
              {submitting ? "決済ページへ移動中…" : "決済に進む"}
            </button>
            <p className="text-xs text-white/75 leading-relaxed">
              お支払いとお届け先の入力は、Squareの安全な決済ページで行います。カード情報は当サイトに保存されません。
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
