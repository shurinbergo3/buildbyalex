export const runtime = "edge";

type Payload = {
  name: string;
  rating: number;
  role?: string;
  quote: string;
  locale: string;
};

function escape(s: string) {
  return s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!);
}

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

async function sendToTelegram(body: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[review] Telegram env not configured");
    return false;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: body,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    return res.ok;
  } catch {
    return false;
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

  const stars = "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
  const lines = [
    `⭐ <b>New review — buildbyalex</b>`,
    ``,
    `<b>Rating:</b> ${stars} (${rating}/5)`,
    `<b>Name:</b> ${escape(name)}`,
    role ? `<b>Role:</b> ${escape(role)}` : null,
    `<b>Locale:</b> ${escape(locale)}`,
    ``,
    `<b>Review:</b>`,
    escape(quote),
    ``,
    `<i>IP:</i> ${escape(ip)}`,
  ].filter(Boolean);

  const ok = await sendToTelegram(lines.join("\n"));
  if (!ok) {
    return Response.json(
      { ok: false, error: "Telegram delivery failed" },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
