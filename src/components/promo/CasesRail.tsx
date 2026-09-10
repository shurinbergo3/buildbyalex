"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export type RailCase = {
  slug: string;
  title: string;
  industry: string;
  tagline: string;
  metricValue: string;
  metricLabel: string;
  image: { src: string; alt: string };
};

/* Apple "highlights" rail. Touch keeps native scroll with snap. Wheels and
   trackpads are routed per gesture: a sideways swipe moves the rail and only
   the rail, a vertical one goes to Lenis and the page. Deciding per event let
   every diagonal tick of a swipe scroll the page and stall the rail. */
export function CasesRail({
  items,
  cta,
  prevLabel,
  nextLabel,
}: {
  items: RailCase[];
  cta: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = () => {
    const el = railRef.current;
    if (!el) return;
    const start = el.scrollLeft < 8;
    const end = el.scrollLeft + el.clientWidth > el.scrollWidth - 8;
    setEdge((cur) => (cur.start === start && cur.end === end ? cur : { start, end }));
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    let axis: "x" | "y" = "y";
    let last = -Infinity;
    let settle = 0;

    // once a swipe runs out, ease onto the nearest card like the touch snap does
    const snap = () => {
      const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
      const origin = el.getBoundingClientRect().left;
      let target = el.scrollLeft;
      let best = Infinity;
      for (const card of el.querySelectorAll<HTMLElement>(".pv-case")) {
        const x = el.scrollLeft + card.getBoundingClientRect().left - origin - pad;
        if (Math.abs(x - el.scrollLeft) < best) {
          best = Math.abs(x - el.scrollLeft);
          target = x;
        }
      }
      el.scrollTo({ left: target, behavior: "smooth" });
    };

    const onWheel = (e: WheelEvent) => {
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientWidth : 1;
      const dx = e.deltaX * unit;
      const dy = e.deltaY * unit;
      // a new gesture takes its axis from its first tick; a clearly vertical
      // move inside a sideways one hands it back to the page
      if (e.timeStamp - last > 120) axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      else if (axis === "x" && Math.abs(dy) > Math.abs(dx) * 3 && Math.abs(dy) > 12) axis = "y";
      last = e.timeStamp;
      if (axis === "y") return;
      e.preventDefault();
      e.stopPropagation();
      el.scrollLeft += dx;
      window.clearTimeout(settle);
      settle = window.setTimeout(snap, 160);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(settle);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".pv-case");
    const width = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * width, behavior: "smooth" });
  };

  return (
    <>
      <div ref={railRef} className="pv-rail" onScroll={measure}>
        {items.map((item, i) => (
          <Link
            key={item.slug}
            href={{ pathname: "/work/[slug]", params: { slug: item.slug } }}
            className="pv-case"
          >
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              sizes="(max-width: 767px) 86vw, 860px"
              priority={i === 0}
            />
            <div className="pv-case-body">
              <div>
                <div className="pv-case-metric">{item.metricValue}</div>
                <div className="pv-case-metric-label">{item.metricLabel}</div>
                <div className="pv-case-industry">{item.industry}</div>
                <div className="pv-case-title">{item.title}</div>
                <p className="pv-case-tagline">{item.tagline}</p>
              </div>
              <span className="pv-case-cta">
                {cta}
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="pv-wrap pv-rail-ctrl">
        <button type="button" aria-label={prevLabel} disabled={edge.start} onClick={() => step(-1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" aria-label={nextLabel} disabled={edge.end} onClick={() => step(1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </>
  );
}
