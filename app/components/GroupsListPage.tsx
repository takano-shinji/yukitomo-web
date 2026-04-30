"use client";

import { useState } from "react";
import Link from "next/link";
import type { Group } from "@/lib/types";

const PAGE_SIZE = 10;

export default function GroupsListPage({ groups }: { groups: Group[] }) {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const locations = Array.from(new Set(groups.map((g) => g.location)));

  function nearestDate(group: Group): number {
    if (group.schedule.length === 0) return Infinity;
    const today = Date.now();
    const dates = group.schedule.map((s) => new Date(s.date).getTime());
    const future = dates.filter((d) => d >= today);
    if (future.length > 0) return Math.min(...future) - today;
    return today - Math.max(...dates);
  }

  const filtered = (selectedLocation
    ? groups.filter((g) => g.location === selectedLocation)
    : groups
  ).slice().sort((a, b) => {
    const aDate = nearestDate(a);
    const bDate = nearestDate(b);
    if (aDate === Infinity && bDate === Infinity) return b.members.length - a.members.length;
    if (aDate === Infinity) return 1;
    if (bDate === Infinity) return -1;
    if (aDate !== bDate) return aDate - bDate;
    return b.members.length - a.members.length;
  });

  function handleLocationChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedLocation(e.target.value);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#8090a8" }}>
      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-5">

        {/* ヘッダー */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-white/70 hover:text-white">← トップに戻る</Link>
          <h1 className="text-white font-bold text-xl">グループを探す</h1>
        </div>

        {/* 所在地フィルター */}
        <select
          className="w-full px-4 py-3 rounded-xl bg-white text-gray-600 appearance-none cursor-pointer"
          value={selectedLocation}
          onChange={handleLocationChange}
        >
          <option value="">グループの所在地（すべて）</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        {/* 件数表示 */}
        <p className="text-white/70 text-sm">{filtered.length}件のグループが見つかりました</p>

        {/* グループ一覧 */}
        {filtered.length === 0 ? (
          <p className="text-center text-white py-12">該当するグループが見つかりません</p>
        ) : (
          <>
            {filtered.slice(0, visibleCount).map((group) => (
              <Link key={group.id} href={`/groups/${group.id}`} className="block">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={group.iconUrl}
                      alt={group.name}
                      className="w-16 h-16 rounded-full object-cover shrink-0"
                    />
                    <div className="font-bold text-lg text-[#1a1a1a]">
                      {group.name}
                      <span className="ml-3 font-normal text-sm text-gray-400">
                        {group.members.length}人
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{group.recruitment}</p>
                </div>
              </Link>
            ))}
            {visibleCount < filtered.length && (
              <button
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                className="w-full py-3 rounded-xl bg-white/20 text-white font-medium hover:bg-white/30 transition-colors"
              >
                もっと見る（残り{filtered.length - visibleCount}件）
              </button>
            )}
          </>
        )}
      </div>
    </main>
  );
}
