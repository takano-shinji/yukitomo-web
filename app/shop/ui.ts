// ショップ全体で使う見た目の部品（色・ボタン・色見本）をここにまとめる。

/** キーボード操作中だけ出るフォーカスの枠 */
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a3060]";

/** いちばん大事な操作（カートに入れる・レジに進む）のボタン */
export const btnPrimary = `w-full min-h-12 rounded-lg bg-[#1a3060] px-4 text-sm font-bold text-white transition-colors hover:bg-[#14264d] disabled:cursor-not-allowed disabled:bg-gray-300 ${focusRing}`;

/** フレーム・レンズの色見本（選択肢の名前 → 色） */
export const SWATCH: Record<string, string> = {
  Black: "#1c1c1c",
  White: "#ffffff",
  Blue: "#2f86e8",
  Red: "#e0442c",
  Gold: "#d6aa3a",
};
