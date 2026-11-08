"use client";

import Link from "next/link";
import { useCart } from "@/lib/shop/cart";

export default function CartLink({ onClick }: { onClick?: () => void }) {
  const { count } = useCart();
  return (
    <Link
      href="/shop/cart"
      onClick={onClick}
      className="relative text-sm font-medium text-[#3d3d3d] hover:text-[#1a3060] transition-colors whitespace-nowrap"
    >
      カート
      {count > 0 && (
        <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-[#1a3060] text-white text-xs">
          {count}
        </span>
      )}
    </Link>
  );
}
