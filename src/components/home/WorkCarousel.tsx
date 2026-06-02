"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

export type CarouselItem = {
  key: string;
  slug: string;
  industry: string;
  title: string;
  results: string[];
  metricValue: string;
  metricLabel: string;
};

export function WorkCarousel({
  items,
  cta,
}: {
  items: CarouselItem[];
  cta: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  /** Width of one card + the flex gap — read live so it survives resize. */
  const stepWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const first = track.children[0] as HTMLElement | undefined;
    const second = track.children[1] as HTMLElement | undefined;
    if (!first) return 0;
    if (second) return second.offsetLeft - first.offsetLeft;
    return first.offsetWidth;
  }, []);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = stepWidth() || 1;
    const idx = Math.round(track.scrollLeft / step);
    setActive(Math.max(0, Math.min(items.length - 1, idx)));
    const maxScroll = track.scrollWidth - track.clientWidth;
    setEdges({
      start: track.scrollLeft <= 4,
      end: track.scrollLeft >= maxScroll - 4,
    });
  }, [items.length, stepWidth]);

  useEffect(() => {
    sync();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      track.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const scrollToIndex = useCallback(
    (idx: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      track.scrollTo({ left: clamped * stepWidth(), behavior: "smooth" });
    },
    [items.length, stepWidth],
  );

  const nudge = useCallback(
    (dir: -1 | 1) => scrollToIndex(active + dir),
    [active, scrollToIndex],
  );

  return (
    <div className="mt-10 md:mt-14">
      {/* Controls row — arrows on the right, sits above the rail */}
      <div className="mb-5 flex items-center justify-end gap-2.5">
        <CarouselButton
          dir="prev"
          disabled={edges.start}
          onClick={() => nudge(-1)}
        />
        <CarouselButton
          dir="next"
          disabled={edges.end}
          onClick={() => nudge(1)}
        />
      </div>

      {/* Rail — full-bleed within the container, snaps card-to-card */}
      <ul
        ref={trackRef}
        className="work-rail -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:gap-5"
        style={{ scrollPaddingLeft: "1.5rem" }}
      >
        {items.map((item) => (
          <li
            key={item.key}
            className="w-[80vw] shrink-0 snap-start sm:w-[360px] lg:w-[384px]"
          >
            <Link
              href={{ pathname: "/work/[slug]", params: { slug: item.slug } }}
              className="group flex h-full flex-col rounded-[22px] border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] p-7 transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[color:var(--c-accent)]/40 hover:shadow-[var(--shadow-card-hover)]"
            >
              <span className="inline-flex w-fit items-center gap-2 text-[11.5px] font-medium uppercase tracking-[0.04em] text-[color:var(--color-text-3)]">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[color:var(--c-accent)]"
                  aria-hidden="true"
                />
                {item.industry}
              </span>

              <h3 className="mt-4 t-h4 font-[number:var(--fw-semi)]">
                {item.title}
              </h3>

              <ul className="mt-4 space-y-2.5 text-[14.5px] leading-[1.5] text-[color:var(--color-text-2)]">
                {item.results.slice(0, 2).map((r) => (
                  <li key={r} className="flex gap-2.5">
                    <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--c-accent)]" />
                    {r}
                  </li>
                ))}
              </ul>

              {/* Headline metric — the focal number */}
              <div className="mt-6 flex items-baseline gap-2.5 border-t border-[color:var(--c-hairline)] pt-5">
                <span className="font-mono text-[26px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-[color:var(--color-text)]">
                  {item.metricValue}
                </span>
                <span className="text-[12.5px] leading-[1.25] text-[color:var(--color-text-3)]">
                  {item.metricLabel}
                </span>
              </div>

              <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[14px] font-medium text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                {cta}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 14 14"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path
                    d="M5 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Progress dots */}
      <div className="mt-6 flex items-center gap-2" role="tablist" aria-label="Slides">
        {items.map((item, i) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`${item.title}`}
            onClick={() => scrollToIndex(i)}
            className="group relative h-2.5 py-1.5"
          >
            <span
              className={`block h-1 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                i === active
                  ? "w-7 bg-[color:var(--c-accent)]"
                  : "w-2 bg-[color:var(--color-divider)] group-hover:bg-[color:var(--color-text-3)]"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function CarouselButton({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous" : "Next"}
      className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] text-[color:var(--color-text)] transition-[opacity,transform,background] duration-200 ease-[cubic-bezier(0.28,0.11,0.32,1)] hover:bg-[color:var(--color-bg-alt)] active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-[color:var(--color-bg-elev)]"
    >
      <svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true">
        <path
          d={dir === "prev" ? "M9 3L5 7l4 4" : "M5 3l4 4-4 4"}
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </button>
  );
}
