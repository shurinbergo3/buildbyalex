"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* Move the cursor across the header and the work itself trails behind it —
   covers flick in at the pointer, drift a little, fade out. A pool of nodes is
   reused forever: nothing mounts or unmounts while the mouse moves, and every
   frame is a transform on an already-composited layer.

   Desktop only by design. There is no cursor on a phone, and a trail of
   full-bleed covers would be a scroll-jank generator on a mid-range Android. */

type Cover = { src: string; alt: string };

const THRESHOLD = 85; // px of travel before the next cover fires
const LIFETIME = 1050; // ms a cover stays alive
const DRIFT = 26; // px it slides while fading

export function CaseTrail({ covers }: { covers: Cover[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const nodes = useRef<HTMLElement[]>([]);
  const next = useRef(0);
  const last = useRef({ x: 0, y: 0 });
  // Gate the whole pool behind a client check: on a phone these covers would
  // be a dozen images downloaded for an effect that can never fire.
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    setEnabled(fine.matches && !calm.matches);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !enabled) return;

    nodes.current = Array.from(host.querySelectorAll<HTMLElement>("[data-trail-item]"));

    const onMove = (e: MouseEvent) => {
      const rect = host.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // the host itself is pointer-events:none, so the listener lives on the
      // window and we gate on the box ourselves
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      if (!last.current.x && !last.current.y) {
        last.current = { x, y };
        return;
      }

      const travelled = Math.hypot(x - last.current.x, y - last.current.y);
      if (travelled < THRESHOLD) return;
      last.current = { x, y };

      const el = nodes.current[next.current % nodes.current.length];
      next.current += 1;
      if (!el) return;

      // Newest cover on top, older ones sink behind it.
      el.style.zIndex = String(next.current);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;

      const angle = (Math.random() - 0.5) * 14;
      el.animate(
        [
          { opacity: 0, transform: `translate(-50%, -50%) scale(0.82) rotate(${angle}deg)` },
          { opacity: 1, transform: `translate(-50%, -50%) scale(1) rotate(${angle}deg)`, offset: 0.12 },
          { opacity: 1, transform: `translate(-50%, calc(-50% - ${DRIFT * 0.6}px)) scale(1) rotate(${angle}deg)`, offset: 0.74 },
          { opacity: 0, transform: `translate(-50%, calc(-50% - ${DRIFT}px)) scale(0.97) rotate(${angle}deg)` },
        ],
        { duration: LIFETIME, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" },
      );
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="case-trail pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Two passes over the covers, so a fast sweep never reuses a node
          that is still visible. */}
      {enabled && [0, 1].flatMap((pass) =>
        covers.map((c, i) => (
          <span
            key={`${pass}-${c.src}`}
            data-trail-item
            className="absolute h-[132px] w-[196px] overflow-hidden rounded-2xl opacity-0 shadow-[0_18px_50px_-22px_rgba(10,10,10,0.55)] ring-1 ring-black/5"
          >
            <Image
              src={c.src}
              alt=""
              fill
              sizes="196px"
              className="object-cover"
              priority={pass === 0 && i < 2}
            />
          </span>
        )),
      )}
    </div>
  );
}
