"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "ホーム", href: "https://yukitomo.com/" },
  { label: "グループを探す", href: "/#groups", scroll: true },
  { label: "ショップ", href: "https://yakitomo.official.ec/" },
  { label: "お問い合わせ", href: "https://yukitomo.com/contact/" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleGroupsClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname === "/") {
      e.preventDefault();
      document.getElementById("groups")?.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* ロゴ */}
        <a href="https://yukitomo.com/" className="shrink-0">
          <img src="/雪ともロゴ.png" alt="雪とも" className="h-8 w-auto" />
        </a>

        {/* デスクトップナビ */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map(({ label, href, scroll }) => (
            <Link
              key={label}
              href={href}
              onClick={scroll ? handleGroupsClick : undefined}
              className="text-sm font-medium text-[#3d3d3d] hover:text-[#1a3060] transition-colors whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* ハンバーガーボタン（モバイルのみ） */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="メニュー"
        >
          <span className={`block w-6 h-0.5 bg-[#3d3d3d] transition-transform duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[#3d3d3d] transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[#3d3d3d] transition-transform duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* モバイルメニュー */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {NAV_ITEMS.map(({ label, href, scroll }) => (
            <Link
              key={label}
              href={href}
              onClick={scroll ? handleGroupsClick : () => setMenuOpen(false)}
              className="text-sm font-medium text-[#3d3d3d] hover:text-[#1a3060] transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
