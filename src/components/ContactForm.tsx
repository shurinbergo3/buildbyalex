"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "./Button";
import { trackGoal } from "@/lib/analytics";

const typeKeys = ["website", "ai", "mobile", "other"] as const;
const budgetKeys = ["under1k", "to3k", "to10k", "over10k", "unknown"] as const;

const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      type: String(fd.get("type") ?? "").trim(),
      budget: String(fd.get("budget") ?? "").trim(),
      description: String(fd.get("description") ?? "").trim(),
      locale,
    };

    // Client-side validation with specific, friendly messages so users
    // aren't left guessing why a submit was rejected. Only the name and one
    // way to reach them are required — asking a cold visitor to write a brief
    // before they've spoken to anyone loses more leads than it qualifies.
    if (!payload.name) {
      setState("error");
      setError(t("errorRequired"));
      return;
    }
    if (!payload.email && !payload.phone) {
      setState("error");
      setError(t("errorContact"));
      (e.currentTarget.elements.namedItem("email") as HTMLInputElement | null)?.focus();
      return;
    }
    if (payload.email && !isValidEmail(payload.email)) {
      setState("error");
      setError(t("errorEmail"));
      (e.currentTarget.elements.namedItem("email") as HTMLInputElement | null)?.focus();
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
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Send failed");
      }
      trackGoal("lead_submit", { type: payload.type || "unknown" });
      const query: Record<string, string> = {};
      if (payload.name) query.name = payload.name;
      if (payload.type) query.type = payload.type;
      router.push({ pathname: "/contact/thank-you", query });
    } catch (err) {
      setState("error");
      const reason = err instanceof Error ? err.message : "";
      setError(/email/i.test(reason) ? t("errorEmail") : t("error"));
    }
  }

  const sending = state === "sending";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <p className="text-[13.5px] leading-[1.5] text-[color:var(--color-text-3)]">{t("contactHint")}</p>
      <div className="grid gap-5 md:grid-cols-2">
        <Field name="name" label={t("name")} required />
        <Field name="email" label={t("email")} type="email" />
        <Field name="phone" label={t("phone")} type="tel" />
        <Field name="company" label={t("company")} />
        <SelectField
          name="type"
          label={t("type")}
          options={typeKeys.map((k) => ({ value: k, label: t(`typeOptions.${k}`) }))}
        />
        <SelectField
          name="budget"
          label={t("budget")}
          options={budgetKeys.map((k) => ({ value: k, label: t(`budgetOptions.${k}`) }))}
        />
      </div>
      <TextAreaField
        name="description"
        label={`${t("description")} ${t("optional")}`}
        placeholder={t("descriptionPlaceholder")}
      />

      <div className="space-y-4 pt-2">
        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-[#C4470A]/25 bg-[#C4470A]/5 px-3.5 py-2.5 text-[14px] leading-[1.45] text-[#C4470A]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" className="mt-0.5 shrink-0" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
              <path d="M8 5v3.5M8 10.6v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>{error}</span>
          </p>
        )}
        <Button as="button" type="submit" size="lg" disabled={sending} className="w-full">
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
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-[13px] text-[color:var(--color-text-3)]">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="3" y="7" width="10" height="6.5" rx="1.6" stroke="currentColor" strokeWidth="1.3" />
            <path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          {t("formNote")}
        </p>
      </div>
    </form>
  );
}

const fieldBase =
  "block w-full rounded-2xl border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] px-4 py-3 text-[15.5px] tracking-[-0.011em] text-[color:var(--color-text)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[color:var(--color-text-3)] focus:border-[color:var(--c-accent)] focus:shadow-[0_0_0_4px_rgba(255,107,26,0.12)]";

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[color:var(--color-text-2)]">
        {label}
        {required && <span className="ml-0.5 text-[color:var(--c-accent)]">*</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={
          name === "email"
            ? "email"
            : name === "name"
            ? "name"
            : name === "phone"
            ? "tel"
            : name === "company"
            ? "organization"
            : "off"
        }
        className={fieldBase}
      />
    </label>
  );
}

function SelectField({
  name,
  label,
  required,
  options,
}: {
  name: string;
  label: string;
  required?: boolean;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[color:var(--color-text-2)]">
        {label}
        {required && <span className="ml-0.5 text-[color:var(--c-accent)]">*</span>}
      </span>
      <div className="relative">
        <select
          name={name}
          required={required}
          defaultValue=""
          className={`${fieldBase} appearance-none pr-10`}
        >
          <option value="" disabled />
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--color-text-3)]"
          width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </label>
  );
}

function TextAreaField({
  name,
  label,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[color:var(--color-text-2)]">
        {label}
        {required && <span className="ml-0.5 text-[color:var(--c-accent)]">*</span>}
      </span>
      <textarea
        name={name}
        required={required}
        rows={6}
        placeholder={placeholder}
        className={`${fieldBase} resize-y min-h-[140px]`}
      />
    </label>
  );
}
