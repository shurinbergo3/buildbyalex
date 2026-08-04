import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import fsp from "node:fs/promises";
import path from "node:path";
import { routing } from "@/i18n/routing";

export const runtime = "nodejs";
export const alt = "buildbyalex";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#FF7A2D";
const ICON_ACCENT = "#FF6B1A";

const loadFont = (file: string) => fsp.readFile(path.join(process.cwd(), "public/fonts", file));

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Backdrop syntax colours — deliberately near-invisible, the code reads as
// texture under the gradient, not as something you're meant to parse.
const K = "rgba(255,122,45,0.13)";
const T = "rgba(255,255,255,0.075)";
const S = "rgba(255,255,255,0.05)";
const F = "rgba(255,255,255,0.095)";

const CODE: [string, string][][] = [
  [["export async function ", K], ["handleLead", F], ["(lead: Lead) {", T]],
  [["  const intent = ", T], ["await ", K], ["classify", F], ["(lead.message);", T]],
  [["  if (intent === ", T], ['"quote"', S], [") {", T]],
  [["    await crm.", T], ["createDeal", F], ["({ ...lead, source: ", T], ['"site"', S], [" });", T]],
  [["    return ", K], ["reply", F], ["(lead, templates[lead.locale]);", T]],
  [["  }", T]],
  [["}", T]],
  [["", T]],
  [["export default function ", K], ["Hero", F], ["() {", T]],
  [["  const { t } = ", T], ["useTranslations", F], ["(", T], ['"home"', S], [");", T]],
  [["  return (", T]],
  [["    <section className=", T], ['"hero"', S], [">", T]],
  [["      <h1>{t(", T], ['"headline"', S], [")}</h1>", T]],
  [["      <CTA href=", T], ['"/contact"', S], [" />", T]],
  [["    </section>", T]],
  [["  );", T]],
  [["}", T]],
];

function CodeBackdrop() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        paddingTop: 22,
        paddingLeft: 46,
        fontFamily: "Geist Mono",
        fontSize: 25,
        overflow: "hidden",
      }}
    >
      {CODE.map((line, i) => (
        <div key={i} style={{ display: "flex", height: 38, alignItems: "center" }}>
          {line.map(([text, color], j) => (
            <div key={j} style={{ display: "flex", color, whiteSpace: "pre" }}>
              {text}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** The site favicon (src/app/icon.svg) redrawn at an arbitrary size. */
function Icon({ s }: { s: number }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: s,
        height: s,
        borderRadius: s * 0.22,
        background: "#0A0A0A",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: `0 ${Math.round(s * 0.12)}px ${Math.round(s * 0.5)}px rgba(0,0,0,0.85)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          borderRadius: s * 0.22,
          background:
            "radial-gradient(ellipse 72% 72% at 50% 14%, rgba(255,107,26,0.55), rgba(255,107,26,0.10) 55%, transparent 72%)",
        }}
      />
      <div
        style={{
          display: "flex",
          fontSize: s * 0.66,
          fontWeight: 600,
          color: "#FFFFFF",
          letterSpacing: "-0.04em",
          marginLeft: -s * 0.09,
          marginTop: -s * 0.02,
        }}
      >
        a
      </div>
      <div
        style={{
          position: "absolute",
          left: s * 0.658,
          top: s * 0.603,
          width: s * 0.1375,
          height: s * 0.1375,
          borderRadius: 999,
          background: ICON_ACCENT,
          display: "flex",
        }}
      />
    </div>
  );
}

function Wordmark({ size: fs }: { size: number }) {
  const dot = Math.round(fs * 0.155);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        fontSize: fs,
        fontWeight: 600,
        letterSpacing: "-0.045em",
      }}
    >
      <span style={{ color: "#FAFAFA" }}>build</span>
      <span style={{ color: "rgba(255,255,255,0.38)" }}>by</span>
      <span style={{ color: "#FAFAFA" }}>alex</span>
      <div
        style={{
          width: dot,
          height: dot,
          borderRadius: 999,
          background: ACCENT,
          marginLeft: -Math.round(fs * 0.025),
          marginBottom: Math.round(fs * 0.21),
          display: "flex",
        }}
      />
    </div>
  );
}

/**
 * Social card: the site's own code as a faint backdrop, a glass panel on top
 * carrying the favicon, the wordmark and what it builds. The panel keeps the
 * whole brand block inside the centre square that Google and Telegram crop to.
 */
export default async function OG({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (routing.locales as readonly string[]).includes(raw) ? raw : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "meta" });
  const services = t("ogServices");

  const [sans, semibold, mono] = await Promise.all([
    loadFont("Geist-Medium.ttf"),
    loadFont("Geist-SemiBold.ttf"),
    loadFont("GeistMono-Regular.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08080A",
          fontFamily: "Geist",
          position: "relative",
        }}
      >
        <CodeBackdrop />

        {/* gradient veil — darkest under the panel, lets the code breathe at the edges */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(ellipse 68% 76% at 50% 50%, rgba(8,8,10,0.77) 0%, rgba(8,8,10,0.66) 55%, rgba(8,8,10,0.40) 100%), linear-gradient(180deg, rgba(8,8,10,0.44) 0%, rgba(8,8,10,0.24) 40%, rgba(8,8,10,0.50) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(ellipse 50% 60% at 50% 44%, rgba(255,122,45,0.20), transparent 70%), radial-gradient(ellipse 90% 45% at 50% 114%, rgba(255,122,45,0.12), transparent 62%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 900,
            paddingTop: 58,
            paddingBottom: 58,
            paddingLeft: 40,
            paddingRight: 40,
            borderRadius: 40,
            background: "rgba(10,10,12,0.72)",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
          }}
        >
          <Icon s={96} />
          <div style={{ display: "flex", marginTop: 36 }}>
            <Wordmark size={92} />
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 25,
              fontWeight: 500,
              color: "rgba(255,255,255,0.62)",
              letterSpacing: "-0.01em",
            }}
          >
            {services}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: sans, weight: 500, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
