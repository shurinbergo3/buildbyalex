"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

/* ────────────────────────────────────────────────────────────────────────
   Scroll-driven LegalWin discovery story. A tall section pins a horizontal
   MacBook to the viewport; as you scroll the lid opens (3D rotateX), the
   screen lights up, a Google query types itself in and legalwin.pl lands at
   #1 — then the same laptop flips to ChatGPT, which recommends the site by
   name. The whole timeline is scrubbed by the scroll wheel.
   ──────────────────────────────────────────────────────────────────────── */

type ResultItem = {
  site: string;
  breadcrumb: string;
  title: string;
  snippet: string;
  rating?: string;
};

type Segment =
  | { type: "text"; content: string }
  | { type: "bold"; content: string }
  | { type: "link"; content: string; href: string };

type SiteData = {
  url: string;
  badge: string;
  nav: string[];
  consult: string;
  title: string;
  titleAccent: string;
  subhead: string;
  rating: string;
  ratingLabel: string;
  ctaPrimary: string;
  ctaSecondary: string;
  chat: { name: string; role: string; message: string; placeholder: string };
};

const EASE = [0.16, 1, 0.3, 1] as const;

// Scroll-progress timeline (0 → 1 over the pinned section), three chapters:
// Google search → ChatGPT → the live legalwin.pl site.
const LID_END = 0.1; // lid finishes opening
const G_TYPE_START = 0.13;
const G_TYPE_END = 0.27;
const G_RESULTS_AT = 0.3;
const SPLIT_1 = 0.4; // Google → ChatGPT
const CG_Q_AT = 0.43;
const CG_TYPE_START = 0.46;
const CG_TYPE_END = 0.66;
const SPLIT_2 = 0.7; // ChatGPT → live site
const SITE_CHAT_AT = 0.82; // chat widget greeting lands

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const span = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

export function LegalwinScrollStory() {
  const t = useTranslations("home.legalwinShowcase");
  const tSerp = useTranslations("work.caseShowcase.legalwin.serp");
  const tCg = useTranslations("work.caseShowcase.legalwin.chatgpt");

  const queries = useMemo(
    () => tSerp.raw("queries") as { q: string; count: string; results: ResultItem[] }[],
    [tSerp],
  );
  const block = queries[0];
  const query = block.q;

  const userQuestion = tCg("userQuestion");
  const response = useMemo(() => tCg.raw("response") as Segment[], [tCg]);
  const fullText = useMemo(() => response.map((s) => s.content).join(""), [response]);

  const site = useMemo(
    () => ({
      url: t("site.url"),
      badge: t("site.badge"),
      nav: t.raw("site.nav") as string[],
      consult: t("site.consult"),
      title: t("site.title"),
      titleAccent: t("site.titleAccent"),
      subhead: t("site.subhead"),
      rating: t("site.rating"),
      ratingLabel: t("site.ratingLabel"),
      ctaPrimary: t("site.ctaPrimary"),
      ctaSecondary: t("site.ctaSecondary"),
      chat: {
        name: t("site.chat.name"),
        role: t("site.chat.role"),
        message: t("site.chat.message"),
        placeholder: t("site.chat.placeholder"),
      },
    }),
    [t],
  );

  const chapters = [
    { kicker: t("columns.serp.index"), label: t("columns.serp.label"), caption: t("columns.serp.caption") },
    { kicker: t("columns.chatgpt.index"), label: t("columns.chatgpt.label"), caption: t("columns.chatgpt.caption") },
    { kicker: t("columns.site.index"), label: t("columns.site.label"), caption: t("columns.site.caption") },
  ];

  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Lid + screen reveal — smooth motion values, no re-render.
  const rotateX = useTransform(scrollYProgress, [0, LID_END], reduce ? [0, 0] : [-78, 0]);
  const screenDim = useTransform(scrollYProgress, [0.02, LID_END], reduce ? [0, 0] : [0.85, 0]);
  const deviceOpacity = useTransform(scrollYProgress, [0, 0.05], [reduce ? 1 : 0.4, 1]);

  // Discrete state the screens read from — updated only when a value flips.
  const [active, setActive] = useState(0);
  const [gTyped, setGTyped] = useState(0);
  const [gResults, setGResults] = useState(false);
  const [cgQuestion, setCgQuestion] = useState(false);
  const [cgChars, setCgChars] = useState(0);
  const [siteChat, setSiteChat] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const nextActive = p < SPLIT_1 ? 0 : p < SPLIT_2 ? 1 : 2;
    setActive((c) => (c === nextActive ? c : nextActive));

    const typed = Math.round(span(p, G_TYPE_START, G_TYPE_END) * query.length);
    setGTyped((c) => (c === typed ? c : typed));
    const res = p >= G_RESULTS_AT;
    setGResults((c) => (c === res ? c : res));

    const q = p >= CG_Q_AT;
    setCgQuestion((c) => (c === q ? c : q));
    const chars = Math.round(span(p, CG_TYPE_START, CG_TYPE_END) * fullText.length);
    setCgChars((c) => (c === chars ? c : chars));

    const chat = p >= SITE_CHAT_AT;
    setSiteChat((c) => (c === chat ? c : chat));
  });

  const chapter = chapters[active];

  return (
    <div ref={ref} className="relative mt-16 md:mt-20" style={{ height: "340vh" }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="relative flex min-h-[88svh] w-full flex-col justify-center overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0d12] px-5 py-10 text-white shadow-[0_40px_120px_-40px_rgba(0,0,0,0.7)] sm:px-8 md:px-12 md:py-14">
          {/* Ambient glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-[8%] top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full opacity-60 blur-[120px]"
            style={{ background: "radial-gradient(circle, rgba(255,122,45,0.16) 0%, transparent 70%)" }}
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-14">
            {/* ── Chapter copy ── */}
            <div className="relative">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--c-accent)]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--c-accent)]" />
                {t("eyebrow")}
              </p>

              <div className="relative mt-5 min-h-[148px] lg:min-h-[180px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <span className="font-mono text-[12px] tracking-[0.08em] text-white/40">
                      {chapter.kicker}
                    </span>
                    <h3 className="mt-2 text-[clamp(26px,2.4vw+16px,40px)] font-semibold leading-[1.06] tracking-[-0.025em]">
                      {chapter.label}
                    </h3>
                    <p className="mt-3.5 max-w-[400px] text-[14.5px] leading-[1.55] text-white/60 sm:text-[15.5px]">
                      {chapter.caption}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress rail */}
              <div className="mt-7 flex items-center gap-3">
                {chapters.map((_, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/12"
                  >
                    <motion.span
                      className="absolute inset-0 origin-left rounded-full"
                      style={{ background: "var(--c-accent)" }}
                      initial={false}
                      animate={{ scaleX: i <= active ? 1 : 0, opacity: i <= active ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* ── Pinned MacBook ── */}
            <motion.div
              style={reduce ? undefined : { opacity: deviceOpacity }}
              className="[perspective:1800px] will-change-transform"
            >
              {/* Focused glow behind the laptop */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[78%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-[40px] opacity-80 blur-[60px]"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 40%, rgba(255,122,45,0.22) 0%, rgba(120,150,255,0.10) 45%, transparent 75%)",
                }}
              />

              {/* Lid */}
              <motion.div
                style={{
                  rotateX,
                  transformOrigin: "bottom center",
                  transformStyle: "preserve-3d",
                }}
                className="relative mx-auto w-full max-w-[780px]"
              >
                {/* Aluminium body */}
                <div
                  className="relative rounded-[22px] p-[9px] shadow-[0_60px_140px_-40px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.07),inset_0_1px_0_rgba(255,255,255,0.10)]"
                  style={{ background: "linear-gradient(180deg, #2a2e36 0%, #15171c 38%, #0a0b0f 100%)" }}
                >
                  {/* top edge sheen */}
                  <div aria-hidden className="pointer-events-none absolute inset-x-8 top-[2px] h-px rounded-full bg-white/30" />
                  {/* Black bezel */}
                  <div className="relative rounded-[14px] bg-[#050608] p-[3px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.6)]">
                    {/* Camera notch */}
                    <div className="absolute left-1/2 top-[5px] z-10 flex -translate-x-1/2 items-center">
                      <span className="h-[3px] w-[3px] rounded-full bg-white/30 ring-1 ring-white/10" />
                    </div>
                    {/* Screen */}
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[11px] bg-white">
                    <AnimatePresence mode="wait">
                      {active === 0 ? (
                        <motion.div
                          key="google"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="absolute inset-0"
                        >
                          <GoogleScreen
                            query={query}
                            typed={query.slice(0, gTyped)}
                            count={block.count}
                            results={block.results}
                            showResults={gResults}
                          />
                        </motion.div>
                      ) : active === 1 ? (
                        <motion.div
                          key="chatgpt"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="absolute inset-0"
                        >
                          <ChatGptScreen
                            question={userQuestion}
                            showQuestion={cgQuestion}
                            segments={sliceSegments(response, cgChars)}
                            typing={cgChars < fullText.length}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="site"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="absolute inset-0"
                        >
                          <WebsiteScreen site={site} showChat={siteChat} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Screen-off dim while the lid is still opening */}
                    {!reduce && (
                      <motion.div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-[#06070a]"
                        style={{ opacity: screenDim }}
                      />
                    )}
                    {/* Glass glare */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(125deg, rgba(255,255,255,0.10) 0%, transparent 30%, transparent 100%)",
                      }}
                    />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Base / deck */}
              <div aria-hidden className="relative mx-auto" style={{ width: "108%", marginLeft: "-4%" }}>
                <div
                  className="h-[12px] rounded-b-[12px] border-x border-b border-black/40"
                  style={{ background: "linear-gradient(180deg, #2c2f36 0%, #14161b 100%)" }}
                />
                <div
                  className="mx-auto h-[7px] w-[16%] rounded-b-[7px]"
                  style={{ background: "linear-gradient(180deg, #0c0d11 0%, #1a1c22 100%)" }}
                />
                <div className="mx-auto mt-3 h-[18px] w-[78%] rounded-[50%] bg-black/40 blur-md" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── GOOGLE SCREEN ───────────────────────── */

function GoogleScreen({
  query,
  typed,
  count,
  results,
  showResults,
}: {
  query: string;
  typed: string;
  count: string;
  results: ResultItem[];
  showResults: boolean;
}) {
  return (
    <div className="flex h-full flex-col bg-white">
      <BrowserChrome url="google.com/search" light />
      <div className="min-h-0 flex-1 overflow-hidden px-4 pt-3 sm:px-6">
        {/* Search row */}
        <div className="flex items-center gap-3 sm:gap-5">
          <GoogleLogo />
          <div className="flex min-h-[38px] flex-1 items-center gap-2 rounded-full border border-[#dfe1e5] px-4 py-1 shadow-[0_1px_6px_rgba(32,33,36,0.08)]">
            <span className="min-w-0 flex-1 break-words text-[14px] leading-[1.3] text-[#202124]">
              {typed || query.slice(0, 0)}
              <span className="ml-0.5 inline-block h-[14px] w-[1.5px] -mb-[2px] animate-pulse bg-[#202124] align-middle" />
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#4285f4]">
              <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2.2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-2.5 flex items-center gap-5 border-b border-[#ebebeb] text-[12px] text-[#5f6368]">
          <span className="relative py-2 text-[#1a73e8]">
            All
            <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-t bg-[#1a73e8]" />
          </span>
          {["Images", "News", "Maps", "Videos"].map((l) => (
            <span key={l} className="py-2">
              {l}
            </span>
          ))}
        </div>

        {/* Results */}
        <p className="mt-2.5 text-[10.5px] text-[#70757a]">{count}</p>
        <div className="relative mt-2 grid">
          {/* ghost reserves height so the screen never jumps */}
          <ol aria-hidden className="invisible space-y-3.5 [grid-area:1/1]">
            {results.slice(0, 3).map((item, i) => (
              <SerpResult key={`g-${i}`} item={item} highlight={i === 0} />
            ))}
          </ol>
          <AnimatePresence>
            {showResults && (
              <motion.ol
                key="live"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="space-y-3.5 [grid-area:1/1]"
              >
                {results.slice(0, 3).map((item, i) => (
                  <SerpResult key={`l-${i}`} item={item} highlight={i === 0} delay={i * 90} />
                ))}
              </motion.ol>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SerpResult({ item, highlight, delay = 0 }: { item: ResultItem; highlight: boolean; delay?: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay / 1000 }}
      className="relative max-w-[560px]"
    >
      {highlight && (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-2 -z-0 rounded-lg"
          style={{
            background: "linear-gradient(135deg, rgba(255,107,26,0.10) 0%, rgba(255,107,26,0.03) 100%)",
            boxShadow: "0 0 0 1px rgba(255,107,26,0.22)",
          }}
        />
      )}
      <div className="relative">
        <div className="flex items-center gap-2 text-[11px] text-[#202124]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f1f3f4] text-[9px] font-semibold text-[#5f6368]">
            {item.site.charAt(0).toUpperCase()}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-medium">{item.site}</span>
            <span className="text-[10px] text-[#5f6368]">{item.breadcrumb}</span>
          </span>
          {highlight && (
            <span className="ml-1 inline-flex items-center rounded-full bg-[#ff6b1a]/10 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-[#c44a00]">
              #1
            </span>
          )}
        </div>
        <h4 className="mt-0.5 text-[14px] leading-[1.3] text-[#1a0dab]">{item.title}</h4>
        <p className="mt-0.5 line-clamp-2 text-[12px] leading-[1.45] text-[#4d5156]">{item.snippet}</p>
        {item.rating && (
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#70757a]">
            <span className="text-[#fbbc05]">★★★★★</span>
            <span>{item.rating}</span>
          </p>
        )}
      </div>
    </motion.li>
  );
}

/* ───────────────────────── CHATGPT SCREEN ───────────────────────── */

function ChatGptScreen({
  question,
  showQuestion,
  segments,
  typing,
}: {
  question: string;
  showQuestion: boolean;
  segments: Segment[];
  typing: boolean;
}) {
  const hasAnswer = segments.length > 0;
  return (
    <div className="flex h-full flex-col" style={{ background: "#212121" }}>
      <BrowserChrome url="chatgpt.com" />
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-2 text-white/90">
        <span className="text-[13px] font-semibold">ChatGPT</span>
        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-medium">5</span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden px-4 py-3.5 sm:px-8">
        <div className="mx-auto max-w-[560px] space-y-3">
          <AnimatePresence>
            {showQuestion && (
              <motion.div
                key="q"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-auto max-w-[82%] rounded-2xl rounded-br-md px-3.5 py-2 text-[12.5px] leading-[1.5] text-white"
                style={{ background: "#2f2f2f" }}
              >
                {question}
              </motion.div>
            )}
          </AnimatePresence>

          {showQuestion && (
            <div className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/40 ring-1 ring-white/10">
                <Sparkle />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                {hasAnswer ? (
                  <div className="whitespace-pre-line text-[12.5px] leading-[1.55] text-white/90">
                    {renderSegments(segments)}
                    {typing && (
                      <span
                        className="ml-0.5 inline-block h-[13px] w-[7px] -mb-[1px] bg-white/80 align-baseline"
                        style={{ animation: "lsBlink 900ms steps(2) infinite" }}
                      />
                    )}
                  </div>
                ) : (
                  <ThinkingDots />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes lsBlink{50%{opacity:0}}`}</style>
    </div>
  );
}

/* ───────────────────────── WEBSITE SCREEN ───────────────────────── */

function WebsiteScreen({ site, showChat }: { site: SiteData; showChat: boolean }) {
  return (
    <div className="flex h-full flex-col bg-[#0a0c11]">
      <BrowserChrome url={site.url} />
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* Warsaw-skyline ambience + brand wash */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 78% -10%, rgba(214,176,96,0.18) 0%, transparent 45%), linear-gradient(180deg, #11141c 0%, #0a0c11 60%, #07080c 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[55%] opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(0,0,0,0.6), transparent), repeating-linear-gradient(90deg, rgba(120,140,180,0.10) 0 2px, transparent 2px 13px)",
            maskImage: "linear-gradient(to top, black, transparent)",
          }}
        />

        <div className="relative flex h-full flex-col">
          {/* Top nav */}
          <div className="flex items-center justify-between px-4 pt-3 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[#d6b060]/50 bg-[#d6b060]/10 text-[9px] font-bold tracking-tight text-[#e8c879]">
                LW
              </span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 sm:inline">
                LegalWin
              </span>
            </div>
            <nav className="hidden items-center gap-4 text-[10.5px] text-white/65 md:flex">
              {site.nav.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </nav>
            <span className="flex items-center gap-1 rounded-full bg-[#d6b060] px-3 py-1 text-[10px] font-semibold text-[#1a1408]">
              {site.consult} →
            </span>
          </div>

          {/* Hero */}
          <div className="flex min-h-0 flex-1 items-center px-5 sm:px-7">
            <div className="grid w-full items-center gap-4 lg:grid-cols-[1fr_auto]">
              <div className="max-w-[460px]">
                <p className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#d6b060]">
                  <span className="h-px w-5 bg-[#d6b060]/70" />
                  {site.badge}
                </p>
                <h3 className="mt-2.5 font-serif text-[clamp(18px,3.2vw,30px)] font-semibold leading-[1.08] tracking-[-0.01em] text-white">
                  {site.title}
                </h3>
                <p className="mt-1 font-serif text-[clamp(15px,2.6vw,24px)] italic leading-[1.1] text-[#e8c879]">
                  {site.titleAccent}
                </p>
                <p className="mt-3 max-w-[380px] text-[11px] leading-[1.5] text-white/60">{site.subhead}</p>

                <div className="mt-3.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6b060]/40 px-2.5 py-1 text-[10px] text-white/85">
                    <span className="text-[#e8c879]">★★★★★</span>
                    <span className="font-semibold">{site.rating}</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.14em] text-white/45">{site.ratingLabel}</span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <span className="rounded-full bg-[#d6b060] px-3.5 py-1.5 text-[11px] font-semibold text-[#1a1408]">
                    {site.ctaPrimary} →
                  </span>
                  <span className="rounded-full border border-white/20 px-3.5 py-1.5 text-[11px] font-medium text-white/85">
                    {site.ctaSecondary}
                  </span>
                </div>
              </div>

              {/* Chat widget */}
              <div className="hidden w-[210px] lg:block">
                <AnimatePresence>
                  {showChat && (
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="rounded-2xl border border-white/10 bg-[#14161d]/95 p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#d6b060] to-[#9c7a2e] text-[10px] font-bold text-[#1a1408]">
                          {site.chat.name.charAt(0)}
                        </span>
                        <div className="leading-tight">
                          <p className="text-[11px] font-semibold text-white">{site.chat.name}</p>
                          <p className="text-[8.5px] text-white/45">{site.chat.role}</p>
                        </div>
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#27c93f]" />
                      </div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.25 }}
                        className="mt-2.5 rounded-xl rounded-tl-sm bg-white/[0.06] px-2.5 py-2 text-[10px] leading-[1.45] text-white/80"
                      >
                        {site.chat.message}
                      </motion.p>
                      <div className="mt-2.5 flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1.5">
                        <span className="flex-1 truncate text-[9.5px] text-white/35">{site.chat.placeholder}</span>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-[#d6b060]">
                          <path d="M3 11l18-8-8 18-2-7-8-3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── SHARED BITS ───────────────────────── */

function BrowserChrome({ url, light }: { url: string; light?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 border-b px-4 py-2.5 ${light ? "border-black/5" : "border-white/5"}`}
      style={{ background: light ? "#f1f3f4" : "#171717" }}
    >
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
      </div>
      <div
        className={`mx-auto flex max-w-[300px] flex-1 items-center justify-center gap-2 rounded-full px-3 py-1 text-[11px] ${
          light ? "bg-white text-[#5f6368]" : "bg-black/40 text-white/60"
        }`}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 1a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-2V6a5 5 0 0 0-5-5zm-3 8V6a3 3 0 1 1 6 0v3H9z"
            fill="currentColor"
          />
        </svg>
        <span className="truncate">{url}</span>
      </div>
      <div className="w-8" />
    </div>
  );
}

function renderSegments(segments: Segment[]) {
  return segments.map((seg, i) => {
    if (seg.type === "bold")
      return (
        <strong key={i} className="font-semibold text-white">
          {seg.content}
        </strong>
      );
    if (seg.type === "link")
      return (
        <span key={i} className="text-[#7ab7ff] underline decoration-[#7ab7ff]/40 underline-offset-2">
          {seg.content}
        </span>
      );
    return <span key={i}>{seg.content}</span>;
  });
}

function sliceSegments(segments: Segment[], chars: number): Segment[] {
  const out: Segment[] = [];
  let remaining = chars;
  for (const seg of segments) {
    if (remaining <= 0) break;
    if (seg.content.length <= remaining) {
      out.push(seg);
      remaining -= seg.content.length;
    } else {
      out.push({ ...seg, content: seg.content.slice(0, remaining) } as Segment);
      remaining = 0;
    }
  }
  return out;
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 pt-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-white/40"
          style={{ animation: `lsPulse 1s ease-in-out ${i * 0.15}s infinite` }}
        />
      ))}
      <style>{`@keyframes lsPulse{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}`}</style>
    </div>
  );
}

function Sparkle() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"
        stroke="white"
        strokeOpacity="0.75"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.5" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg width="74" height="24" viewBox="0 0 272 92" aria-label="Google" className="shrink-0">
      <path
        fill="#4285F4"
        d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.86 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
      />
      <path
        fill="#EA4335"
        d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
      />
      <path
        fill="#FBBC05"
        d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.62 13.36 12.35 13.36 6.63 0 11.84-5.62 11.84-13.36z"
      />
      <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z" />
      <path
        fill="#EA4335"
        d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
      />
      <path
        fill="#4285F4"
        d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"
      />
    </svg>
  );
}
