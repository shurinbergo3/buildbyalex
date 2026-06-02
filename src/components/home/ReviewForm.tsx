"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/Button";

function StarPicker({
  value,
  hover,
  onChange,
  onHover,
}: {
  value: number;
  hover: number;
  onChange: (v: number) => void;
  onHover: (v: number) => void;
}) {
  const active = hover || value;
  return (
    <div className="flex items-center gap-1.5" onMouseLeave={() => onHover(0)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        const on = n <= active;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => onHover(n)}
            aria-label={`${n} / 5`}
            aria-pressed={n <= value}
            className="rounded-md p-0.5 outline-none transition-transform duration-150 hover:scale-110 focus-visible:ring-2 focus-visible:ring-[color:var(--c-accent)] active:scale-95"
          >
            <svg width="28" height="28" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M8 1.5l1.96 4.27 4.7.55-3.5 3.2.96 4.62L8 11.9l-4.12 2.24.96-4.62-3.5-3.2 4.7-.55L8 1.5z"
                fill={on ? "var(--c-accent)" : "transparent"}
                stroke={on ? "var(--c-accent)" : "var(--color-text-3)"}
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

export function ReviewForm() {
  const t = useTranslations("home.testimonials.form");
  const locale = useLocale();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [state, setState] = useState<"idle" | "sending" | "error" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating < 1) {
      setError(t("ratingRequired"));
      return;
    }
    setState("sending");
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      quote: String(fd.get("quote") ?? ""),
      rating,
      locale,
    };
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean };
      if (!res.ok || !data.ok) throw new Error("Send failed");
      setState("done");
    } catch {
      setState("error");
      setError(t("error"));
    }
  }

  if (state === "done") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] px-8 py-14 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-[color:var(--c-accent-soft)]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12.5l4.2 4.3L19 7" stroke="var(--c-accent-ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="t-h4">{t("successTitle")}</h3>
        <p className="max-w-[42ch] text-[15px] leading-[1.55] text-[color:var(--color-text-2)]">
          {t("successBody")}
        </p>
      </div>
    );
  }

  const sending = state === "sending";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[24px] border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] p-6 md:p-8"
    >
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[18px] font-semibold tracking-[-0.014em] text-[color:var(--color-text)] md:text-[20px]">
          {t("title")}
        </h3>
        <p className="text-[14px] leading-[1.5] text-[color:var(--color-text-2)]">{t("subhead")}</p>
      </div>

      <div className="mt-6 flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-[color:var(--color-text-2)]">
          {t("rating")}
          <span className="ml-0.5 text-[color:var(--c-accent)]">*</span>
        </span>
        <StarPicker value={rating} hover={hover} onChange={setRating} onHover={setHover} />
      </div>

      <div className="mt-5">
        <ReviewField name="name" label={t("name")} required autoComplete="name" />
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-[13px] font-medium text-[color:var(--color-text-2)]">
          {t("text")}
          <span className="ml-0.5 text-[color:var(--c-accent)]">*</span>
        </span>
        <textarea
          name="quote"
          required
          rows={4}
          maxLength={600}
          placeholder={t("textPlaceholder")}
          className="block min-h-[112px] w-full resize-y rounded-2xl border border-[color:var(--c-hairline)] bg-[color:var(--color-bg)] px-4 py-3 text-[15px] leading-[1.55] tracking-[-0.011em] text-[color:var(--color-text)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[color:var(--color-text-3)] focus:border-[color:var(--c-accent)] focus:shadow-[0_0_0_4px_rgba(255,107,26,0.12)]"
        />
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-4">
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

function ReviewField({
  name,
  label,
  placeholder,
  required,
  autoComplete,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[color:var(--color-text-2)]">
        {label}
        {required && <span className="ml-0.5 text-[color:var(--c-accent)]">*</span>}
      </span>
      <input
        type="text"
        name={name}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={120}
        className="block w-full rounded-2xl border border-[color:var(--c-hairline)] bg-[color:var(--color-bg)] px-4 py-3 text-[15px] tracking-[-0.011em] text-[color:var(--color-text)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[color:var(--color-text-3)] focus:border-[color:var(--c-accent)] focus:shadow-[0_0_0_4px_rgba(255,107,26,0.12)]"
      />
    </label>
  );
}
