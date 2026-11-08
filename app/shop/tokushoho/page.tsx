import type { Metadata } from "next";
import Link from "next/link";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatYen } from "@/lib/shop/shipping";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  alternates: { canonical: "/shop/tokushoho" },
};

const CONTACT_EMAIL = "info@yukitomo.com";

const ROWS: { label: string; value: React.ReactNode }[] = [
  { label: "販売業者", value: "鷹野真治" },
  { label: "運営責任者", value: "鷹野真治" },
  {
    label: "所在地",
    value: "請求があった場合、遅滞なく開示いたします。下記メールアドレスまでご連絡ください。",
  },
  {
    label: "電話番号",
    value: "請求があった場合、遅滞なく開示いたします。下記メールアドレスまでご連絡ください。",
  },
  {
    label: "メールアドレス",
    value: (
      <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#1a3060] underline">
        {CONTACT_EMAIL}
      </a>
    ),
  },
  { label: "販売価格", value: "各商品ページに記載しています（表示価格はすべて税込です）。" },
  {
    label: "商品代金以外の必要料金",
    value: `送料：全国一律${formatYen(SHIPPING_FEE)}（税込）。商品代金の合計（税込）が${formatYen(FREE_SHIPPING_THRESHOLD)}以上の場合は送料無料です。`,
  },
  { label: "支払方法", value: "クレジットカード決済（Squareによる決済）" },
  { label: "支払時期", value: "ご注文確定時にお支払いが確定します。" },
  { label: "引渡時期", value: "ご注文確定後、5日以内に発送いたします。" },
  {
    label: "返品・交換",
    value:
      "商品に欠陥がある場合を除き、お客様のご都合による返品・交換はお受けできません。商品に欠陥があった場合は、商品到着後すみやかに上記メールアドレスまでご連絡ください。",
  },
];

export default function TokushohoPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
      <h1 className="text-xl md:text-2xl font-bold text-[#3d3d3d]">特定商取引法に基づく表記</h1>
      <dl className="flex flex-col divide-y divide-gray-100 border-y border-gray-100 text-sm">
        {ROWS.map(({ label, value }) => (
          <div key={label} className="flex flex-col sm:flex-row sm:gap-6 gap-1 py-4">
            <dt className="sm:w-48 shrink-0 font-bold text-[#3d3d3d]">{label}</dt>
            <dd className="text-gray-700 leading-relaxed">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-gray-500">
        個人情報の取り扱いは
        <Link href="/privacy" className="text-[#1a3060] underline mx-1">
          プライバシーポリシー
        </Link>
        をご確認ください。
      </p>
    </main>
  );
}
