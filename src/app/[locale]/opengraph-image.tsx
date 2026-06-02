import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const runtime = "edge";
export const alt = "buildbyalex";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0A0A0A";
const ACCENT = "#FF7A2D";

// Faint code lines behind the headline — echoes the live hero's code surface.
const CODE_LINES = [
  'import { Container } from "@/components/Container";',
  "",
  "// one person — from the first call to release",
  "export function Hero() {",
  '  const t = useTranslations("home.hero");',
  "",
  "  return (",
  '    <section className="hero-scroll">',
  '      <h1 className="t-hero">',
  "        Websites, AI agents & mobile apps.",
  '        <span className="hl-accent">In 1–3 weeks.</span>',
  "      </h1>",
  "    </section>",
  "  );",
  "}",
];

export default async function OG({ params }: { params: { locale: string } }) {
  const locale = (routing.locales as readonly string[]).includes(params.locale)
    ? params.locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "home.hero" });
  const eyebrow = t("eyebrow");
  const headlineLines = t("headline").split("\n");
  const last = headlineLines.length - 1;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "72px 80px",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* warm radial glow, top-left — matches the hero */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 12% 4%, rgba(255, 122, 45, 0.30), transparent 60%), radial-gradient(ellipse 50% 50% at 92% 96%, rgba(255, 122, 45, 0.12), transparent 60%)",
            display: "flex",
          }}
        />

        {/* faint code surface */}
        <div
          style={{
            position: "absolute",
            top: 150,
            left: 70,
            right: 0,
            display: "flex",
            flexDirection: "column",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 22,
            lineHeight: 1.7,
            letterSpacing: "-0.01em",
            color: "rgba(255,255,255,0.05)",
          }}
        >
          {CODE_LINES.map((line, i) => (
            <div key={i} style={{ display: "flex" }}>
              {line || " "}
            </div>
          ))}
        </div>

        {/* big brand logo, top-left */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            fontWeight: 600,
            fontSize: 56,
            letterSpacing: "-0.022em",
            color: "#FFFFFF",
            zIndex: 1,
          }}
        >
          <span>build</span>
          <span style={{ color: "rgba(255,255,255,0.42)" }}>by</span>
          <span style={{ color: ACCENT }}>alex</span>
          <div
            style={{
              width: 13,
              height: 13,
              borderRadius: 999,
              background: ACCENT,
              marginLeft: 8,
              marginBottom: 11,
            }}
          />
        </div>

        {/* headline + eyebrow */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22, zIndex: 1 }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: ACCENT,
              display: "flex",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 600,
              letterSpacing: "-0.035em",
              lineHeight: 1.04,
              color: "#FFFFFF",
              maxWidth: "1000px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {headlineLines.map((line, i) => (
              <span
                key={i}
                style={{ display: "flex", color: i === last ? ACCENT : "#FFFFFF" }}
              >
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
