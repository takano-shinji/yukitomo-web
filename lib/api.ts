import { cache } from "react";
import type { GroupSearchModel, WebGroupDetailModel } from "./types";

const API_BASE_URL = "https://stg.yukitomo.link";
const APP_VERSION = "11.23.45";

const requestInit: RequestInit = {
  headers: { "App-Version": APP_VERSION },
  cache: "no-store",
};

/** GET /web/searchGroup（認証不要）。公開グループの一覧を返す。 */
export async function searchGroups(params?: {
  prefecture?: number;
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<GroupSearchModel[]> {
  const query = new URLSearchParams();
  if (params?.prefecture != null) query.set("prefecture", String(params.prefecture));
  if (params?.q) query.set("q", params.q);
  query.set("limit", String(params?.limit ?? 100));
  query.set("offset", String(params?.offset ?? 0));

  try {
    const res = await fetch(`${API_BASE_URL}/web/searchGroup?${query.toString()}`, requestInit);
    if (!res.ok) return [];
    const data: { groupList: GroupSearchModel[] } = await res.json();
    return data.groupList;
  } catch {
    return [];
  }
}

/** GET /web/getGroup（認証不要）。非公開・削除済み・存在しないグループは null。 */
export const getGroup = cache(async (id: string): Promise<WebGroupDetailModel | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/web/getGroup?id=${encodeURIComponent(id)}`, requestInit);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
});
