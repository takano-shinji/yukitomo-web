"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { IconCalendarEvent } from "@tabler/icons-react";
import { PREFECTURE_LABEL, type GroupSearchModel } from "@/lib/types";

const TOP_LIMIT = 10;

const REGION_GROUPS: { label: string; prefectures: string[] }[] = [
  { label: "北海道", prefectures: ["北海道"] },
  { label: "東北", prefectures: ["青森県","岩手県","宮城県","秋田県","山形県","福島県"] },
  { label: "関東", prefectures: ["茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県"] },
  { label: "北信越", prefectures: ["新潟県","富山県","石川県","福井県","長野県"] },
  { label: "中部", prefectures: ["山梨県","岐阜県","静岡県","愛知県","三重県"] },
  { label: "関西", prefectures: ["滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県"] },
  { label: "中国", prefectures: ["鳥取県","島根県","岡山県","広島県","山口県"] },
  { label: "四国", prefectures: ["徳島県","香川県","愛媛県","高知県"] },
  { label: "九州", prefectures: ["福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"] },
];

function LocationTags({
  locations,
  selected,
  onChange,
  theme,
}: {
  locations: string[];
  selected: string;
  onChange: (loc: string) => void;
  theme: "dark" | "light";
}) {
  const base = "px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer";
  const active = theme === "dark" ? "bg-white text-[#1a3060]" : "bg-[#1a3060] text-white";
  const inactive = theme === "dark" ? "bg-white/20 text-white hover:bg-white/30" : "bg-white/40 text-white hover:bg-white/60";
  const locationSet = new Set(locations);

  return (
    <div className="w-full flex flex-col gap-3">
      <div>
        <button
          className={`${base} ${selected === "" ? active : inactive}`}
          onClick={() => onChange("")}
        >
          すべて
        </button>
      </div>
      {REGION_GROUPS.map((region) => {
        const prefs = region.prefectures.filter((p) => locationSet.has(p));
        if (prefs.length === 0) return null;
        return (
          <div key={region.label} className="flex flex-col gap-2">
            <span className="text-xs font-medium text-white/50">{region.label}</span>
            <div className="flex flex-wrap gap-2">
              {prefs.map((loc) => (
                <button
                  key={loc}
                  className={`${base} ${selected === loc ? active : inactive}`}
                  onClick={() => onChange(loc)}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function GroupsSection({ groups, heroBg }: { groups: GroupSearchModel[]; heroBg: string }) {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [visibleCount, setVisibleCount] = useState(TOP_LIMIT);
  const listRef = useRef<HTMLElement>(null);
  const [today] = useState(() => Date.now());

  function prefName(group: GroupSearchModel): string {
    return group.prefectures != null ? PREFECTURE_LABEL[group.prefectures] ?? "" : "";
  }

  function scheduleLocation(schedule: NonNullable<GroupSearchModel["nextSchedule"]>): string {
    return schedule.skiAreaName || schedule.freeSkiAreaName || "";
  }

  const prefectureOrder = REGION_GROUPS.flatMap((r) => r.prefectures);
  const locations = Array.from(new Set(groups.map(prefName))).filter(Boolean).sort((a, b) => {
    const ai = prefectureOrder.indexOf(a);
    const bi = prefectureOrder.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b, "ja");
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  function nearestDate(group: GroupSearchModel): number {
    if (!group.nextSchedule) return Infinity;
    const date = new Date(group.nextSchedule.startDate).getTime();
    return date >= today ? date - today : today - date;
  }

  const filtered = (selectedLocation
    ? groups.filter((g) => prefName(g) === selectedLocation)
    : groups
  ).slice().sort((a, b) => {
    const aDate = nearestDate(a);
    const bDate = nearestDate(b);
    if (aDate === Infinity && bDate === Infinity) return (b.memberCount ?? 0) - (a.memberCount ?? 0);
    if (aDate === Infinity) return 1;
    if (bDate === Infinity) return -1;
    if (aDate !== bDate) return aDate - bDate;
    return (b.memberCount ?? 0) - (a.memberCount ?? 0);
  });

  function handleSelect(loc: string) {
    setSelectedLocation(loc);
    setVisibleCount(TOP_LIMIT);
    if (loc) {
      setTimeout(() => {
        listRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }

  return (
    <>
      {/* Section 2: フォト背景 + タグ絞り込み */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center text-white px-8"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/0" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-wide">Make YUKITOMO</h2>
          <p className="text-sm md:text-base tracking-widest">ー &ldquo;雪とも&rdquo;と最高の思い出を作ろうー</p>
        </div>
      </section>

      {/* グループ一覧 */}
      <section id="groups" ref={listRef} className="py-12 px-4 md:px-8" style={{ backgroundColor: "#8090a8" }}>
        <div className="max-w-2xl mx-auto flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-1 text-white/70">
              <span className="text-xs tracking-widest">グループを探す</span>
              <span className="animate-bounce text-lg">↓</span>
            </div>
            <p className="text-sm text-white/80">地方・都道府県で絞り込む</p>
            <LocationTags
              locations={locations}
              selected={selectedLocation}
              onChange={handleSelect}
              theme="dark"
            />
          </div>
          {selectedLocation && (
            <div className="text-center">
              <h3 className="text-xl font-bold text-white tracking-wide">
                {selectedLocation}の雪ともグループ
              </h3>
              <p className="text-sm text-white/60 mt-1">{filtered.length}件</p>
            </div>
          )}
          <div className="flex justify-end">
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
              <IconCalendarEvent size={14} stroke={2} /> スケジュールが近い順に表示
            </span>
          </div>
          {filtered.length === 0 ? (
            <p className="text-center text-white py-12">該当するグループが見つかりません</p>
          ) : (
            <>
              {filtered.slice(0, visibleCount).map((group) => (
                <Link key={group.groupId} href={`/groups/${group.groupId}`} className="block">
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={group.thumbnailImageUrl}
                        alt={group.groupName}
                        className="w-16 h-16 rounded-full object-cover shrink-0"
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-lg text-[#1a1a1a]">{group.groupName}</span>
                        <span className="font-normal text-sm text-gray-400">{group.memberCount}人</span>
                        {group.recruitmentFlg === 1 && (
                          <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: "#e05040" }}>
                            募集中
                          </span>
                        )}
                      </div>
                    </div>
                    {group.recruitmentMessage && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{group.recruitmentMessage}</p>
                    )}
                    {group.nextSchedule ? (
                      <div className="flex items-center gap-2 rounded-lg px-4 py-2.5" style={{ backgroundColor: "#eef2f8" }}>
                        <IconCalendarEvent size={28} stroke={2} style={{ color: "#1a3060" }} className="shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400 leading-none mb-0.5">次の予定</p>
                          <p className="text-sm font-bold" style={{ color: "#1a3060" }}>
                            {group.nextSchedule.startDate}　{scheduleLocation(group.nextSchedule)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2.5">
                        <IconCalendarEvent size={28} stroke={2} className="shrink-0 text-gray-300" />
                        <p className="text-sm text-gray-300">予定なし</p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
              {selectedLocation && visibleCount < filtered.length && (
                <button
                  onClick={() => setVisibleCount((v) => v + TOP_LIMIT)}
                  className="w-full py-3 rounded-xl bg-white/20 text-white font-medium hover:bg-white/30 transition-colors"
                >
                  もっと見る（残り{filtered.length - visibleCount}件）
                </button>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
