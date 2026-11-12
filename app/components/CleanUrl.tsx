"use client";

import { useEffect } from "react";

/**
 * yukitomo.com（WordPress の Site Kit）からのリンクには、Google アナリティクスの
 * クロスドメイン用パラメータ `_gl` が自動で付く。このサイトには GA を入れておらず不要なので、
 * 表示後にアドレスバーから取り除く（他のパラメータとページ内リンク #… はそのまま残す）。
 */
export default function CleanUrl() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("_gl")) return;
    url.searchParams.delete("_gl");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, []);
  return null;
}
