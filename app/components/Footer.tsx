import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

const LINK_GROUPS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "グループを探す",
    links: [
      { label: "グループ一覧", href: "/#groups" },
      { label: "都道府県から探す", href: "/#prefectures" },
    ],
  },
  {
    title: "ショップ",
    links: [
      { label: "ショップトップ", href: "/shop" },
      { label: "Adn ゴーグル・パーツ", href: "/shop/brand/adn" },
      { label: "特定商取引法に基づく表記", href: "/shop/tokushoho" },
    ],
  },
  {
    title: "サイト情報",
    links: [
      { label: "プライバシーポリシー", href: "/privacy" },
      { label: "お問い合わせ", href: "https://yukitomo.com/contact/", external: true },
      { label: "雪とも公式サイト", href: "https://yukitomo.com/", external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#14264d] text-white/80">
      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {LINK_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title} className="flex flex-col gap-3">
              <p className="text-xs tracking-widest text-white/50">{group.title}</p>
              <ul className="flex flex-col gap-2 text-sm">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a href={link.href} className="hover:text-white hover:underline underline-offset-2">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="hover:text-white hover:underline underline-offset-2">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col gap-1 text-xs text-white/50">
          <p>全国のスキー・スノボ仲間が見つかる「{SITE_NAME}」</p>
          <p>© {new Date().getFullYear()} {SITE_NAME}</p>
        </div>
      </div>
    </footer>
  );
}
