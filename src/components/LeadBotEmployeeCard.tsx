"use client";

import { useTranslations } from "next-intl";

type Stat = { value: string; label: string; sub?: string };
type Skill = { label: string; level: number };

export function LeadBotEmployeeCard() {
  const t = useTranslations("work.caseShowcase.leadbot.employee.card");
  const stats = t.raw("stats") as Stat[];
  const schedule = t.raw("schedule") as { label: string; value: string }[];
  const skills = t.raw("skills") as Skill[];
  const languages = t.raw("languages") as string[];

  return (
    <div className="relative mx-auto w-full max-w-[1020px]">
      <div
        className="relative overflow-hidden rounded-[28px] p-[1px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,107,26,0.55) 0%, rgba(255,107,26,0.08) 50%, rgba(255,107,26,0.45) 100%)",
        }}
      >
        <div
          className="relative overflow-hidden rounded-[27px]"
          style={{
            background:
              "linear-gradient(180deg, #0c0e12 0%, #14181f 100%)",
          }}
        >
          {/* Decorative aurora */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 right-[-15%] h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(255,107,26,0.55) 0%, transparent 70%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-20 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(50,140,255,0.45) 0%, transparent 70%)",
            }}
          />

          <div className="relative grid gap-10 px-7 py-9 md:grid-cols-[320px_1fr] md:gap-12 md:px-10 md:py-12">
            {/* Left: identity */}
            <div className="relative">
              <div className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-[#ff8c3a]/90">
                {t("badge")}
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div
                  className="relative flex h-16 w-16 items-center justify-center rounded-2xl text-[22px] font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #ff6b1a 0%, #c44a00 100%)",
                    boxShadow: "0 12px 30px -10px rgba(255,107,26,0.55)",
                  }}
                >
                  AI
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#0c0e12] bg-[#0cce6b] text-[10px] font-bold text-white">
                    ●
                  </span>
                </div>
                <div>
                  <div className="text-[20px] font-semibold leading-tight text-white">
                    {t("name")}
                  </div>
                  <div className="mt-0.5 text-[13px] text-white/55">
                    {t("role")}
                  </div>
                </div>
              </div>

              <div className="mt-7 space-y-3.5 border-t border-white/10 pt-6">
                {schedule.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-3 text-[13.5px]"
                  >
                    <span className="text-white/55">{row.label}</span>
                    <span className="text-right font-medium text-white">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7">
                <div className="text-[11px] uppercase tracking-[0.12em] text-white/45">
                  {t("languagesLabel")}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {languages.map((lang) => (
                    <span
                      key={lang}
                      className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[12px] font-medium text-white/85"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: stats + skills */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                {stats.map((s, i) => (
                  <div
                    key={s.label}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    {i === 0 && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-40 blur-2xl"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(255,107,26,0.8) 0%, transparent 70%)",
                        }}
                      />
                    )}
                    <div className="relative">
                      <div className="text-[26px] font-semibold leading-none tabular-nums text-white">
                        {s.value}
                      </div>
                      <div className="mt-2 text-[12px] leading-snug text-white/55">
                        {s.label}
                      </div>
                      {s.sub && (
                        <div className="mt-1.5 text-[10.5px] font-medium uppercase tracking-wider text-[#0cce6b]">
                          {s.sub}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7">
                <div className="text-[11px] uppercase tracking-[0.12em] text-white/45">
                  {t("skillsLabel")}
                </div>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {skills.map((sk) => (
                    <div
                      key={sk.label}
                      className="flex items-center gap-3 text-[13px] text-white/85"
                    >
                      <div className="flex-1">{sk.label}</div>
                      <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{
                            width: `${sk.level}%`,
                            background:
                              "linear-gradient(90deg, #ff6b1a 0%, #ffb366 100%)",
                          }}
                        />
                      </div>
                      <div className="w-9 text-right tabular-nums text-white/55">
                        {sk.level}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3 rounded-2xl border border-[#0cce6b]/25 bg-[#0cce6b]/[0.06] px-4 py-3.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0cce6b]/15 text-[#0cce6b]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex-1 text-[13.5px] text-white/85">
                  {t("footnote")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
