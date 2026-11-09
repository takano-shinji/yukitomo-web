/**
 * 本番デプロイのビルド時に、必要な環境変数が揃っているか確認する。
 * 足りないまま公開すると、ステージングに接続したり、決済後の戻り先が localhost になったり、
 * Square のサンドボックスで動いたりするため、ビルドを失敗させて公開を止める。
 * （失敗したデプロイは公開されず、前のデプロイがそのまま動き続ける）
 *
 * Vercel の本番環境（VERCEL_ENV=production）のときだけ確認する。
 * プレビューやローカルでは、未設定でも開発用の初期値で動く。
 */
const REQUIRED = [
  "NEXT_PUBLIC_SITE_URL",
  "API_BASE_URL",
  "SQUARE_ACCESS_TOKEN",
  "SQUARE_LOCATION_ID",
  "SQUARE_WEBHOOK_SIGNATURE_KEY",
  "SQUARE_WEBHOOK_URL",
  "STOCK_SHEET_URL",
  "STOCK_SHEET_SECRET",
] as const;

export function assertProductionEnv(env: NodeJS.ProcessEnv = process.env): void {
  if (env.VERCEL_ENV !== "production") return;

  const problems: string[] = REQUIRED.filter((name) => !env[name]?.trim()).map((name) => `${name} が未設定です`);

  if (env.SQUARE_ENVIRONMENT !== "production") {
    problems.push("SQUARE_ENVIRONMENT が production ではありません（サンドボックスで動いてしまいます）");
  }
  const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "";
  if (siteUrl && !/^https:\/\//.test(siteUrl)) {
    problems.push("NEXT_PUBLIC_SITE_URL は https:// から始まる本番のURLにしてください");
  }
  if (/localhost|127\.0\.0\.1/.test(siteUrl)) {
    problems.push("NEXT_PUBLIC_SITE_URL が localhost になっています");
  }
  if (/\bstg\./.test(env.API_BASE_URL ?? "")) {
    problems.push("API_BASE_URL がステージング（stg）を指しています");
  }

  if (problems.length > 0) {
    throw new Error(
      `本番の環境変数に問題があるため、ビルドを中止しました。\n- ${problems.join("\n- ")}\n` +
        "Vercel の Settings > Environment Variables（Production）を確認してください。",
    );
  }
}
