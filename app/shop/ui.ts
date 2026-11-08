// ショップ全体で使う見た目の部品（色・ボタン・色見本）をここにまとめる。

/** キーボード操作中だけ出るフォーカスの枠 */
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a3060]";

/** 濃い背景（ネイビー）の上で使うフォーカスの枠 */
export const focusRingLight =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/** いちばん大事な操作（カートに入れる・レジに進む）のボタン */
export const btnPrimary = `w-full min-h-12 rounded-lg bg-[#1a3060] px-4 text-sm font-bold text-white transition-colors hover:bg-[#14264d] disabled:cursor-not-allowed disabled:bg-gray-300 ${focusRing}`;

/** リンクをボタンの形にする（カートに入れた後の選択肢で使う） */
export const linkBtn =
  "inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-bold transition-colors";
export const linkBtnPrimary = `${linkBtn} bg-[#1a3060] text-white hover:bg-[#14264d] ${focusRing}`;
export const linkBtnSecondary = `${linkBtn} border border-[#1a3060] bg-white text-[#1a3060] hover:bg-[#f0f4fa] ${focusRing}`;

/** ネイビーの面の上で使う、白いボタン */
export const btnOnNavy = `w-full min-h-12 rounded-lg bg-white px-4 text-sm font-bold text-[#1a3060] transition-colors hover:bg-[#e8eef8] disabled:cursor-not-allowed disabled:opacity-60 ${focusRingLight}`;

/** フレーム・レンズの色見本（選択肢の名前 → 色） */
export const SWATCH: Record<string, string> = {
  Black: "#1c1c1c",
  White: "#ffffff",
  Blue: "#2f86e8",
  Red: "#e0442c",
  Gold: "#d6aa3a",
};
