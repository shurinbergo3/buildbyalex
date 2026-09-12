"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";

const TAG: Record<string, string> = { ru: "ru-RU", en: "en-GB", pl: "pl-PL", ua: "uk-UA" };

/** Wall-clock time in Warsaw, ticking. The server renders `fallback`, the
    real time arrives on the client, so the markup never mismatches. */
export function WarsawTime({ fallback, date = false }: { fallback: string; date?: boolean }) {
  const locale = useLocale();
  const [now, setNow] = useState<Date | null>(null);
  const format = useMemo(() => {
    const tag = TAG[locale] ?? "en-GB";
    const opts: Intl.DateTimeFormatOptions = { timeZone: "Europe/Warsaw" };
    return {
      time: new Intl.DateTimeFormat(tag, { ...opts, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
      date: new Intl.DateTimeFormat(tag, { ...opts, weekday: "long", day: "numeric", month: "long" }),
    };
  }, [locale]);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 10_000);
    return () => window.clearInterval(id);
  }, []);

  if (date) return <>{now ? format.date.format(now) : ""}</>;
  return <>{now ? format.time.format(now) : fallback}</>;
}
