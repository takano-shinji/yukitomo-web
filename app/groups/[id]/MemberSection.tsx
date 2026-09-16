"use client";

import { useState } from "react";
import type { GroupMemberModel } from "@/lib/types";
import AppBadges from "@/app/components/AppBadges";

const INITIAL_LIMIT = 3;

export default function MemberSection({ members, ownerId }: { members: GroupMemberModel[]; ownerId: string }) {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const visible = expanded ? members : members.slice(0, INITIAL_LIMIT);
  const hasMore = members.length > INITIAL_LIMIT;

  return (
    <>
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-[#1a1a1a] mb-4">
          メンバー
          <span className="ml-2 font-normal text-sm text-gray-400">{members.length}人</span>
        </h2>

        <div className="flex flex-col gap-3">
          {visible.map((member) => (
            <button
              key={member.accountId}
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-3 text-left hover:bg-gray-50 rounded-lg p-1 -mx-1 transition-colors"
            >
              <img
                src={member.iconImageUrl}
                alt={member.nickname}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700">{member.nickname}</p>
                {member.accountId === ownerId && (
                  <span className="text-xs text-white bg-[#1a3060] px-2 py-0.5 rounded-full">
                    オーナー
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-4 w-full py-2 rounded-lg border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            {expanded ? "閉じる　▲" : `もっと見る（+${members.length - INITIAL_LIMIT}人）　▼`}
          </button>
        )}
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
              メンバーのプロフィールを見るには
              <br />アプリが必要です
            </p>
            <p className="text-sm text-gray-500">
              アプリをダウンロードして、メンバーのプロフィールを確認しよう
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
