"use client";

import { useState } from "react";
import AppBadges from "@/app/components/AppBadges";

export default function OwnerCta() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="bg-white rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-bold text-[#1a1a1a] mb-1">このグループに参加したい方へ</h2>
          <p className="text-sm text-gray-500">オーナーにメッセージを送って参加を申請しよう</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="shrink-0 w-full sm:w-auto px-5 py-2.5 rounded-full text-white text-sm font-bold"
          style={{ backgroundColor: "#e05040" }}
        >
          メッセージを送る【応募】
        </button>
      </section>

      {/* アプリDL誘導モーダル */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-t-2xl p-8 flex flex-col items-center gap-5 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-bold text-[#1a1a1a]">
              アプリをダウンロードしよう！
            </p>
            <p className="text-sm text-gray-500">
              アプリからオーナーにメッセージを送って参加を申請しよう
            </p>
            <AppBadges />
            <button
              onClick={() => setModalOpen(false)}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
}
