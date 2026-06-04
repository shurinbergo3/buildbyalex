/**
 * The surface revealed under the hero spotlight.
 *
 * Not a stock photo of code — the actual (lightly trimmed) source of this very
 * hero's scroll-morph, tokenised on the fly so it stays crisp at any DPI and
 * tints to the brand palette. Self-referential on purpose: the spotlight reveals
 * the exact animation you're watching. Decorative only — hidden from a11y.
 */

const SOURCE = `import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

// buildbyalex — hero scroll-morph. idea to release, end to end.
export function Hero() {
  const t = useTranslations("home.hero");
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let currentP = 0;
    let targetP = 0;

    const computeTarget = () => {
      const rect = sectionRef.current.getBoundingClientRect();
      const zone = Math.max(1, rect.height - innerHeight);
      const raw = reduced ? 0 : Math.min(1, Math.max(0, -rect.top / zone));
      targetP = raw * raw * (3 - 2 * raw);
    };

    const apply = (p) => {
      const frame = frameRef.current;
      const content = contentRef.current;
      const maxX = Math.min(160, innerWidth * 0.08);
      frame.style.top = p * 80 + "px";
      frame.style.left = p * maxX + "px";
      frame.style.right = p * maxX + "px";
      frame.style.bottom = p * 120 + "px";
      frame.style.borderRadius = p * 28 + "px";
      content.style.transform = "scale(" + (1 - p * 0.18) + ")";
      content.style.opacity = 1 - p * 0.25;
    };

    // spring toward target even if the user scroll-blasts past
    const tick = () => {
      computeTarget();
      const diff = targetP - currentP;
      if (Math.abs(diff) < 0.0008) return apply(currentP);
      currentP += diff * 0.12;
      apply(currentP);
      requestAnimationFrame(tick);
    };

    addEventListener("scroll", () => requestAnimationFrame(tick));
    return () => removeEventListener("scroll", tick);
  }, []);

  return (
    <section ref={sectionRef} className="hero-scroll">
      <div className="hero-sticky">
        <div ref={frameRef} className="hero-frame">
          <HeroCodeSurface />
          <div className="hero-flashlight" />
          <div className="hero-chrome">buildbyalex.com</div>
        </div>
        <div ref={contentRef} className="hero-content">
          <Container size="default">
            <h1 className="t-hero">
              Сайты, AI-агенты
              и мобильные приложения.
              <span className="hl-accent">Под ключ за 1–3 недели.</span>
            </h1>
            <p className="hero-sub">{t("subhead")}</p>
            <Button href="/contact" size="lg">
              {t("primaryCta")}
            </Button>
          </Container>
        </div>
      </div>
    </section>
  );
  // ● Live · Warsaw — shipped, not staged
}

// app/api/contact/route.ts — leads land in Telegram instantly
import { NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT = process.env.TELEGRAM_CHAT_ID;

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const text = [
    "🟠 Новая заявка — buildbyalex",
    "Имя: " + name,
    "Email: " + email,
    "",
    message,
  ].join("\n");

  await fetch("https://api.telegram.org/bot" + TOKEN + "/sendMessage", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT, text, parse_mode: "HTML" }),
  });

  return NextResponse.json({ ok: true });
}

// brand tokens — warm amber on near-black ink
export const theme = {
  accent: "#FF6B1A",
  accentHover: "#FF7C36",
  ink: "#050507",
  radius: { card: 28, pill: 999 },
  ship: "1–3 недели",
};

export function clamp(min, val, max) {
  return Math.max(min, Math.min(val, max));
}`;

const KEYWORDS = new Set([
  "import", "from", "export", "default", "function", "const", "let", "var",
  "return", "if", "else", "for", "while", "new", "await", "async", "void",
  "typeof", "null", "true", "false", "of", "in",
]);

type Tok = { c: string; v: string };

function tokenize(line: string): Tok[] {
  if (line.length === 0) return [{ c: "sp", v: " " }];
  const out: Tok[] = [];
  const re =
    /(\/\/.*$)|(`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?(?:px|ms|vh|vw|em|%)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\s])/g;
  let m: RegExpExecArray | null;
  let expectTag = false;
  while ((m = re.exec(line)) !== null) {
    if (m[1]) {
      out.push({ c: "t-com", v: m[1] });
      expectTag = false;
    } else if (m[2]) {
      out.push({ c: "t-str", v: m[2] });
      expectTag = false;
    } else if (m[3]) {
      out.push({ c: "t-num", v: m[3] });
      expectTag = false;
    } else if (m[4]) {
      const w = m[4];
      const after = line.slice(re.lastIndex).match(/^\s*\(/);
      if (KEYWORDS.has(w)) out.push({ c: "t-kw", v: w });
      else if (expectTag) out.push({ c: "t-tag", v: w });
      else if (/^[A-Z]/.test(w)) out.push({ c: "t-tag", v: w });
      else if (after) out.push({ c: "t-fn", v: w });
      else out.push({ c: "t-pln", v: w });
      expectTag = false;
    } else if (m[5]) {
      out.push({ c: "sp", v: m[5] });
    } else {
      const ch = m[6];
      out.push({ c: "t-pun", v: ch });
      if (ch === "<") expectTag = true;
      else if (ch !== "/") expectTag = false;
    }
  }
  return out;
}

const BASE = SOURCE.split("\n");

// Repeat the source enough to fill several full-height columns on any width,
// with continuous line numbers so it reads as one long file. overflow:hidden
// + column-fill:auto clip whatever doesn't fit, so coverage is guaranteed.
const LINES: string[] = [];
for (let r = 0; r < 3; r++) LINES.push(...BASE);

export function HeroCodeSurface() {
  return (
    <div className="hero-code" aria-hidden="true">
      <pre className="hero-code-pre">
        <code>
          {LINES.map((line, i) => (
            <span className="hcl" key={i}>
              <span className="hcl-n">{i + 1}</span>
              <span className="hcl-t">
                {tokenize(line).map((tok, j) =>
                  tok.c === "sp" ? (
                    tok.v
                  ) : (
                    <span className={tok.c} key={j}>
                      {tok.v}
                    </span>
                  )
                )}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
