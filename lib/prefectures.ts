import { PREFECTURES } from "./types";

/** 都道府県ページのURL用スラッグ（/prefectures/nagano）。キーは都道府県コード。 */
const SLUG_BY_CODE: Record<number, string> = {
  1: "hokkaido", 2: "aomori", 3: "iwate", 4: "miyagi", 5: "akita", 6: "yamagata", 7: "fukushima",
  8: "ibaraki", 9: "tochigi", 10: "gunma", 11: "saitama", 12: "chiba", 13: "tokyo", 14: "kanagawa",
  15: "niigata", 16: "toyama", 17: "ishikawa", 18: "fukui", 19: "yamanashi", 20: "nagano",
  21: "gifu", 22: "shizuoka", 23: "aichi", 24: "mie", 25: "shiga", 26: "kyoto", 27: "osaka",
  28: "hyogo", 29: "nara", 30: "wakayama", 31: "tottori", 32: "shimane", 33: "okayama",
  34: "hiroshima", 35: "yamaguchi", 36: "tokushima", 37: "kagawa", 38: "ehime", 39: "kochi",
  40: "fukuoka", 41: "saga", 42: "nagasaki", 43: "kumamoto", 44: "oita", 45: "miyazaki",
  46: "kagoshima", 47: "okinawa",
};

export type PrefectureInfo = { code: number; name: string; slug: string };

export const PREFECTURE_LIST: PrefectureInfo[] = PREFECTURES.map((p) => ({
  ...p,
  slug: SLUG_BY_CODE[p.code],
}));

export function prefectureBySlug(slug: string): PrefectureInfo | undefined {
  return PREFECTURE_LIST.find((p) => p.slug === slug);
}

export function prefecturePath(code: number): string | undefined {
  const slug = SLUG_BY_CODE[code];
  return slug ? `/prefectures/${slug}` : undefined;
}

export const REGION_GROUPS: { label: string; prefectures: string[] }[] = [
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
