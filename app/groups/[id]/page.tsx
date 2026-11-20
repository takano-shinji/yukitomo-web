import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGroup } from "@/lib/api";
import {
  LEVEL_RANGE_LABEL,
  PREFECTURE_LABEL,
  scheduleLocation,
  type GroupNextScheduleModel,
} from "@/lib/types";
import { HERO_BG, SITE_NAME, SITE_URL } from "@/lib/site";
import JsonLd from "@/app/components/JsonLd";
import { prefecturePath } from "@/lib/prefectures";
import OwnerCta from "./OwnerCta";
import AppBadges from "@/app/components/AppBadges";

/** 新しく作られたグループが60秒ほどで反映されるよう、ページ自体も60秒ごとに作り直す */
export const revalidate = 60;

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 gap-1">
      <dt className="sm:w-24 shrink-0 text-gray-400">{label}</dt>
      <dd className="text-gray-700">{value}</dd>
    </div>
  );
}

const SCHEDULE_VISIBLE = 5;

function ScheduleRow({ item }: { item: GroupNextScheduleModel }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 text-sm">
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
  );
}

function toDescription(text: string | undefined, maxLength = 120): string {
  const normalized = (text ?? "").replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1)}…` : normalized;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const group = await getGroup(id);
  if (!group) {
    return { title: "グループが見つかりません", robots: { index: false, follow: false } };
  }

  const prefectureName = group.prefectures != null ? PREFECTURE_LABEL[group.prefectures] : undefined;
  const title = prefectureName
    ? `${group.groupName}｜${prefectureName}のスキー・スノボ仲間募集`
    : `${group.groupName}｜スキー・スノボ仲間募集`;
  const description =
    toDescription(group.recruitmentMessage) ||
    toDescription(group.profile) ||
    `${prefectureName ? `${prefectureName}で活動する` : ""}スキー・スノボのグループ「${group.groupName}」のページです。`;
  const image =
    group.coverImageUrl ?? group.galleryImages[0]?.imageURL ?? group.thumbnailImageUrl ?? HERO_BG;
  const url = `/groups/${group.groupId}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "ja_JP",
      title: `${title}｜${SITE_NAME}`,
      description,
      url,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: `${title}｜${SITE_NAME}`, description, images: [image] },
  };
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
  const prefectureHref = group.prefectures != null ? prefecturePath(group.prefectures) : undefined;

  // トップ → 都道府県ページ → グループ の順。都道府県が不明なら2階層にする
  const breadcrumb = [
    { name: SITE_NAME, url: SITE_URL },
    ...(prefectureName && prefectureHref
      ? [{ name: `${prefectureName}のスキー・スノボサークル`, url: `${SITE_URL}${prefectureHref}` }]
      : []),
    { name: group.groupName, url: `${SITE_URL}/groups/${group.groupId}` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SportsOrganization",
        "@id": `${SITE_URL}/groups/${group.groupId}#group`,
        name: group.groupName,
        url: `${SITE_URL}/groups/${group.groupId}`,
        description: toDescription(group.recruitmentMessage) || toDescription(group.profile) || undefined,
        image: group.coverImageUrl ?? group.thumbnailImageUrl ?? group.galleryImages[0]?.imageURL,
        sport: "Skiing and Snowboarding",
        areaServed: prefectureName,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumb.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: b.url,
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <JsonLd data={jsonLd} />
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
              {prefectureName &&
                (prefectureHref ? (
                  <Link href={prefectureHref} className="inline-block text-sm md:text-base text-gray-500 mt-1 hover:underline">
                    {prefectureName}
                  </Link>
                ) : (
                  <p className="text-sm md:text-base text-gray-500 mt-1">{prefectureName}</p>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-8">
        <nav aria-label="パンくずリスト" className="text-xs text-gray-400 -mb-2">
          <Link href="/" className="hover:underline">
            {SITE_NAME}
          </Link>
          {prefectureName && prefectureHref && (
            <>
              <span className="mx-2">›</span>
              <Link href={prefectureHref} className="hover:underline">
                {prefectureName}
              </Link>
            </>
          )}
          <span className="mx-2">›</span>
          <span>{group.groupName}</span>
        </nav>

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
              {group.scheduleList.slice(0, SCHEDULE_VISIBLE).map((item) => (
                <ScheduleRow key={item.id} item={item} />
              ))}
              {group.scheduleList.length > SCHEDULE_VISIBLE && (
                // 折りたたんだ予定もHTMLには残るので、検索エンジンからは全件読める
                <details className="group flex flex-col gap-4">
                  <summary className="cursor-pointer list-none text-sm font-medium text-center py-2 rounded-lg bg-gray-50 text-[#1a3060] hover:bg-gray-100">
                    <span className="group-open:hidden">
                      残り{group.scheduleList.length - SCHEDULE_VISIBLE}件の予定を表示
                    </span>
                    <span className="hidden group-open:inline">閉じる</span>
                  </summary>
                  <div className="flex flex-col gap-4 mt-4">
                    {group.scheduleList.slice(SCHEDULE_VISIBLE).map((item) => (
                      <ScheduleRow key={item.id} item={item} />
                    ))}
                  </div>
                </details>
              )}
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
