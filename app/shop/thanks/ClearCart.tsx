"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/shop/cart";

export default function ClearCart() {
  const { lines, remove } = useCart();
  useEffect(() => {
    lines.forEach((l) => remove(l.variantId));
  }, [lines, remove]);
  return null;
}
