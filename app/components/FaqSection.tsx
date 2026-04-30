"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "アプリは無料で使えますか？",
    a: "はい、アプリのダウンロード・グループの閲覧・メッセージ送信まで、基本機能はすべて無料でご利用いただけます。",
  },
  {
    q: "初心者でも参加できますか？",
    a: "もちろんです！グループごとに「初心者歓迎」「オールラウンド」「中上級者」のレベル表示があります。自分のレベルに合ったグループを探してみてください。",
  },
  {
    q: "スキーとスノーボードどちらでも使えますか？",
    a: "はい、スキー・スノーボード両方のグループが登録されています。グループページで詳細をご確認ください。",
  },
  {
    q: "グループへの参加方法を教えてください。",
    a: "アプリからグループのオーナーにメッセージを送って参加申請するスタイルです。気になるグループを見つけたら、まず一言メッセージを送ってみましょう！",
  },
  {
    q: "グループを作ることはできますか？",
    a: "できます！アプリからグループアカウントを作成すると、全国のスキー・スノボ仲間に向けてメンバー募集ができます。スケジュールを登録するとグループ一覧の上位に表示され、メンバー数が多いグループほど優先的に上位表示されます。",
  },
  {
    q: "参加費はかかりますか？",
    a: "雪ともへの参加費は無料です。ただし、各グループが設定する会費や、ゲレンデのリフト代・交通費などは別途かかる場合があります。詳細は各グループのオーナーにご確認ください。",
  },
  {
    q: "道具がなくても参加できますか？",
    a: "多くのゲレンデにはレンタルサービスがあります。道具を持っていなくても安心して参加できます。グループによってはレンタルをまとめて手配してくれる場合もあるので、オーナーに相談してみてください。",
  },
  {
    q: "全国どこでも使えますか？",
    a: "はい、北海道から九州まで全国のグループが登録されています。お住まいの地域や行きたいゲレンデで絞り込んでみてください。",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-none">
      <button
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-sm md:text-base font-medium text-[#1a1a1a]">{q}</span>
        <span
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold transition-transform duration-200"
          style={{ backgroundColor: "#1a3060", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          ＋
        </span>
      </button>
      {open && (
        <p className="pb-4 text-sm text-gray-500 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function FaqSection() {
  return (
    <section className="py-16 px-6 md:px-12 bg-gray-50">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div className="text-center">
          <p className="text-xs tracking-widest text-gray-400 uppercase mb-2">FAQ</p>
          <h2 className="text-xl md:text-2xl font-bold text-[#3d3d3d]">よくあるご質問</h2>
        </div>
        <div className="bg-white rounded-xl px-6 shadow-sm">
          {FAQS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
