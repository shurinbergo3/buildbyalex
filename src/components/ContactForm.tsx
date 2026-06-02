"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "./Button";

const typeKeys = ["website", "ai", "mobile", "other"] as const;
const budgetKeys = ["under1k", "to3k", "to10k", "over10k", "unknown"] as const;

export function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      type: String(fd.get("type") ?? ""),
      budget: String(fd.get("budget") ?? ""),
      description: String(fd.get("description") ?? ""),
      locale,
    };
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
      const query: Record<string, string> = {};
      if (payload.name) query.name = payload.name;
      if (payload.type) query.type = payload.type;
      router.push({ pathname: "/contact/thank-you", query });
    } catch {
      setState("error");
      setError(t("error"));
    }
  }

  const sending = state === "sending";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <Field name="name" label={t("name")} required />
        <Field name="email" label={t("email")} type="email" required />
        <Field name="company" label={t("company")} />
        <SelectField
          name="type"
          label={t("type")}
          required
          options={typeKeys.map((k) => ({ value: k, label: t(`typeOptions.${k}`) }))}
        />
      </div>
      <SelectField
        name="budget"
        label={t("budget")}
        required
        options={budgetKeys.map((k) => ({ value: k, label: t(`budgetOptions.${k}`) }))}
      />
      <TextAreaField
        name="description"
        label={t("description")}
        placeholder={t("descriptionPlaceholder")}
        required
      />

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button as="button" type="submit" size="lg" disabled={sending}>
          {sending ? t("sending") : t("submit")}
        </Button>
        {error && (
          <p role="alert" className="text-[14px] text-[#C4470A]">{error}</p>
        )}
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
          name === "email" ? "email" : name === "name" ? "name" : name === "company" ? "organization" : "off"
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
