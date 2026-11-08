"use client";

import { useCallback, useSyncExternalStore } from "react";

export type CartLine = { productId: string; variantId: string; qty: number };

const KEY = "yukitomo-cart-v1";
const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();
let cache: { raw: string | null; lines: CartLine[] } = { raw: null, lines: EMPTY };

function read(): CartLine[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cache.raw) return cache.lines;
  let lines: CartLine[] = EMPTY;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      lines = parsed.filter(
        (l): l is CartLine =>
          typeof l?.productId === "string" &&
          typeof l?.variantId === "string" &&
          Number.isInteger(l?.qty) &&
          l.qty > 0,
      );
    }
  } catch {
    lines = EMPTY;
  }
  cache = { raw, lines };
  return lines;
}

function write(lines: CartLine[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // 保存できない環境では何もしない
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function useCart() {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY);

  const add = useCallback((productId: string, variantId: string, qty: number, max: number) => {
    const current = read();
    const existing = current.find((l) => l.variantId === variantId);
    const next = existing
      ? current.map((l) =>
          l.variantId === variantId ? { ...l, qty: Math.min(l.qty + qty, max) } : l,
        )
      : [...current, { productId, variantId, qty: Math.min(qty, max) }];
    write(next);
  }, []);

  const setQty = useCallback((variantId: string, qty: number) => {
    const current = read();
    write(
      qty <= 0
        ? current.filter((l) => l.variantId !== variantId)
        : current.map((l) => (l.variantId === variantId ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((variantId: string) => {
    write(read().filter((l) => l.variantId !== variantId));
  }, []);

  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  return { lines, count, add, setQty, remove };
}
