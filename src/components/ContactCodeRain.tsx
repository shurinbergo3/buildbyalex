"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

/**
 * Falling-code backdrop for /contact.
 *
 * Two layers: a static plate of torn-off source (TS, Python, Swift, Go, Rust,
 * SQL, shell, CSS tokens) that reads as code, and columns drifting down over it
 * with an amber-burning head. Kept deliberately faint — the form is the hero,
 * this is atmosphere. Decorative, so it's hidden from a11y and frozen when
 * motion is reduced.
 */

const TAPES = [
  `const lead = await fetch("/api/contact", { method: "POST", body: JSON.stringify(payload) }); if (!res.ok) throw new Error("send failed"); export default function ContactForm() { const [state, setState] = useState("idle"); return <form onSubmit={onSubmit} noValidate />; }`,
  `async def notify(payload: dict) -> None: text = f"new lead {payload['name']} · {payload['budget']}"; await bot.send_message(chat_id=CHAT_ID, text=text, parse_mode="HTML"); logger.info("delivered in %.2fs", time.monotonic() - started)`,
  `struct LeadView: View { @State private var name = ""; @FocusState var focused: Field?; var body: some View { VStack(alignment: .leading, spacing: 16) { TextField("Ваше имя", text: $name).textFieldStyle(.roundedBorder) } } }`,
  `func handler(w http.ResponseWriter, r *http.Request) { var lead Lead; if err := json.NewDecoder(r.Body).Decode(&lead); err != nil { http.Error(w, "bad request", 400); return }; go queue.Push(ctx, lead); w.WriteHeader(http.StatusAccepted) }`,
  `fn main() -> Result<(), Error> { let lead = Lead::new("buildbyalex")?; let scored = leads.iter().filter(|l| l.budget > 3_000).map(|l| l.score()).collect::<Vec<_>>(); println!("{scored:?}"); Ok(()) }`,
  `SELECT id, name, budget, source FROM leads WHERE created_at > now() - interval '24 hours' AND status = 'new' GROUP BY source ORDER BY budget DESC LIMIT 50; CREATE INDEX CONCURRENTLY leads_created_idx ON leads (created_at DESC);`,
  `$ npm run build && npx vercel deploy --prod ✓ compiled 1.4s · 38 routes · first load 84 kB $ git commit -m "ship it" && git push origin main ✓ deployed to production in 41s`,
  `:root { --c-accent: #FF6B1A; --r-xl: 28px; --ease-out-apple: cubic-bezier(0.16, 1, 0.3, 1) } .panel { backdrop-filter: blur(18px) saturate(140%); box-shadow: 0 28px 60px -32px rgba(10,10,10,.22); transition: transform 240ms var(--ease-out-apple) }`,
  `type Payload = { name: string; email: string; budget: Budget; locale: Locale }; const isValidEmail = (s: string) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(s); export async function POST(req: NextRequest) { return NextResponse.json({ ok: true }, { status: 200 }) }`,
  `class LeadRepository @Inject constructor(private val api: ContactApi) { suspend fun submit(form: LeadForm): Result<Unit> = runCatching { api.send(form.toDto()) }.onSuccess { analytics.track("lead_submitted") } }`,
];

const FONT_SIZE = 13;
const CELL_H = 17;
const CELL_W = 23;
const FRAME_MS = 45;

type Column = {
  x: number;
  head: number;
  tape: string;
  offset: number;
  tail: number;
  step: number;
  acc: number;
  wait: number;
  weight: number;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

export function ContactCodeRain() {
  const rainRef = useRef<HTMLCanvasElement | null>(null);
  const plateRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const rain = rainRef.current;
    const plate = plateRef.current;
    const host = rain?.parentElement;
    if (!rain || !plate || !host) return;
    const ctx = rain.getContext("2d");
    const pctx = plate.getContext("2d");
    if (!ctx || !pctx) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cols: Column[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let onScreen = true;

    const palette = () =>
      themeRef.current === "dark"
        ? { ink: "236, 236, 240", head: "255, 138, 61", tail: 0.26, glow: 0.85, plate: 0.055 }
        : { ink: "26, 26, 30", head: "255, 96, 10", tail: 0.22, glow: 0.8, plate: 0.042 };

    const spawn = (x: number, seeded: boolean): Column => {
      const rows = Math.ceil(h / CELL_H);
      const tail = Math.round(rand(12, 26));
      return {
        x,
        head: seeded ? Math.round(rand(-rows * 0.5, rows)) : Math.round(rand(-24, -tail)),
        tape: pick(TAPES),
        offset: Math.floor(rand(0, 400)),
        tail,
        step: rand(55, 175),
        acc: 0,
        wait: seeded ? 0 : rand(0, 2200),
        // Depth: near columns read clearly, far ones sit back in the haze.
        weight: rand(0.5, 1.2),
      };
    };

    const build = (seeded: boolean) => {
      const count = Math.max(1, Math.floor(w / CELL_W));
      const inset = (w - count * CELL_W) / 2;
      cols = Array.from({ length: count }, (_, i) => spawn(inset + i * CELL_W, seeded));
      // Thin the field out — a gap-free wall of glyphs reads as wallpaper.
      cols = cols.filter(() => Math.random() > 0.12);
    };

    // Torn-off horizontal snippets sitting behind the rain, drawn once per
    // layout. This is what makes the backdrop read as code rather than glyphs.
    const drawPlate = () => {
      const pal = palette();
      pctx.clearRect(0, 0, w, h);
      const gap = CELL_H * 2.9;
      const rows = Math.floor(h / gap);
      for (let r = 0; r < rows; r++) {
        const y = r * gap + rand(-4, 4);
        let x = rand(-120, w * 0.45);
        while (x < w) {
          const tape = pick(TAPES);
          const from = Math.floor(rand(0, tape.length - 60));
          const text = tape.slice(from, from + Math.round(rand(10, 38))).trim();
          const alpha = pal.plate * rand(0.4, 1.3);
          pctx.fillStyle = /[{}()<>[\];=]/.test(text[0] ?? "")
            ? `rgba(${pal.head}, ${alpha * 1.15})`
            : `rgba(${pal.ink}, ${alpha})`;
          pctx.fillText(text, x, y);
          x += pctx.measureText(text).width + rand(170, 540);
        }
      }
    };

    const layout = () => {
      const rect = host.getBoundingClientRect();
      const nw = Math.max(1, Math.round(rect.width));
      const nh = Math.max(1, Math.round(rect.height));
      if (nw === w && nh === h) return false;
      w = nw;
      h = nh;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const mono = getComputedStyle(document.documentElement)
        .getPropertyValue("--font-geist-mono")
        .trim();
      const font = `500 ${FONT_SIZE}px ${mono ? `${mono}, ` : ""}ui-monospace, SFMono-Regular, Menlo, monospace`;
      for (const [el, c] of [
        [rain, ctx],
        [plate, pctx],
      ] as const) {
        el.width = Math.round(w * dpr);
        el.height = Math.round(h * dpr);
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.font = font;
        c.textBaseline = "top";
      }
      return true;
    };

    const drawColumn = (c: Column, pal: ReturnType<typeof palette>) => {
      for (let i = 0; i < c.tail; i++) {
        const row = c.head - i;
        if (row < 0) continue;
        const y = row * CELL_H;
        if (y > h) continue;
        const ch = c.tape[(c.offset + row) % c.tape.length];
        if (ch === " ") continue;
        if (i === 0) {
          // shadowBlur is the expensive bit — only the near columns get a halo.
          const halo = c.weight > 0.85;
          if (halo) {
            ctx.shadowColor = `rgba(${pal.head}, 0.5)`;
            ctx.shadowBlur = 10;
          }
          ctx.fillStyle = `rgba(${pal.head}, ${pal.glow * Math.min(1, c.weight + 0.25)})`;
          ctx.fillText(ch, c.x, y);
          if (halo) ctx.shadowBlur = 0;
        } else if (i < 4) {
          ctx.fillStyle = `rgba(${pal.head}, ${pal.tail * c.weight * (2.6 - i * 0.55)})`;
          ctx.fillText(ch, c.x, y);
        } else {
          const k = 1 - i / c.tail;
          ctx.fillStyle = `rgba(${pal.ink}, ${pal.tail * c.weight * k * k})`;
          ctx.fillText(ch, c.x, y);
        }
      }
    };

    const paint = (dt: number) => {
      const pal = palette();
      const rows = Math.ceil(h / CELL_H);
      ctx.clearRect(0, 0, w, h);
      for (const c of cols) {
        if (c.wait > 0) {
          c.wait -= dt;
          continue;
        }
        c.acc += dt;
        while (c.acc >= c.step) {
          c.acc -= c.step;
          c.head += 1;
        }
        drawColumn(c, pal);
        if (c.head - c.tail > rows) Object.assign(c, spawn(c.x, false));
      }
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = t - last;
      if (dt < FRAME_MS) return;
      last = t;
      paint(Math.min(dt, 120));
    };

    const start = () => {
      if (raf || !onScreen || motion.matches) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const freeze = () => {
      stop();
      const pal = palette();
      ctx.clearRect(0, 0, w, h);
      for (const c of cols) drawColumn(c, pal);
    };

    const reset = () => {
      build(true);
      drawPlate();
      if (motion.matches) freeze();
      else start();
    };

    layout();
    reset();

    const ro = new ResizeObserver(() => {
      if (layout()) reset();
    });
    ro.observe(host);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { rootMargin: "120px" },
    );
    io.observe(host);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", reset);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", reset);
    };
  }, [theme]);

  return (
    <div className="contact-rain" aria-hidden="true">
      <canvas ref={plateRef} className="contact-rain__plate" />
      <canvas ref={rainRef} className="contact-rain__canvas" />
      <div className="contact-rain__veil" />
      <div className="contact-rain__glow" />
    </div>
  );
}
