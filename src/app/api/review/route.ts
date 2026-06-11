import { isDuplicate, rateLimit } from "@/lib/rateLimit";
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

export async function POST(req: Request) {
  let data: Partial<Payload>;
  try {
    data = (await req.json()) as Partial<Payload>;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = (data.name ?? "").trim();
  const role = (data.role ?? "").trim().slice(0, 120);
  const quote = (data.quote ?? "").trim();
  const rating = Number(data.rating);
  const locale = (data.locale ?? "ru").trim().slice(0, 10);

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

  const allowed = await rateLimit("review", ip, 3);
  if (!allowed) {
    return Response.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  // Identical resubmit within 10 min — already stored, just acknowledge.
  if (await isDuplicate("review", name.toLowerCase(), quote)) {
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
