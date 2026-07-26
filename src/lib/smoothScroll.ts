import type Lenis from "lenis";

/* A handle on the page's smooth-scroll instance for the few components that
   own a gesture themselves. A horizontal rail has to be able to park Lenis for
   the length of a sideways swipe — otherwise its inertia keeps gliding the page
   while the rail moves, and you get two scrolls at once. */

let instance: Lenis | null = null;
let depth = 0;

export function registerSmoothScroll(lenis: Lenis | null) {
  instance = lenis;
  depth = 0;
}

/** Park the page scroll. Nestable — pairs with resumePageScroll. */
export function pausePageScroll() {
  if (!instance) return;
  depth += 1;
  if (depth === 1) instance.stop();
}

export function resumePageScroll() {
  if (!instance || depth === 0) return;
  depth -= 1;
  if (depth === 0) instance.start();
}
