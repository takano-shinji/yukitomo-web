import Link from "next/link";
import { PREFECTURE_LIST, REGION_GROUPS } from "@/lib/prefectures";

/** 地域×目的の検索に向けた、クロール可能な都道府県ページへのリンク集。 */
export default function PrefectureLinks({
  currentSlug,
  availableNames,
  showEmpty = false,
  heading = "都道府県からスキー・スノボ仲間を探す",
}: {
  currentSlug?: string;
  /** グループが存在する都道府県名。未指定なら全都道府県を出す。 */
  availableNames?: Set<string>;
  /** true なら、グループがない県も出して「まだグループがありません」と添える。 */
  showEmpty?: boolean;
  heading?: string;
}) {
  const slugByName = new Map(PREFECTURE_LIST.map((p) => [p.name, p.slug]));
  const regions = REGION_GROUPS.map((r) => ({
    label: r.label,
    prefectures: r.prefectures.filter((n) => !availableNames || showEmpty || availableNames.has(n)),
  })).filter((r) => r.prefectures.length > 0);
  if (regions.length === 0) return null;

  return (
    <section className="py-16 px-6 md:px-12 bg-white">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <h2 className="text-xl md:text-2xl font-bold text-[#3d3d3d] text-center">{heading}</h2>
        {regions.map((region) => (
          <div key={region.label} className="flex flex-col gap-2">
            <span className="text-xs font-medium text-gray-400">{region.label}</span>
            <ul className="flex flex-wrap gap-2">
              {region.prefectures.map((name) => {
                const slug = slugByName.get(name)!;
                const current = slug === currentSlug;
                const empty = showEmpty && !current && availableNames != null && !availableNames.has(name);
                return (
                  <li key={name}>
                    <Link
                      href={`/prefectures/${slug}`}
                      aria-current={current ? "page" : undefined}
                      className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        current
                          ? "bg-[#1a3060] text-white"
                          : empty
                            ? "bg-gray-50 text-gray-400 hover:bg-gray-100"
                            : "bg-gray-100 text-[#1a3060] hover:bg-gray-200"
                      }`}
                    >
                      {name}
                      {empty && <span className="ml-1.5 text-[11px] font-normal">まだグループがありません</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
