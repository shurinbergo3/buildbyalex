"use client";

import { useRef, type ReactNode } from "react";
import { HeroContours, type ContourTheme } from "@/components/heroGlyphs";

/* ════════════════════════════════════════════════════════════════════════════
   HeroWindow — the unified hero stage for every case & service page. A frosted
   "Liquid Glass" panel framed like a macOS window: traffic-light chrome bar with
   a URL/label and live state, a themed field of line-art contours behind, an
   ambient accent aurora, a recurring specular sweep, and a cursor-tracked glint.
   Material + motion live in globals.css (.hero-glass*). The page passes its copy
   + product mock as children; everything else is shared so the heroes never
   drift apart again.
   ──────────────────────────────────────────────────────────────────────────── */

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

function Globe() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" />
    </svg>
  );
}
function Lock() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function HeroWindow({
  label,
  live,
  theme,
  accent = "#FF7A2D",
  icon = "globe",
  centered = false,
  className = "",
  bodyClassName = "",
  children,
}: {
  label: string;
  live?: string;
  theme: ContourTheme;
  accent?: string;
  icon?: "globe" | "lock";
  /** Centered content (final-CTA bookend): guards the centre, not a left column. */
  centered?: boolean;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cx = e.clientX;
    const cy = e.clientY;
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--gx", `${((cx - r.left) / r.width) * 100}%`);
      el.style.setProperty("--gy", `${((cy - r.top) / r.height) * 100}%`);
      el.dataset.spot = "on";
    });
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.dataset.spot = "off";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`hero-glass ${className}`}
      style={
        {
          "--hero-accent-rgb": hexToRgb(accent),
          ...(centered ? { "--gx": "50%", "--gy": "32%" } : {}),
        } as React.CSSProperties
      }
    >
      {/* ambient layers */}
      <div className="hero-glass-aurora" aria-hidden="true" />
      <div className="hero-glass-grid" aria-hidden="true" />
      <HeroContours theme={theme} accent={accent} focus={centered ? "center" : "left"} />
      <div className="hero-glass-edge" aria-hidden="true" />
      <div className="hero-glass-glint" aria-hidden="true" />
      <div className="hero-glass-sheen" aria-hidden="true" />
      <div className="hero-glass-grain" aria-hidden="true" style={{ backgroundImage: GRAIN }} />

      {/* faux macOS window chrome */}
      <div className="hero-glass-bar">
        <span className="hero-glass-lights" aria-hidden="true">
          <span className="hero-glass-light hero-glass-light--r" />
          <span className="hero-glass-light hero-glass-light--y" />
          <span className="hero-glass-light hero-glass-light--g" />
        </span>
        <span className="hero-glass-url">
          {icon === "lock" ? <Lock /> : <Globe />}
          <span>{label}</span>
        </span>
        {live && (
          <span className="hero-glass-live">
            <span className="hero-glass-live-dot" aria-hidden="true" />
            <span>{live}</span>
          </span>
        )}
      </div>

      {/* content */}
      <div className={`hero-glass-body ${bodyClassName}`}>{children}</div>
    </div>
  );
}
