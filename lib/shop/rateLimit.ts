import "server-only";

/**
 * 簡易レート制限（メモリ上）。決済APIの連打で、スプレッドシートやSquareへの
 * 呼び出し・関数の実行時間が増え続けるのを防ぐ。
 * サーバーレスではインスタンスごとの数え方になるため、完全な防御ではない。
 * 本格的に防ぐなら Vercel Firewall のレート制限も併用する。
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5000;

/** true なら通してよい。windowMs の間に limit 回まで。 */
export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (buckets.size > MAX_KEYS) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    // 掃除しても多いままなら、メモリを守るため全部捨てる
    if (buckets.size > MAX_KEYS) buckets.clear();
  }
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (forwarded?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "unknown").trim();
}
