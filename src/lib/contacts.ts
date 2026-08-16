/** Direct contact channels — the low-friction alternatives to the call CTA. */
export const TELEGRAM_HANDLE = "sumotry";
export const TELEGRAM_URL = `https://t.me/${TELEGRAM_HANDLE}`;
export const CONTACT_EMAIL = "info@buildbyalex.com";

/**
 * Phone and WhatsApp come from the environment because they may not exist yet.
 * Both are optional: everything that renders them checks for an empty string
 * first, so the site is unchanged until the variables are set. Telegram is the
 * default direct channel here, but Polish small business reaches for the phone
 * and WhatsApp first — leaving those two out costs enquiries.
 *
 * NEXT_PUBLIC_PHONE: international format, e.g. "+48123456789"
 * NEXT_PUBLIC_WHATSAPP: digits only, e.g. "48123456789"
 */
export const PHONE = (process.env.NEXT_PUBLIC_PHONE ?? "").trim();
export const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP ?? "").replace(/[^\d]/g, "");

export const PHONE_HREF = PHONE ? `tel:${PHONE.replace(/[^\d+]/g, "")}` : "";
export const WHATSAPP_URL = WHATSAPP ? `https://wa.me/${WHATSAPP}` : "";

/** Pretty-print +48123456789 as +48 123 456 789 for display. */
export function formatPhone(raw: string = PHONE): string {
  const digits = raw.replace(/[^\d+]/g, "");
  const m = digits.match(/^(\+\d{2})(\d{3})(\d{3})(\d{3})$/);
  return m ? `${m[1]} ${m[2]} ${m[3]} ${m[4]}` : raw;
}
