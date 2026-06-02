import { addReview } from "@/lib/store";
import { notifyReview } from "@/lib/telegram";

// Node runtime — we persist reviews to a file-based store (not available on edge).
export const runtime = "nodejs";

type Payload = {
  name: string;
  rating: number;
  role?: string;
  quote: string;
  locale: string;
};

async function rateLimit(ip: string, name: string): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return true; // graceful: no rate-limit if not configured
  try {
    const key = `review:${ip}:${name.toLowerCase()}`;
    const res = await fetch(`${url}/set/${encodeURIComponent(key)}/1?nx=true&ex=600`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return true;
    const data = (await res.json()) as { result: string | null };
    return data.result === "OK";
  } catch {
    return true;
  }
}

export async function POST(req: Request) {
  let data: Partial<Payload>;
  try {
    data = (await req.json()) as Partial<Payload>;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = (data.name ?? "").trim();
  const role = (data.role ?? "").trim();
  const quote = (data.quote ?? "").trim();
  const rating = Number(data.rating);
  const locale = (data.locale ?? "ru").trim();

  if (!name || name.length > 120) {
    return Response.json({ ok: false, error: "Name required" }, { status: 400 });
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return Response.json({ ok: false, error: "Rating required" }, { status: 400 });
  }
  if (!quote || quote.length > 5000) {
    return Response.json({ ok: false, error: "Review text required" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const allowed = await rateLimit(ip, name);
  if (!allowed) {
    // Silent success — dedupe within 10 min
    return Response.json({ ok: true, deduped: true });
  }

  let review;
  try {
    review = await addReview({
      name,
      role: role || undefined,
      rating,
      quote,
      locale,
      ip,
    });
  } catch (err) {
    console.error("[review] failed to persist review", err);
    return Response.json({ ok: false, error: "Storage error" }, { status: 500 });
  }

  await notifyReview(review);

  return Response.json({ ok: true });
}
