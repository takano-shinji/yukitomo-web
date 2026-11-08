import Link from "next/link";
import { focusRingLight } from "./ui";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <footer className="mt-auto bg-[#1a3060] py-10 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/80">
          <Link href="/shop/tokushoho" className={`py-1 hover:text-white hover:underline ${focusRingLight}`}>
            特定商取引法に基づく表記
          </Link>
          <Link href="/privacy" className={`py-1 hover:text-white hover:underline ${focusRingLight}`}>
            プライバシーポリシー
          </Link>
          <span>© 雪とも</span>
        </div>
      </footer>
    </>
  );
}
