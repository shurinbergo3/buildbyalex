"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Section } from "./Section";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { HeroWindow } from "./HeroWindow";
import { ShaderGlow } from "./ShaderGlow";
import { trackGoal } from "@/lib/analytics";
import type { ContourTheme } from "./heroGlyphs";

/* ════════════════════════════════════════════════════════════════════════════
   QuoteForm — the low-friction counterpart to /contact. Three fields, no call
   required, answer promised in 24h. Lives inside the same frosted macOS window
   as the hero and the final CTA, so the ask reads as part of the product rather
   than a bolted-on widget. Posts to the same /api/contact endpoint with a
   `quote` type so quick estimates are distinguishable from full briefs.
   ──────────────────────────────────────────────────────────────────────────── */

const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

type State = "idle" | "sending" | "done" | "error";

export function QuoteForm({
  theme = "studio",
  branch,
  tone = "default",
}: {
  theme?: ContourTheme;
  /** Which service the visitor is looking at — travels with the lead. */
  branch?: string;
  tone?: "default" | "alt";
}) {
  const t = useTranslations("quote");
  const locale = useLocale();
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      description: String(fd.get("description") ?? "").trim(),
      type: branch ? `quote:${branch}` : "quote",
      budget: "",
      locale,
    };

    if (!payload.name || !payload.description) {
      setState("error");
      setError(t("errorRequired"));
      (form.elements.namedItem(payload.name ? "description" : "name") as HTMLElement | null)?.focus();
      return;
    }
    if (!isValidEmail(payload.email)) {
      setState("error");
      setError(t("errorEmail"));
      (form.elements.namedItem("email") as HTMLInputElement | null)?.focus();
      return;
    }

    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Send failed");
      trackGoal("quote_submit", { branch: branch ?? "home" });
      setState("done");
    } catch (err) {
      setState("error");
      const reason = err instanceof Error ? err.message : "";
      setError(/email/i.test(reason) ? t("errorEmail") : t("error"));
    }
  }

  const sending = state === "sending";
  const steps = t.raw("steps") as string[];

  return (
    <Section id="quote" pad="default" tone={tone}>
      <Container size="default">
        <Reveal>
          <HeroWindow
            backdrop={<ShaderGlow className="mix-blend-screen opacity-70" />}
            theme={theme}
            label={t("chrome")}
            icon="lock"
            bodyClassName="!py-12 sm:!py-14 md:!py-16"
          >
            <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-14 lg:gap-20">
              {/* ── Promise ── */}
              <div className="max-w-[440px]">
                <span className="case-cta-eyebrow !mt-0 text-[color:var(--c-accent)]">
                  {t("eyebrow")}
                </span>

                <h2 className="mt-4 text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.06] tracking-[-0.03em] text-white">
                  {t("headline")}
                </h2>

                <p className="mt-4 text-[16.5px] leading-[1.55] text-white/65">{t("lead")}</p>

                <ol className="mt-9 space-y-0">
                  {steps.map((step, i) => (
                    <li
                      key={step}
                      className="flex items-baseline gap-4 border-t border-white/10 py-3.5 last:border-b"
                    >
                      <span className="font-mono text-[12px] tabular-nums text-[color:var(--c-accent)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[15px] leading-[1.45] text-white/80">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* ── Ask ── */}
              <div className="md:pl-2">
                {state === "done" ? (
                  <div
                    className="flex h-full min-h-[300px] flex-col items-start justify-center rounded-[22px] border border-white/12 bg-white/[0.04] p-8"
                    role="status"
                  >
                    <svg
                      width="34"
                      height="34"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--c-accent)"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <p className="mt-5 text-[21px] font-semibold tracking-[-0.02em] text-white">
                      {t("successTitle")}
                    </p>
                    <p className="mt-2.5 max-w-[330px] text-[15.5px] leading-[1.5] text-white/60">
                      {t("successBody")}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} noValidate className="space-y-4">
                    <GlassField
                      name="description"
                      label={t("fields.task")}
                      placeholder={t("fields.taskPlaceholder")}
                      multiline
                      required
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <GlassField name="name" label={t("fields.name")} required autoComplete="name" />
                      <GlassField
                        name="email"
                        label={t("fields.email")}
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                      />
                    </div>

                    <div aria-live="polite">
                      {error && (
                        <p
                          role="alert"
                          className="flex items-start gap-2 rounded-xl border border-[color:var(--c-accent)]/35 bg-[color:var(--c-accent)]/10 px-3.5 py-2.5 text-[14px] leading-[1.45] text-[#FFC49A]"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" className="mt-0.5 shrink-0" aria-hidden="true">
                            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
                            <path d="M8 5v3.5M8 10.6v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          <span>{error}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="case-cta-primary inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[color:var(--c-accent)] px-6 text-[16px] font-medium leading-none tracking-[-0.014em] text-white transition-[background,transform] duration-200 hover:bg-[color:var(--c-accent-hover)] active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-55"
                    >
                      {sending ? t("sending") : t("submit")}
                      {!sending && (
                        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                          <path
                            d="M3 8h9M9 4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>

                    <p className="pt-1 text-center text-[13px] leading-[1.45] text-white/45">
                      {t("note")}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </HeroWindow>
        </Reveal>
      </Container>
    </Section>
  );
}

/* Glass input — light type on the frosted surface, amber focus ring. */
function GlassField({
  name,
  label,
  placeholder,
  type = "text",
  required,
  multiline,
  autoComplete,
  inputMode,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  autoComplete?: string;
  inputMode?: "email" | "text" | "tel";
}) {
  const shared =
    "block w-full rounded-2xl border border-white/14 bg-white/[0.05] px-4 text-[15.5px] tracking-[-0.011em] text-white outline-none transition-[border-color,box-shadow,background] duration-200 placeholder:text-white/30 hover:border-white/22 focus:border-[color:var(--c-accent)] focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(255,107,26,0.16)]";

  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-medium uppercase tracking-[0.07em] text-white/45">
        {label}
        {required && <span className="ml-1 text-[color:var(--c-accent)]">*</span>}
      </span>
      {multiline ? (
        <textarea
          name={name}
          required={required}
          rows={4}
          placeholder={placeholder}
          className={`${shared} resize-y py-3.5 leading-[1.5]`}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          className={`${shared} h-12`}
        />
      )}
    </label>
  );
}
