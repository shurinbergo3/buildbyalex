import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const runtime = "edge";
export const alt = "buildbyalex";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT = "#FF7A2D";
const WINDOW = "#0A0A0B";

/**
 * Social card = a snapshot of the live hero (screenshot 2): a dark browser
 * window — traffic lights, the buildbyalex.com URL and a Live · Worldwide badge —
 * framing the wordmark, with the core services spelled out underneath. No name,
 * just the brand and what it builds.
 */
export default async function OG({ params }: { params: { locale: string } }) {
  const locale = (routing.locales as readonly string[]).includes(params.locale)
    ? params.locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "meta" });
  const services = t("ogServices");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F2F0EB",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* warm page glow behind the window */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 55% at 50% 6%, rgba(255,122,45,0.16), transparent 60%), radial-gradient(ellipse 70% 60% at 50% 110%, rgba(255,122,45,0.10), transparent 60%)",
            display: "flex",
          }}
        />

        {/* the browser window */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: 1040,
            height: 470,
            borderRadius: 26,
            background: WINDOW,
            boxShadow: "0 50px 110px rgba(24,22,28,0.30)",
            overflow: "hidden",
          }}
        >
          {/* chrome bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 58,
              paddingLeft: 24,
              paddingRight: 22,
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", gap: 9 }}>
              <div style={{ width: 13, height: 13, borderRadius: 999, background: "#FF5F57", display: "flex" }} />
              <div style={{ width: 13, height: 13, borderRadius: 999, background: "#FEBC2E", display: "flex" }} />
              <div style={{ width: 13, height: 13, borderRadius: 999, background: "#28C840", display: "flex" }} />
            </div>
            <div
              style={{
                display: "flex",
                marginLeft: 22,
                fontSize: 20,
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "-0.01em",
              }}
            >
              buildbyalex.com
            </div>

            {/* Live · Worldwide badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginLeft: "auto",
                paddingTop: 9,
                paddingBottom: 9,
                paddingLeft: 15,
                paddingRight: 17,
                borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div style={{ width: 9, height: 9, borderRadius: 999, background: "#3FCF6E", display: "flex" }} />
              <div style={{ display: "flex", fontSize: 18, color: "rgba(255,255,255,0.78)", fontWeight: 500 }}>
                Live · Worldwide
              </div>
            </div>
          </div>

          {/* window body: wordmark + services */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                fontWeight: 600,
                fontSize: 130,
                letterSpacing: "-0.04em",
              }}
            >
              <span style={{ color: "#F4F4F4" }}>build</span>
              <span style={{ color: "rgba(255,255,255,0.40)" }}>by</span>
              <span style={{ color: "#F4F4F4" }}>alex</span>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  background: ACCENT,
                  marginLeft: 14,
                  marginBottom: 18,
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 30,
                fontSize: 25,
                fontWeight: 500,
                letterSpacing: "0.005em",
                color: "rgba(255,255,255,0.56)",
              }}
            >
              {services}
            </div>

            {/* a. app tile, bottom-right */}
            <div
              style={{
                position: "absolute",
                right: 26,
                bottom: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: 15,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-end", fontWeight: 600, fontSize: 30, color: "#F4F4F4" }}>
                a
                <div
                  style={{ width: 7, height: 7, borderRadius: 999, background: ACCENT, marginLeft: 2, marginBottom: 6 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
