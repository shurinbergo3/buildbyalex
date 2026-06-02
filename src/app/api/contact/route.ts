import { addLead } from "@/lib/store";
import { notifyLead } from "@/lib/telegram";

// Node runtime — we persist leads to a file-based store (not available on edge).
export const runtime = "nodejs";

type Payload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  type: string;
  budget: string;
  description: string;
  locale: string;
};

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

async function rateLimit(ip: string, email: string): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return true; // graceful: no rate-limit if not configured
  try {
    const key = `contact:${ip}:${email.toLowerCase()}`;
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
  const email = (data.email ?? "").trim();
  const phone = (data.phone ?? "").trim().slice(0, 40);
  const company = (data.company ?? "").trim();
  const type = (data.type ?? "").trim();
  const budget = (data.budget ?? "").trim();
  const description = (data.description ?? "").trim();
  const locale = (data.locale ?? "ru").trim();

  if (!name || name.length > 120) {
    return Response.json({ ok: false, error: "Name required" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return Response.json({ ok: false, error: "Valid email required" }, { status: 400 });
  }
  if (!description || description.length > 5000) {
    return Response.json({ ok: false, error: "Description required" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const allowed = await rateLimit(ip, email);
  if (!allowed) {
    // Silent success — dedupe within 10 min
    return Response.json({ ok: true, deduped: true });
  }

  // Persist first so the lead is never lost, even if Telegram is down.
  let lead;
  try {
    lead = await addLead({
      name,
      email,
      phone: phone || undefined,
      company: company || undefined,
      type: type || undefined,
      budget: budget || undefined,
      description,
      locale,
      ip,
    });
  } catch (err) {
    console.error("[contact] failed to persist lead", err);
    return Response.json({ ok: false, error: "Storage error" }, { status: 500 });
  }

  // Notify the admin. Don't fail the request if delivery hiccups — the lead is saved.
  await notifyLead(lead);

  return Response.json({ ok: true });
}
