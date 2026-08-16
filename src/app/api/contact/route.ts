import { clientIp } from "@/lib/clientIp";
import { isDuplicate, rateLimit } from "@/lib/rateLimit";
import { addLead } from "@/lib/store";
import { notifyLead } from "@/lib/telegram";
import { emailLead } from "@/lib/email";

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

export async function POST(req: Request) {
  let data: Partial<Payload>;
  try {
    data = (await req.json()) as Partial<Payload>;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim().slice(0, 254);
  const phone = (data.phone ?? "").trim().slice(0, 40);
  const company = (data.company ?? "").trim().slice(0, 200);
  const type = (data.type ?? "").trim().slice(0, 40);
  const budget = (data.budget ?? "").trim().slice(0, 40);
  const description = (data.description ?? "").trim();
  const locale = (data.locale ?? "ru").trim().slice(0, 10);

  if (!name || name.length > 120) {
    return Response.json({ ok: false, error: "Name required" }, { status: 400 });
  }
  // One way to reach them is enough — email or phone. Demanding both, plus a
  // written brief, filtered out more real leads than spam.
  if (!email && !phone) {
    return Response.json({ ok: false, error: "Email or phone required" }, { status: 400 });
  }
  if (email && !isValidEmail(email)) {
    return Response.json({ ok: false, error: "Valid email required" }, { status: 400 });
  }
  if (description.length > 5000) {
    return Response.json({ ok: false, error: "Description too long" }, { status: 400 });
  }

  const ip = clientIp(req);

  const allowed = await rateLimit("contact", ip, 5);
  if (!allowed) {
    return Response.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  // Identical resubmit within 10 min (double click, impatient refresh) — the
  // lead is already stored, so just acknowledge. Changed content passes through.
  // The description is optional now, so it can't carry the key alone: without
  // the type/budget fallback two different enquiries from one phone number
  // would collapse into one.
  const dedupeContact = (email || phone).toLowerCase();
  if (await isDuplicate("contact", dedupeContact, description || `${type}|${budget}`)) {
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

  // Notify the admin on both channels. Neither can fail the request — the lead
  // is already stored — and each covers the other: Telegram is instant, email
  // survives a revoked bot token.
  await Promise.allSettled([notifyLead(lead), emailLead(lead)]);

  return Response.json({ ok: true });
}
