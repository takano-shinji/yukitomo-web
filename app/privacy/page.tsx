import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  alternates: { canonical: "/privacy" },
};

const CONTACT_EMAIL = "info@yukitomo.com";

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. 取得する情報",
    body: (
      <>
        <p>当ショップでは、ご注文およびお問い合わせの際に、次の情報を取得します。</p>
        <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
          <li>お名前、配送先住所、電話番号、メールアドレス</li>
          <li>ご注文内容（商品、数量、金額、注文日時）</li>
          <li>紹介者コード（ご入力いただいた場合）</li>
          <li>お知らせメールの受け取りに関するご意向</li>
          <li>お問い合わせの内容</li>
        </ul>
      </>
    ),
  },
  {
    title: "2. クレジットカード情報について",
    body: (
      <p>
        クレジットカード情報は、決済代行サービス「Square」の決済画面で入力いただきます。カード番号等は当ショップのサーバーを経由せず、当ショップが取得・保存することはありません。
      </p>
    ),
  },
  {
    title: "3. 利用目的",
    body: (
      <ul className="list-disc pl-5 flex flex-col gap-1">
        <li>ご注文の確認、商品の発送、代金の決済に関する対応</li>
        <li>ご注文に関する連絡およびお問い合わせへの対応</li>
        <li>在庫および注文の管理</li>
        <li>紹介者コードをご入力いただいた方への、特典（ステッカー）の同梱と、紹介実績の集計</li>
        <li>お知らせメールの受け取りにご同意いただいた方への、新商品・イベント等のご案内の送信</li>
        <li>法令に基づく対応</li>
      </ul>
    ),
  },
  {
    title: "4. お知らせメールについて",
    body: (
      <>
        <p>
          お知らせメールは、ご注文時にカートで「お知らせメールを受け取る」にチェックをいただいた方にのみお送りします。チェックをされなかった場合、ご注文に関する連絡以外の目的でメールアドレスを利用することはありません。
        </p>
        <p className="mt-2">
          配信の停止をご希望の場合は、下記のお問い合わせ先までご連絡ください。ご連絡をいただいた後は、お知らせメールの送信を停止します。
        </p>
      </>
    ),
  },
  {
    title: "5. 第三者への提供・業務委託",
    body: (
      <>
        <p>
          取得した個人情報は、法令に基づく場合を除き、ご本人の同意なく第三者に提供しません。ただし、次の業務の実施に必要な範囲で、委託先に情報を取り扱わせることがあります。
        </p>
        <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
          <li>決済処理：Square</li>
          <li>商品の配送：配送事業者</li>
          <li>注文・在庫の管理：業務に利用するクラウドサービス</li>
        </ul>
      </>
    ),
  },
  {
    title: "6. カートの保存について",
    body: (
      <p>
        ショップのカートの内容は、お使いのブラウザ内（ローカルストレージ）にのみ保存されます。当ショップのサーバーに送信されることはありません。ブラウザのデータを削除すると、カートの内容も消去されます。
      </p>
    ),
  },
  {
    title: "7. 安全管理",
    body: (
      <p>
        個人情報の漏えい、滅失、毀損を防ぐため、必要かつ適切な安全管理に努めます。利用目的を達成した個人情報は、法令で保存が必要な期間を除き、適切に削除します。
      </p>
    ),
  },
  {
    title: "8. 開示・訂正・削除のご請求",
    body: (
      <p>
        ご本人から、保有する個人情報の開示、訂正、削除などのご請求があった場合は、本人確認のうえ、法令に基づき適切に対応します。下記のお問い合わせ先までご連絡ください。
      </p>
    ),
  },
  {
    title: "9. お問い合わせ先",
    body: (
      <p>
        運営責任者：鷹野真治
        <br />
        メールアドレス：
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#1a3060] underline">
          {CONTACT_EMAIL}
        </a>
      </p>
    ),
  },
  {
    title: "10. 改定について",
    body: <p>本ポリシーの内容は、必要に応じて予告なく改定することがあります。改定後は本ページに掲載します。</p>,
  },
];

export default function Privacy() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-[#3d3d3d]">プライバシーポリシー</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          雪ともオンラインショップ（以下「当ショップ」）は、お客様の個人情報を次のとおり取り扱います。
        </p>
      </div>

      {SECTIONS.map(({ title, body }) => (
        <section key={title} className="flex flex-col gap-2 text-sm text-gray-700 leading-relaxed">
          <h2 className="text-base font-bold text-[#3d3d3d]">{title}</h2>
          {body}
        </section>
      ))}

      <p className="text-xs text-gray-500 border-t border-gray-100 pt-4">
        <Link href="/shop/tokushoho" className="text-[#1a3060] underline">
          特定商取引法に基づく表記
        </Link>
      </p>
    </main>
  );
}
