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

/* Apple "highlights" rail: native horizontal scroll with snap, so touch and
   trackpads feel right, plus paddles for mouse users. */
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

  const step = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".pv-case");
    const width = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * width, behavior: "smooth" });
  };

  return (
    <>
      {/* Sideways swipes stay native, vertical wheel still goes to Lenis: a
          wheel-level prevent would trap the page scroll under the cursor. */}
      <div ref={railRef} className="pv-rail" onScroll={measure} data-lenis-prevent-horizontal="">
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
