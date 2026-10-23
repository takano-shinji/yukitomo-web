import type { MetadataRoute } from "next";
import { searchGroups } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 100;
const MAX_PAGES = 50;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const groupIds: string[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const batch = await searchGroups({ limit: PAGE_SIZE, offset: page * PAGE_SIZE });
    groupIds.push(...batch.map((g) => g.groupId));
    if (batch.length < PAGE_SIZE) break;
  }

  return [
    { url: SITE_URL },
    ...groupIds.map((id) => ({ url: `${SITE_URL}/groups/${id}` })),
  ];
}
