/** 本番ドメイン。デプロイ先で NEXT_PUBLIC_SITE_URL を設定する（末尾スラッシュなし）。 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const SITE_NAME = "雪とも";

export const SITE_DESCRIPTION =
  "全国のスキー・スノボサークル、クラブチームが集結。あなたのレベルやホームゲレンデに合わせて、最高の「雪とも」が見つかる。";

export const HERO_BG =
  "https://storage.googleapis.com/studio-design-asset-files/projects/EjOQJw1oqJ/s-961x1704_v-fms_webp_cff9f9ba-5af5-40b1-a1b3-2fd5f8504676.webp";
