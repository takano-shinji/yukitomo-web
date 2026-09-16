"use client";

import { useState } from "react";
import type { GroupMemberModel } from "@/lib/types";
import AppBadges from "@/app/components/AppBadges";

export default function OwnerCta({ owner }: { owner: GroupMemberModel }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="bg-white rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={owner.iconImageUrl}
            alt={owner.nickname}
            className="w-12 h-12 rounded-full object-cover shrink-0"
          />
          <div>
            <p className="text-xs text-gray-400 mb-0.5">オーナー</p>
            <p className="text-sm font-medium text-gray-700">{owner.nickname}</p>
          </div>
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
