"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  CHAPTERS,
  CHAPTER_STARTS,
  FILM_FPS,
  FILM_LENGTH,
  clipSrc,
  clockToSeconds,
  formatClock,
  stageFill,
  stillSrc,
  type ChapterId,
  type Variant,
} from "./film";
import { scrollToY } from "@/lib/smoothScroll";

/* ────────────────────────────────────────────────────────────────────────
   One sticky stage for the whole film. Scroll position picks the chapter,
   the chapter's clip is scrubbed frame by frame, and the HTML layer on top
   reads the chapter progress from a single `--p` custom property, so the
   copy and UI animate in CSS without React re-rendering per frame.
   ──────────────────────────────────────────────────────────────────────── */

type Clip = {
  status: "idle" | "loading" | "ready" | "failed";
  blobUrl: string;
  token: number;
  target: number;
  current: number;
  seeking: boolean;
  seekAt: number;
  /** Seek even if the video already sits on the target frame. */
  force: boolean;
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const LERP = 0.16;
/** Phones, plus tablets held upright: they get the 4:5 crop and stacked copy.
    Keep in sync with the film's layout media query in promo.css. */
const PHONE_LAYOUT = "(max-width: 767px), (max-width: 1100px) and (orientation: portrait)";
/** Share of a clip over which the previous chapter's last frame fades out. */
const SEAM = 0.06;
/** A seek that hasn't reported back by then is treated as lost and re-sent. */
const SEEK_LOST_MS = 1500;
const CLOCKS = CHAPTERS.map((c) => c.clock.map(clockToSeconds) as [number, number]);
const WARSAW = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Warsaw",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export function PromoFilm({
  layers,
  nav,
  navLabel,
  clockLabels,
}: {
  layers: Record<ChapterId, ReactNode>;
  nav: { id: ChapterId; label: string }[];
  navLabel: string;
  clockLabels: { night: string; morning: string; now: string };
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const clipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const clockRef = useRef<HTMLSpanElement>(null);

  const goTo = (i: number) => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const h = stage.clientHeight || window.innerHeight;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const c = CHAPTERS[i];
    // Land where the clip has finished and the in-frame copy has settled.
    scrollToY(top + (CHAPTER_STARTS[i] + c.length * Math.min(c.clip[1] + 0.15, 0.9)) * h);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = window.matchMedia(PHONE_LAYOUT);
    let variant: Variant = phone.matches ? "m" : "d";
    const n = CHAPTERS.length;
    const clips: Clip[] = CHAPTERS.map(() => ({
      status: "idle",
      blobUrl: "",
      token: 0,
      target: 0,
      current: 0,
      seeking: false,
      seekAt: 0,
      force: false,
    }));
    let active = -1;
    let armed = false;
    let lastClock = "";
    let lastFill = -1;
    let lastSeam = -1;
    let morning = false;
    let nowOn = false;
    let liveSecs = 0;
    let liveAt = -1e9;
    let raf = 0;
    let alive = true;

    // Seconds since midnight in Warsaw, re-read a couple of times a second.
    const warsawNow = () => {
      const t = performance.now();
      if (t - liveAt > 400) {
        liveAt = t;
        const [h, m, s] = WARSAW.format(new Date()).split(":").map(Number);
        liveSecs = h * 3600 + m * 60 + s;
      }
      return liveSecs;
    };

    const stills = (i: number) => {
      clipRefs.current[i]?.querySelectorAll<HTMLImageElement>("img[data-edge]").forEach((img) => {
        const src = stillSrc(CHAPTERS[i].id, variant, img.dataset.edge as "a" | "z");
        if (img.getAttribute("src") !== src) img.setAttribute("src", src);
      });
    };

    const seek = (i: number) => {
      const clip = clips[i];
      const video = videoRefs.current[i];
      if (!video || clip.status !== "ready") return;
      const dur = video.duration;
      if (!Number.isFinite(dur) || dur <= 0) return;
      const frames = Math.max(1, Math.round(dur * FILM_FPS));
      let t = Math.min(dur - 0.001, (Math.round(clip.current * (frames - 1)) + 0.5) / FILM_FPS);
      const now = performance.now();
      // Never replace a seek that is still decoding. Safari under load needs
      // 300 ms and more per seek; re-seeking sooner cancels every one of them
      // and the picture freezes on the clip's first frame while the copy runs
      // on. The next seek goes out from `seeked`, aimed at the latest target.
      if (clip.seeking && now - clip.seekAt < SEEK_LOST_MS) return;
      if (Math.abs(video.currentTime - t) < 0.5 / FILM_FPS) {
        if (!clip.force) return;
        // Same frame, but it has to be decoded again: move a hair inside it.
        if (Math.abs(video.currentTime - t) < 0.001) t = Math.max(0, t - 0.004);
      }
      clip.force = false;
      clip.seeking = true;
      clip.seekAt = now;
      video.currentTime = t;
    };

    // The whole file goes into memory before the first seek: scrubbing a
    // stream means a range request per frame and a stutter on every one.
    const load = async (i: number) => {
      const clip = clips[i];
      const video = videoRefs.current[i];
      if (!video || clip.status !== "idle" || reduce) return;
      clip.status = "loading";
      const token = ++clip.token;
      const src = clipSrc(CHAPTERS[i].id, variant);
      let url = src;
      try {
        const res = await fetch(src);
        if (res.ok) {
          const blob = await res.blob();
          if (!alive || token !== clip.token) return;
          clip.blobUrl = URL.createObjectURL(blob);
          url = clip.blobUrl;
        }
      } catch {
        /* fall back to streaming the file */
      }
      if (!alive || token !== clip.token) return;
      video.src = url;
      video.load();
    };

    const unload = (i: number) => {
      const clip = clips[i];
      if (clip.status === "idle") return;
      clip.token++;
      clip.status = "idle";
      clip.seeking = false;
      const video = videoRefs.current[i];
      if (video) {
        video.removeAttribute("src");
        video.load();
      }
      if (clip.blobUrl) URL.revokeObjectURL(clip.blobUrl);
      clip.blobUrl = "";
      clipRefs.current[i]?.removeAttribute("data-ready");
    };

    const fillWindow = () => {
      if (!armed || active < 0) return;
      const ahead = variant === "m" ? 1 : 2;
      for (let i = 0; i < n; i++) {
        if (i >= active - 1 && i <= active + ahead) {
          stills(i);
          load(i);
        } else if (variant === "m" && (i < active - 2 || i > active + ahead + 1)) {
          unload(i);
        }
      }
    };

    const setActive = (idx: number) => {
      if (idx === active) return;
      active = idx;
      for (let i = 0; i < n; i++) {
        const on = i === idx;
        clipRefs.current[i]?.toggleAttribute("data-on", on);
        clipRefs.current[i]?.toggleAttribute("data-prev", i === idx - 1);
        navRefs.current[i]?.toggleAttribute("data-on", on);
        const layer = layerRefs.current[i];
        if (layer) {
          layer.toggleAttribute("data-on", on);
          if (!on) layer.style.setProperty("--p", i < idx ? "1" : "0");
        }
        if (!on) {
          // Park every other clip on the frame where it meets the active one.
          const edge = i < idx ? 1 : 0;
          clips[i].target = clips[i].current = edge;
          clipRefs.current[i]?.toggleAttribute("data-end", edge === 1);
          seek(i);
        }
      }
      // A clip parked off screen may never have painted its frame (WebKit is
      // lazy with video it can't see): cover it with the matching still and
      // decode that frame again before the still steps aside.
      const box = clipRefs.current[idx];
      if (box && clips[idx].status === "ready") {
        box.removeAttribute("data-ready");
        clips[idx].force = true;
      }
      stills(idx);
      if (idx > 0) stills(idx - 1);
      fillWindow();
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const h = stage.clientHeight || window.innerHeight;
      const y = -section.getBoundingClientRect().top / h;
      let idx = 0;
      for (let i = n - 1; i > 0; i--) {
        if (y >= CHAPTER_STARTS[i]) {
          idx = i;
          break;
        }
      }
      const ch = CHAPTERS[idx];
      const local = clamp01((y - CHAPTER_STARTS[idx]) / ch.length);
      setActive(idx);

      layerRefs.current[idx]?.style.setProperty("--p", local.toFixed(4));
      stage.style.setProperty("--fp", clamp01(y / FILM_LENGTH).toFixed(4));

      const clip = clips[idx];
      clip.target = clamp01((local - ch.clip[0]) / (ch.clip[1] - ch.clip[0]));
      clip.current = reduce ? clip.target : clip.current + (clip.target - clip.current) * LERP;
      if (Math.abs(clip.target - clip.current) < 0.0005) clip.current = clip.target;
      seek(idx);
      const box = clipRefs.current[idx];
      const end = clip.current > 0.5;
      if (box && box.hasAttribute("data-end") !== end) box.toggleAttribute("data-end", end);

      const fill = Math.round(stageFill(ch.stage, clip.current) * 1000) / 1000;
      if (fill !== lastFill) {
        lastFill = fill;
        stage.style.setProperty("--full", String(fill));
      }
      const seam = idx > 0 ? Math.round((1 - clamp01(clip.current / SEAM)) * 100) / 100 : 0;
      if (seam !== lastSeam) {
        lastSeam = seam;
        stage.style.setProperty("--seam", String(seam));
      }

      // The film ends in the present: the last chapter lands on the real time
      // in Warsaw and keeps ticking there.
      const last = idx === n - 1;
      const [c0, storyEnd] = CLOCKS[idx];
      let c1 = storyEnd;
      if (last) {
        c1 = warsawNow();
        if (c1 < c0) c1 += 86400;
      }
      const secs = c0 + (c1 - c0) * clip.current;
      const label = formatClock(secs);
      if (label !== lastClock && clockRef.current) {
        lastClock = label;
        clockRef.current.textContent = label;
      }
      const isMorning = secs >= 7 * 3600;
      if (isMorning !== morning) {
        morning = isMorning;
        stage.toggleAttribute("data-morning", morning);
      }
      const isNow = last && clip.current > 0.9;
      if (isNow !== nowOn) {
        nowOn = isNow;
        stage.toggleAttribute("data-now", isNow);
      }
    };

    const off: (() => void)[] = [];
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      video.muted = true;
      const onData = () => {
        const clip = clips[i];
        if (clip.status !== "loading") return;
        clip.status = "ready";
        // iOS paints a seek only on a video that has been played once.
        video
          .play()
          .then(() => video.pause())
          .catch(() => {})
          .finally(() => {
            clip.seeking = false;
            seek(i);
          });
      };
      const onSeeked = () => {
        clips[i].seeking = false;
        clipRefs.current[i]?.setAttribute("data-ready", "");
        // The scroll has usually moved on while this frame decoded; parked
        // clips get no per-frame seek, so chase the target from here.
        seek(i);
      };
      const onError = () => {
        clips[i].status = "failed";
      };
      video.addEventListener("loadeddata", onData);
      video.addEventListener("seeked", onSeeked);
      video.addEventListener("error", onError);
      off.push(() => {
        video.removeEventListener("loadeddata", onData);
        video.removeEventListener("seeked", onSeeked);
        video.removeEventListener("error", onError);
      });
    });

    // The first clip isn't needed until the reader scrolls, so keep it off the
    // critical path: pull it in on idle, or on the first sign of intent.
    const arm = () => {
      if (armed) return;
      armed = true;
      fillWindow();
    };
    const idle = window as unknown as {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const idleId = idle.requestIdleCallback
      ? idle.requestIdleCallback(arm, { timeout: 2500 })
      : window.setTimeout(arm, 1500);
    const intents = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"];
    intents.forEach((ev) => window.addEventListener(ev, arm, { once: true, passive: true }));

    const onGo = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-film-go]");
      if (!btn) return;
      const i = CHAPTERS.findIndex((c) => c.id === btn.dataset.filmGo);
      if (i < 0) return;
      e.preventDefault();
      goTo(i);
    };
    stage.addEventListener("click", onGo);

    const onBreakpoint = () => {
      variant = phone.matches ? "m" : "d";
      for (let i = 0; i < n; i++) unload(i);
      const was = active;
      active = -1;
      setActive(Math.max(0, was));
    };
    phone.addEventListener("change", onBreakpoint);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!raf) raf = requestAnimationFrame(frame);
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(section);

    return () => {
      alive = false;
      io.disconnect();
      cancelAnimationFrame(raf);
      off.forEach((f) => f());
      stage.removeEventListener("click", onGo);
      phone.removeEventListener("change", onBreakpoint);
      intents.forEach((ev) => window.removeEventListener(ev, arm));
      if (idle.cancelIdleCallback) idle.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
      clips.forEach((c) => c.blobUrl && URL.revokeObjectURL(c.blobUrl));
    };
    // goTo only reads refs, so the engine is set up exactly once.
  }, []);

  return (
    <section
      ref={sectionRef}
      className="pf-film"
      style={{ ["--film-len" as string]: FILM_LENGTH + 1 }}
    >
      <div ref={stageRef} className="pf-stage">
        <div className="pf-box pf-media" aria-hidden="true">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.id}
              ref={(el) => {
                clipRefs.current[i] = el;
              }}
              className="pf-clip"
              data-on={i === 0 ? "" : undefined}
            >
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                muted
                playsInline
                preload="none"
                disablePictureInPicture
                disableRemotePlayback
                tabIndex={-1}
              />
              {/* Plain <img>: the engine swaps these sources itself, per breakpoint. */}
              {i === 0 ? (
                <picture>
                  <source media={PHONE_LAYOUT} srcSet={stillSrc(c.id, "m", "a")} />
                  <img className="pf-still pf-still-a" src={stillSrc(c.id, "d", "a")} alt="" fetchPriority="high" />
                </picture>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="pf-still pf-still-a" data-edge="a" alt="" decoding="async" />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="pf-still pf-still-z" data-edge="z" alt="" decoding="async" />
            </div>
          ))}
        </div>

        <div className="pf-scrim" aria-hidden="true" />

        {CHAPTERS.map((c, i) => (
          <div
            key={c.id}
            ref={(el) => {
              layerRefs.current[i] = el;
            }}
            className={`pf-layer pf-layer--${c.id}`}
            data-on={i === 0 ? "" : undefined}
            style={{ ["--p" as string]: 0 }}
          >
            {layers[c.id]}
          </div>
        ))}

        <div className="pf-clock" aria-hidden="true">
          <span ref={clockRef} className="pf-clock-time">
            02:14:00
          </span>
          <span className="pf-clock-note">
            <span data-when="night">{clockLabels.night}</span>
            <span data-when="morning">{clockLabels.morning}</span>
            <span data-when="now">{clockLabels.now}</span>
          </span>
        </div>

        <nav className="pf-nav" aria-label={navLabel}>
          {nav.map((item) => {
            const i = CHAPTERS.findIndex((c) => c.id === item.id);
            return (
              <button
                key={item.id}
                ref={(el) => {
                  navRefs.current[i] = el;
                }}
                type="button"
                onClick={() => goTo(i)}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="pf-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
