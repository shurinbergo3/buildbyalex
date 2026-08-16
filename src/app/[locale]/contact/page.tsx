import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { ContactCodeRain } from "@/components/ContactCodeRain";
import { routing, type Locale } from "@/i18n/routing";
import { buildLocalizedMetadata } from "@/lib/metadata";
import { getLiveReviewCount } from "@/lib/reviews";
import { CONTACT_EMAIL, TELEGRAM_URL, PHONE, PHONE_HREF, WHATSAPP_URL, formatPhone } from "@/lib/contacts";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return buildLocalizedMetadata({
    locale: locale as Locale,
    pathname: "/contact",
    title: t("title"),
    description: t("description"),
  });
}

type Channel = { key: string; href: string; label: string; external: boolean };

// Phone and WhatsApp only appear once their env vars are set — see lib/contacts.
// Order matters: in Poland the phone is the first thing a small-business owner
// looks for, so it leads when it exists.
const CHANNELS: Channel[] = [
  ...(PHONE_HREF ? [{ key: "phone", href: PHONE_HREF, label: formatPhone(PHONE), external: false }] : []),
  ...(WHATSAPP_URL ? [{ key: "whatsapp", href: WHATSAPP_URL, label: "WhatsApp", external: true }] : []),
  { key: "email", href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL, external: false },
  { key: "telegram", href: TELEGRAM_URL, label: "Telegram @sumotry", external: true },
];

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
  const tr = await getTranslations({ locale, namespace: "home.testimonials" });
  const reviewCount = await getLiveReviewCount(locale as Locale);
  const steps = t.raw("steps.items") as { title: string; desc: string }[];

  return (
    <Section pad="tight" className="contact-stage !pt-16 md:!pt-24">
      <ContactCodeRain />
      <Container className="relative z-10">
        <div className="grid gap-14 md:grid-cols-12 md:items-start md:gap-16">
          {/* ── Left: pitch, trust, process, channels ── */}
          <div className="md:col-span-5">
            <Reveal>
              <h1 className="text-[clamp(40px,5.5vw+8px,68px)] font-semibold leading-[1.06] tracking-[-0.032em]">
                {t("headline")}
              </h1>
              <p className="mt-5 text-[clamp(17px,1.2vw+13px,21px)] leading-[1.5] tracking-[-0.013em] text-[color:var(--color-text-2)] max-w-[440px]">
                {t("lead")}
              </p>

              <div className="mt-6 flex items-center gap-3">
                <Stars />
                <span className="text-[13.5px] text-[color:var(--color-text-2)]">
                  <span className="font-semibold text-[color:var(--color-text)]">{tr("rating")}</span> · {reviewCount} {tr("count")}
                </span>
              </div>
            </Reveal>

            {/* Process */}
            <Reveal delay={80}>
              <div className="mt-12">
                <h2 className="t-eyebrow">{t("steps.title")}</h2>
                <ol className="mt-5 space-y-5">
                  {steps.map((s, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[color:var(--c-accent-soft)] font-mono text-[12.5px] font-semibold text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-[15.5px] font-semibold tracking-[-0.011em] text-[color:var(--color-text)]">{s.title}</p>
                        <p className="mt-1 text-[14.5px] leading-[1.5] text-[color:var(--color-text-2)]">{s.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            {/* Direct channels */}
            <Reveal delay={140}>
              <div className="mt-12">
                <h2 className="t-eyebrow">{t("altTitle")}</h2>
                <ul className="mt-5 grid gap-2.5">
                  {CHANNELS.map((c) => (
                    <li key={c.key}>
                      <a
                        href={c.href}
                        {...(c.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                        className="group flex items-center gap-3 rounded-2xl border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)] px-4 py-3 transition-colors hover:border-[color:var(--c-accent)]/40 hover:bg-[color:var(--color-bg-elev)]"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[color:var(--color-bg-elev)] text-[color:var(--color-text-2)] group-hover:text-[color:var(--c-accent)]">
                          <ChannelIcon name={c.key} />
                        </span>
                        <span className="flex-1 text-[15px] font-medium tracking-[-0.011em] text-[color:var(--color-text)]">
                          {c.label}
                        </span>
                        {c.external && (
                          <svg width="14" height="14" viewBox="0 0 14 14" className="text-[color:var(--color-text-3)]" aria-hidden="true">
                            <path d="M4 10l6-6M5 4h5v5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[13.5px] tracking-[0.02em] text-[color:var(--color-text-3)]">{t("responseTime")}</p>
              </div>
            </Reveal>
          </div>

          {/* ── Right: form ── */}
          <div className="md:col-span-7 md:sticky md:top-24">
            <Reveal delay={100}>
              <div className="contact-panel p-6 md:p-9">
                {/* hairline accent across the top edge */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--c-accent)] to-transparent opacity-60"
                />
                {/* soft accent glow tucked into the corner */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[color:var(--c-accent)] opacity-[0.07] blur-3xl"
                />
                <h2 className="t-h3">{t("formTitle")}</h2>
                <p className="mt-2 mb-7 text-[15.5px] leading-[1.5] text-[color:var(--color-text-2)]">{t("formSub")}</p>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 / 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 1.5l1.96 4.27 4.7.55-3.5 3.2.96 4.62L8 11.9l-4.12 2.24.96-4.62-3.5-3.2 4.7-.55L8 1.5z" fill="var(--c-accent)" />
        </svg>
      ))}
    </div>
  );
}

function ChannelIcon({ name }: { name: string }) {
  if (name === "email") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "phone") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6.6 3h2.5l1.6 4-2 1.2a12 12 0 0 0 5.1 5.1l1.2-2 4 1.6v2.5a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.2 2 2 0 0 1 6.6 3z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "whatsapp") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.1 14.9l-.4-.2-2.5.7.7-2.4-.3-.4A8 8 0 0 1 12 4zm-3.3 4.3c-.2 0-.5 0-.7.4-.3.4-.9 1-.9 2.3s1 2.6 1.1 2.8c.1.2 1.8 3 4.5 4 .6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.6-.3-1.6-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2a7 7 0 0 1-1.3-1.6c-.1-.2 0-.4.1-.5l.4-.5.3-.5v-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5z" />
      </svg>
    );
  }
  if (name === "telegram") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.9 4.3 2.9 11.6c-1 .4-1 1.8.1 2.1l4.6 1.4 1.8 5.5c.3.9 1.4 1 1.9.3l2.4-2.9 4.7 3.5c.7.5 1.7.1 1.9-.8l3-14c.2-1-.8-1.9-1.7-1.5l-.7.1zM9.6 14.6l8.2-5.1c.2-.1.4.2.2.3l-6.6 6c-.3.3-.5.7-.5 1.1l-.2 2.1-1.1-4.4z" />
      </svg>
    );
  }
  return null;
}
