import Link from "next/link";
import { focusRing } from "./ui";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <footer className="mt-auto border-t border-gray-100 py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-600">
          <Link href="/shop/tokushoho" className={`py-1 hover:text-[#1a3060] ${focusRing}`}>
            特定商取引法に基づく表記
          </Link>
          <Link href="/privacy" className={`py-1 hover:text-[#1a3060] ${focusRing}`}>
            プライバシーポリシー
          </Link>
          <span>© 雪とも</span>
        </div>
      </footer>
    </>
  );
}
