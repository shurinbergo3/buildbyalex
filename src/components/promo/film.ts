/* The night-shift film on /promo: seven chapters glued into one continuous
   shot. Every clip starts on the frame the previous one ends on, so swapping
   the <video> at a chapter boundary is invisible. */

export type ChapterId = "hero" | "search" | "site" | "agent" | "crm" | "auto" | "morning";

/** How the clip sits on a wide screen: filling the stage (real-world shots),
    as a product stage on the right with copy on the left, or morphing between
    the two while its clip plays. */
export type StageMode = "product" | "to-product" | "to-full";

export type Chapter = {
  id: ChapterId;
  /** Scroll distance of the chapter, in screen heights. */
  length: number;
  /** Chapter progress where the clip starts and ends; outside it the frame holds. */
  clip: [number, number];
  /** The night clock at the start and at the end of the clip. */
  clock: [string, string];
  stage: StageMode;
  /** Share of the clip over which the previous chapter's last frame dissolves.
      Longer where the two clips were not generated as one continuous shot. */
  seam?: number;
};

export const CHAPTERS: Chapter[] = [
  { id: "hero", length: 2.2, clip: [0.02, 0.95], clock: ["02:14:00", "02:14:18"], stage: "to-product" },
  { id: "search", length: 2.3, clip: [0.16, 0.52], clock: ["02:14:18", "02:14:52"], stage: "product" },
  { id: "site", length: 2.1, clip: [0.03, 0.48], clock: ["02:14:52", "02:15:30"], stage: "product" },
  { id: "agent", length: 2.5, clip: [0.03, 0.4], clock: ["02:15:30", "02:16:24"], stage: "product" },
  { id: "crm", length: 2.1, clip: [0.03, 0.46], clock: ["02:16:24", "02:17:05"], stage: "product" },
  { id: "auto", length: 1.9, clip: [0.03, 0.46], clock: ["02:17:05", "02:17:48"], stage: "product" },
  { id: "morning", length: 2.6, clip: [0.02, 0.44], clock: ["02:17:48", "09:00:00"], stage: "to-full", seam: 0.24 },
];

/** Where each chapter begins, in screen heights from the top of the film. */
export const CHAPTER_STARTS = CHAPTERS.reduce<number[]>((acc, c, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + CHAPTERS[i - 1].length);
  return acc;
}, []);

export const FILM_LENGTH = CHAPTERS.reduce((sum, c) => sum + c.length, 0);

/** Clips are encoded at this rate; seeks snap to frame centres. */
export const FILM_FPS = 24;

export type Variant = "d" | "m";

export const clipSrc = (id: ChapterId, v: Variant) => `/promo/${id}-${v}.mp4`;
export const stillSrc = (id: ChapterId, v: Variant, edge: "a" | "z") => `/promo/${id}-${v}-${edge}.webp`;

const smooth = (t: number) => {
  const x = t < 0 ? 0 : t > 1 ? 1 : t;
  return x * x * (3 - 2 * x);
};

/** 1 = clip fills the stage, 0 = product stage. `c` is the clip's own progress. */
export function stageFill(mode: StageMode, c: number) {
  if (mode === "to-product") return 1 - smooth((c - 0.58) / 0.36);
  if (mode === "to-full") return smooth((c - 0.22) / 0.5);
  return 0;
}

export function clockToSeconds(s: string) {
  const [h, m, sec] = s.split(":").map(Number);
  return h * 3600 + m * 60 + sec;
}

export function formatClock(total: number) {
  const t = Math.max(0, Math.floor(total));
  const h = Math.floor(t / 3600) % 24;
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}
