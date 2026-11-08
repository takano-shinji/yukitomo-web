import type { Metadata } from "next";
import Link from "next/link";
import ClearCart from "./ClearCart";
import { focusRing } from "../ui";

export const metadata: Metadata = {
  title: "ご注文ありがとうございました",
  robots: { index: false, follow: false },
};

const STEPS = [
  "決済完了のメールが、Squareから届きます。",
  "ご注文確定後、5日以内に発送します。",
  "ご不明な点は、info@yukitomo.com までご連絡ください。",
];

export default function ThanksPage() {
  return (
    <main className="max-w-xl mx-auto px-6 py-16 md:py-24 flex flex-col items-center gap-8 text-center">
      <ClearCart />
      <span
        aria-hidden
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1a3060] text-white"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <div className="flex flex-col gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-[#3d3d3d]">ご注文ありがとうございます</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          ご注文を受け付けました。売上は、選手の活動費を支えます。
        </p>
      </div>
      <ul className="w-full flex flex-col gap-3 rounded-2xl bg-[#f5f8fc] p-6 text-left text-sm text-[#3d3d3d] leading-relaxed">
        {STEPS.map((text) => (
          <li key={text} className="flex gap-3">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1a3060]" />
            {text}
          </li>
        ))}
      </ul>
      <Link
        href="/shop"
        className={`inline-flex min-h-11 items-center rounded-lg border border-[#1a3060] px-6 text-sm font-bold text-[#1a3060] transition-colors hover:bg-[#1a3060] hover:text-white ${focusRing}`}
      >
        ショップに戻る
      </Link>
    </main>
  );
}
