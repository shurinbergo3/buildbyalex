/**
 * Client IP for rate limiting.
 *
 * `x-forwarded-for` is a list the client can seed: a request arriving with
 * `X-Forwarded-For: 1.2.3.4` becomes `1.2.3.4, <real ip>` after our proxy
 * appends. Reading the *first* entry therefore reads whatever the attacker
 * typed, and the rate limit is bypassed by rotating that value. We count from
 * the right instead — the last N entries were written by proxies we control.
 *
 * TRUSTED_PROXY_HOPS = how many proxies sit in front of the app (default 1:
 * the nginx/Dokploy layer). Behind Cloudflare + nginx set it to 2.
 */
const HOPS = (() => {
  const n = Number(process.env.TRUSTED_PROXY_HOPS);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
})();

export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const hops = xff
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const ip = hops[hops.length - HOPS];
    if (ip) return ip;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
