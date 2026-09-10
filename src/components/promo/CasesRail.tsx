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
    let axis: "x" | "y" | null = null;
    let last = -Infinity;
    let travelX = 0;
    let travelY = 0;
    let pendingX = 0;
    let swipeEnd = 0;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch-zoom stays the browser's
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientWidth : 1;
      const dx = e.deltaX * unit;
      const dy = e.deltaY * unit;
      // The rail never scrolls natively: sideways moves are applied here and
      // the page belongs to Lenis. A native nudge in between was the stutter.
      e.preventDefault();

      if (e.timeStamp - last > 100) {
        axis = null;
        travelX = travelY = pendingX = 0;
      }
      last = e.timeStamp;

      let move = dx;
      if (axis === null) {
        travelX += Math.abs(dx);
        travelY += Math.abs(dy);
        pendingX += dx;
        // A few pixels of travel before picking a side, and a tie goes to the
        // page: a vertical swipe rarely starts perfectly straight.
        if (travelX + travelY < 6) return;
        axis = travelX > travelY * 1.6 ? "x" : "y";
        move = pendingX;
      } else if (axis === "x" && Math.abs(dy) > Math.abs(dx) * 2 && Math.abs(dy) > 4) {
        axis = "y";
      }
      if (axis === "y") return;

      e.stopPropagation();
      el.scrollLeft += move;
      // no hover transitions on the cards gliding under the cursor
      el.dataset.swiping = "";
      window.clearTimeout(swipeEnd);
      swipeEnd = window.setTimeout(() => delete el.dataset.swiping, 160);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(swipeEnd);
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
