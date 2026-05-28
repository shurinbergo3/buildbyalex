import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const runtime = "edge";
export const alt = "buildbyalex";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({ params }: { params: { locale: string } }) {
  const locale = (routing.locales as readonly string[]).includes(params.locale)
    ? params.locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("defaultTitle");
  const trust = "Warsaw · RU · EN · PL · UA";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FBFBFD",
          padding: "80px",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse 60% 50% at 15% 10%, rgba(255, 107, 26, 0.18), transparent 60%), radial-gradient(ellipse 40% 40% at 90% 90%, rgba(255, 107, 26, 0.10), transparent 60%)",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontWeight: 600,
            fontSize: 36,
            letterSpacing: "-0.022em",
            color: "#0A0A0A",
            zIndex: 1,
          }}
        >
          <span>build</span>
          <span style={{ opacity: 0.4 }}>by</span>
          <span style={{ color: "#FF6B1A" }}>alex</span>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#FF6B1A",
              marginLeft: 6,
              alignSelf: "flex-end",
              marginBottom: 6,
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, zIndex: 1 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              color: "#0A0A0A",
              maxWidth: "1040px",
              display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#5C5C60",
              letterSpacing: "0.04em",
              display: "flex",
            }}
          >
            {trust}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
