"use client";

import { useEffect, useState } from "react";

const TIME = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Warsaw",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const DATE = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Warsaw",
  weekday: "long",
  day: "numeric",
  month: "long",
});

/** Wall-clock time in Warsaw, ticking. The server renders `fallback`, the
    real time arrives on the client, so the markup never mismatches. */
export function WarsawTime({ fallback, date = false }: { fallback: string; date?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 10_000);
    return () => window.clearInterval(id);
  }, []);

  if (date) return <>{now ? DATE.format(now) : ""}</>;
  return <>{now ? TIME.format(now) : fallback}</>;
}
