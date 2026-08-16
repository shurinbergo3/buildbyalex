import type { Lead } from "./store";
import { CONTACT_EMAIL } from "./contacts";

/**
 * Email copy of every lead.
 *
 * Telegram is the fast channel, but it's a single point of failure: a revoked
 * bot token or a cleared chat and the enquiry exists only as a row in the data
 * volume, where nobody looks. This sends the same lead to the inbox as well.
 *
 * Uses Resend's REST API over plain fetch — no dependency, no SMTP credentials
 * in the repo. Silent no-op until RESEND_API_KEY is set, so nothing changes
 * until you want it to.
 *
 * Setup: create a key at resend.com (the free tier covers 3 000 emails/month),
 * verify buildbyalex.com as a sending domain, then set
 *   RESEND_API_KEY=re_...
 *   LEAD_EMAIL_TO=info@buildbyalex.com     (optional, defaults to CONTACT_EMAIL)
 *   LEAD_EMAIL_FROM="buildbyalex <leads@buildbyalex.com>"  (optional)
 */

const ENDPOINT = "https://api.resend.com/emails";

const TYPE_LABEL: Record<string, string> = {
  website: "Сайт",
  ai: "AI-агент",
  mobile: "Мобильное приложение",
  other: "Другое",
};

const BUDGET_LABEL: Record<string, string> = {
  under1k: "до €1 000",
  to3k: "€1 000–3 000",
  to10k: "€3 000–10 000",
  over10k: "больше €10 000",
  unknown: "не определён",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rows(lead: Lead): [string, string][] {
  const out: [string, string][] = [["Имя", lead.name]];
  if (lead.email) out.push(["Email", lead.email]);
  if (lead.phone) out.push(["Телефон", lead.phone]);
  if (lead.company) out.push(["Компания", lead.company]);
  if (lead.type) out.push(["Услуга", TYPE_LABEL[lead.type] ?? lead.type]);
  if (lead.budget) out.push(["Бюджет", BUDGET_LABEL[lead.budget] ?? lead.budget]);
  out.push(["Язык", lead.locale]);
  return out;
}

function textBody(lead: Lead): string {
  const lines = rows(lead).map(([k, v]) => `${k}: ${v}`);
  if (lead.description) lines.push("", "Сообщение:", lead.description);
  return lines.join("\n");
}

function htmlBody(lead: Lead): string {
  const table = rows(lead)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 14px 4px 0;color:#71717a;white-space:nowrap">${k}</td><td style="padding:4px 0;color:#18181b">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  const message = lead.description
    ? `<p style="margin:20px 0 6px;color:#71717a;font-size:13px">Сообщение</p>
       <div style="white-space:pre-wrap;color:#18181b;line-height:1.5">${escapeHtml(lead.description)}</div>`
    : "";
  // Reply-to is set on the request, so hitting reply in the mail client answers
  // the client directly instead of a noreply address.
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px">
    <p style="margin:0 0 16px;font-size:17px;font-weight:600;color:#18181b">Заявка #${lead.id}</p>
    <table style="border-collapse:collapse">${table}</table>
    ${message}
  </div>`;
}

/** Returns true when the mail was accepted, false when skipped or failed. */
export async function emailLead(lead: Lead): Promise<boolean> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return false;

  const to = process.env.LEAD_EMAIL_TO?.trim() || CONTACT_EMAIL;
  const from = process.env.LEAD_EMAIL_FROM?.trim() || `buildbyalex <leads@buildbyalex.com>`;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Заявка #${lead.id} · ${lead.name}${lead.company ? ` · ${lead.company}` : ""}`,
        text: textBody(lead),
        html: htmlBody(lead),
        ...(lead.email ? { reply_to: lead.email } : {}),
      }),
    });
    if (!res.ok) {
      console.error(`[email] lead #${lead.id} rejected: ${res.status} ${await res.text()}`);
      return false;
    }
    return true;
  } catch (err) {
    // A dead mail provider must never fail the submit — the lead is already stored.
    console.error(`[email] lead #${lead.id} failed to send`, err);
    return false;
  }
}
