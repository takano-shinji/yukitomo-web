import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { searchAllGroups, searchGroups } from "@/lib/api";
import { PREFECTURE_LIST, prefectureBySlug } from "@/lib/prefectures";
import { PREFECTURE_LABEL, scheduleLocation, type GroupSearchModel } from "@/lib/types";
import { HERO_BG, SITE_NAME, SITE_URL } from "@/lib/site";
import JsonLd from "@/app/components/JsonLd";
import AppBadges from "@/app/components/AppBadges";
import PrefectureLinks from "@/app/components/PrefectureLinks";

export const dynamicParams = false;

export function generateStaticParams() {
  return PREFECTURE_LIST.map((p) => ({ slug: p.slug }));
}

async function loadGroups(code: number): Promise<GroupSearchModel[]> {
  const groups = await searchGroups({ prefecture: code });
  // APIが絞り込みを行わない場合に備えて、こちらでも都道府県を確認する
  return groups
    .filter((g) => g.prefectures === code)
    .sort((a, b) => (b.memberCount ?? 0) - (a.memberCount ?? 0));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pref = prefectureBySlug(slug);
  if (!pref) return {};

  const groups = await loadGroups(pref.code);
  const title = `${pref.name}のスキー・スノボサークル・仲間募集`;
  const description = `${pref.name}で活動するスキー・スノボのサークル、クラブチームを${
    groups.length > 0 ? `${groups.length}件` : ""
  }掲載。レベルやホームゲレンデに合わせて、一緒に滑る「雪とも」が見つかります。`;
  const url = `/prefectures/${pref.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    // グループが1件もない間は中身のないページなので検索結果に出さない
    robots: groups.length === 0 ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "ja_JP",
      title: `${title}｜${SITE_NAME}`,
      description,
      url,
      images: [groups[0]?.thumbnailImageUrl ?? HERO_BG],
    },
    twitter: { card: "summary_large_image", title: `${title}｜${SITE_NAME}`, description },
  };
}

export default async function PrefecturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pref = prefectureBySlug(slug);
  if (!pref) notFound();

  const [groups, allGroups] = await Promise.all([loadGroups(pref.code), searchAllGroups()]);
  const namesWithGroups = new Set(
    allGroups.flatMap((g) => (g.prefectures != null && PREFECTURE_LABEL[g.prefectures] ? [PREFECTURE_LABEL[g.prefectures]] : []))
  );
  const pageUrl = `${SITE_URL}/prefectures/${pref.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: `${pref.name}のスキー・スノボサークル`, item: pageUrl },
        ],
      },
      {
        "@type": "ItemList",
        name: `${pref.name}のスキー・スノボサークル`,
        itemListElement: groups.map((g, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: g.groupName,
          url: `${SITE_URL}/groups/${g.groupId}`,
        })),
      },
    ],
  };

  return (
    <main className="flex flex-col">
      <JsonLd data={jsonLd} />

      <section className="py-12 px-4 md:px-8" style={{ backgroundColor: "#8090a8" }}>
        <div className="max-w-2xl mx-auto flex flex-col gap-5">
          <nav aria-label="パンくずリスト" className="text-xs text-white/70">
            <Link href="/" className="hover:underline">
              {SITE_NAME}
            </Link>
            <span className="mx-2">›</span>
            <span>{pref.name}</span>
          </nav>

          <div className="text-center text-white">
            <h1 className="text-xl md:text-3xl font-bold tracking-wide leading-relaxed">
              {pref.name}のスキー・スノボサークル・仲間募集
            </h1>
            <p className="text-sm text-white/80 mt-3 leading-relaxed">
              {pref.name}で活動するスキー・スノーボードのサークル、クラブチームの一覧です。
              <br />
              レベルやホームゲレンデに合わせて、一緒に滑る「雪とも」を見つけましょう。
            </p>
            {groups.length > 0 && <p className="text-sm text-white/60 mt-2">{groups.length}件</p>}
          </div>

          {groups.length === 0 ? (
            <div className="bg-white rounded-xl px-6 py-12 flex flex-col items-center gap-6 text-center shadow-sm">
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                {pref.name}のグループはまだありません
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                アプリからグループを作って、
                <br />
                {pref.name}の最初の「雪とも」になろう！
              </p>
              <AppBadges />
            </div>
          ) : (
            groups.map((group) => (
              <Link key={group.groupId} href={`/groups/${group.groupId}`} className="block">
                <article className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    {group.thumbnailImageUrl && (
                      <img
                        src={group.thumbnailImageUrl}
                        alt={group.groupName}
                        loading="lazy"
                        className="w-16 h-16 rounded-full object-cover shrink-0"
                      />
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-lg text-[#1a1a1a]">{group.groupName}</h2>
                      <span className="font-normal text-sm text-gray-400">{group.memberCount}人</span>
                      {group.recruitmentFlg === 1 && (
                        <span
                          className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: "#e05040" }}
                        >
                          募集中
                        </span>
                      )}
                    </div>
                  </div>
                  {group.recruitmentMessage && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {group.recruitmentMessage}
                    </p>
                  )}
                  {group.nextSchedule && (
                    <p className="text-sm font-bold" style={{ color: "#1a3060" }}>
                      次の予定：{group.nextSchedule.startDate}　{scheduleLocation(group.nextSchedule)}
                    </p>
                  )}
                </article>
              </Link>
            ))
          )}
        </div>
      </section>

      <PrefectureLinks
        currentSlug={pref.slug}
        availableNames={namesWithGroups}
        showEmpty
        heading="ほかの都道府県から探す"
      />
    </main>
  );
}
