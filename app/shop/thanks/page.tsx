import type { Metadata } from "next";
import Link from "next/link";
import ClearCart from "./ClearCart";

export const metadata: Metadata = {
  title: "ご注文ありがとうございました",
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <main className="max-w-xl mx-auto px-6 py-20 flex flex-col items-center gap-6 text-center">
      <ClearCart />
      <h1 className="text-xl md:text-2xl font-bold text-[#3d3d3d]">ご注文ありがとうございます</h1>
      <p className="text-sm text-gray-600 leading-relaxed">
        ご注文を受け付けました。決済完了のメールがSquareから届きます。
        <br />
        商品はご注文確定後、5日以内に発送いたします。
      </p>
      <Link href="/shop" className="text-sm text-[#1a3060] underline">
        ショップに戻る
      </Link>
    </main>
  );
}
