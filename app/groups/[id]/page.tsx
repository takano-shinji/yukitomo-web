import { notFound } from "next/navigation";
import Link from "next/link";
import { getGroup } from "@/lib/api";
import { LEVEL_RANGE_LABEL, PREFECTURE_LABEL, scheduleLocation } from "@/lib/types";
import OwnerCta from "./OwnerCta";
import AppBadges from "@/app/components/AppBadges";

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 gap-1">
      <dt className="sm:w-24 shrink-0 text-gray-400">{label}</dt>
      <dd className="text-gray-700">{value}</dd>
    </div>
  );
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const group = await getGroup(id);
  if (!group) notFound();

  const coverImage = group.coverImageUrl ?? group.galleryImages[0]?.imageURL;
  const prefectureName = group.prefectures != null ? PREFECTURE_LABEL[group.prefectures] : undefined;
  const levelLabel = group.levelRange != null ? LEVEL_RANGE_LABEL[group.levelRange] : undefined;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* カバー画像 + グループヘッダー */}
      <div className="relative w-full aspect-video bg-gray-200">
        {coverImage && (
          <img
            src={coverImage}
            alt={`${group.groupName} カバー画像`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="fixed top-16 left-4 z-50">
          <Link
            href="/"
            className="flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full hover:bg-black/60 transition-colors"
          >
            ← トップに戻る
          </Link>
        </div>
        {/* 中央のグループ情報パネル */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl px-6 md:px-12 py-5 md:py-7 flex items-center gap-4 md:gap-6 shadow-lg w-full max-w-sm md:max-w-none md:w-auto">
            {group.thumbnailImageUrl ? (
              <img
                src={group.thumbnailImageUrl}
                alt={group.groupName}
                className="w-16 h-16 md:w-28 md:h-28 rounded-full object-cover shrink-0"
              />
            ) : (
              <div
                aria-hidden
                className="w-16 h-16 md:w-28 md:h-28 rounded-full shrink-0 flex items-center justify-center text-white text-2xl md:text-4xl font-bold"
                style={{ backgroundColor: "#1a3060" }}
              >
                {group.groupName.slice(0, 1)}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl md:text-3xl font-bold text-[#1a1a1a] break-words">{group.groupName}</h1>
              {prefectureName && <p className="text-sm md:text-base text-gray-500 mt-1">{prefectureName}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-8">

        {/* 募集文 */}
        {group.recruitmentMessage && (
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-[#1a1a1a] mb-3">こんな人を募集しています</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{group.recruitmentMessage}</p>
          </section>
        )}

        {/* グループ情報 */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-[#1a1a1a] mb-4">グループ情報</h2>
          <dl className="flex flex-col gap-3 text-sm">
            <InfoRow label="所在地" value={prefectureName} />
            <InfoRow label="活動場所" value={group.activityArea} />
            <InfoRow label="レベル" value={levelLabel} />
            <InfoRow label="活動頻度" value={group.activityFrequency} />
            <InfoRow label="メンバー数" value={`${group.memberCount}人`} />
          </dl>
        </section>

        {/* 自己紹介・ルール */}
        {group.profile?.trim() && (
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-[#1a1a1a] mb-3">自己紹介・ルール</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {group.profile}
            </p>
          </section>
        )}

        {/* オーナーにメッセージ CTA */}
        <OwnerCta />

        {/* スケジュール */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-[#1a1a1a] mb-4">スケジュール</h2>
          {group.scheduleList.length === 0 ? (
            <p className="text-sm text-gray-400">予定はありません</p>
          ) : (
            <div className="flex flex-col gap-4">
              {group.scheduleList.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:gap-4 gap-1 text-sm">
                  <div className="sm:w-24 shrink-0 text-gray-400">
                    {item.startDate}
                    {item.endDate && item.endDate !== item.startDate && (
                      <span className="block">〜 {item.endDate}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">{item.eventName}</p>
                    <p className="text-gray-400">{scheduleLocation(item)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ギャラリー */}
        {group.galleryImages.length > 0 && (
          <section className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-[#1a1a1a] mb-4">ギャラリー</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {group.galleryImages.map((img) => (
                <img
                  key={img.id}
                  src={img.imageURL}
                  alt={`${group.groupName} ギャラリー画像`}
                  className="w-40 h-28 object-cover rounded-lg shrink-0"
                />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section
          className="rounded-xl py-10 px-8 flex flex-col items-center gap-6 text-center"
          style={{ backgroundColor: "#1a3060" }}
        >
          <p className="text-white font-bold text-lg">
            {group.groupName}に参加したい？
          </p>
          <p className="text-white/70 text-sm">
            アプリからオーナーにメッセージを送ろう
          </p>
          <AppBadges />
        </section>

      </div>
    </main>
  );
}
