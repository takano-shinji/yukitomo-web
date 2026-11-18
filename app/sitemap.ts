import type { MetadataRoute } from "next";
import { searchGroups } from "@/lib/api";
import { SITE_URL } from "@/lib/site";
import { prefecturePath } from "@/lib/prefectures";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 100;
const MAX_PAGES = 50;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const groupIds: string[] = [];
  const prefectureCodes = new Set<number>();
  for (let page = 0; page < MAX_PAGES; page++) {
    const batch = await searchGroups({ limit: PAGE_SIZE, offset: page * PAGE_SIZE });
    groupIds.push(...batch.map((g) => g.groupId));
    for (const g of batch) if (g.prefectures != null) prefectureCodes.add(g.prefectures);
    if (batch.length < PAGE_SIZE) break;
  }

  return [
    { url: SITE_URL },
    // グループが1件以上ある都道府県ページだけを載せる（0件のページは noindex）
    ...[...prefectureCodes].flatMap((code) => {
      const path = prefecturePath(code);
      return path ? [{ url: `${SITE_URL}${path}` }] : [];
    }),
    ...groupIds.map((id) => ({ url: `${SITE_URL}/groups/${id}` })),
  ];
}
