"use client";

import { useTranslations } from "next-intl";
import {
  MarketingCaseHero,
  CardShell,
  CardHeader,
  GoogleG,
  GoogleGChip,
  AppleMark,
  RankBadge,
  Stars,
} from "@/components/CaseHeroKit";
import { BodyForgeSiteHeroMock } from "@/components/BodyForgeSiteHeroMock";

/* Body Forge landing case hero — the marketing cut. The app had only an App
   Store page; this landing gives its traffic a home that loads instantly, ranks
   in search, and funnels every visitor to one place. Proof cards: Google #1 →
   sub-second Core Web Vitals → the App Store install. Keeps the real shipped
   RU/EN site screenshots in the device mock. */

const LIME = "#C8FF00";
const LIME_HI = "#E2FF6B";

type Proof = {
  googleQuery: string;
  googleRank: string;
  googleMeta: string;
  speedLabel: string;
  speedMetric: string;
  speedNote: string;
  appName: string;
  appCategory: string;
  appAction: string;
  appMeta: string;
};

export function BodyForgeSiteCaseHero({
  url,
  liveLabel,
  locale,
}: {
  url: string;
  liveLabel: string;
  locale: string;
}) {
  const t = useTranslations("work.caseShowcase.bodyforgesite.hero");
  const tm = useTranslations("work.caseMetrics");
  const metrics = tm.raw("bodyforgesite") as { value: string; label: string }[];
  const channels = t.raw("channels") as { seo: string; appstore: string };
  const proof = t.raw("proof") as Proof;

  return (
    <MarketingCaseHero
      accent={LIME}
      accentHi={LIME_HI}
      ink="#182400"
      theme="web"
      url={url}
      liveLabel={liveLabel}
      eyebrow={t("eyebrow")}
      titleTop={t("titleTop")}
      titleAccent={t("titleAccent")}
      subhead={t("subhead")}
      metrics={metrics}
      channels={[
        { icon: <GoogleGChip />, label: channels.seo },
        {
          icon: (
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white">
              <AppleMark className="h-3 w-3" color="#111" />
            </span>
          ),
          label: channels.appstore,
        },
      ]}
      wantLabel={t("want")}
      deviceMock={<BodyForgeSiteHeroMock locale={locale} />}
      proofCards={[
        <GoogleCard key="g" proof={proof} />,
        <SpeedCard key="s" proof={proof} />,
        <AppStoreCard key="a" proof={proof} />,
      ]}
    />
  );
}

function GoogleCard({ proof }: { proof: Proof }) {
  return (
    <CardShell>
      <CardHeader
        glyph={<GoogleG className="h-3.5 w-3.5" />}
        label="Google"
        right={<RankBadge color="#0f1400" bg={LIME}>{proof.googleRank}</RankBadge>}
      />
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-1.5 rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-white/60">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="truncate">{proof.googleQuery}</span>
        </div>
        <div className="mt-2 text-[12px] font-medium leading-tight" style={{ color: "#8ab4f8" }}>
          bodyforges.com
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-white/55">
          <Stars className="h-2.5" color={LIME_HI} />
          <span>{proof.googleMeta}</span>
        </div>
      </div>
    </CardShell>
  );
}

function SpeedCard({ proof }: { proof: Proof }) {
  return (
    <CardShell>
      <CardHeader
        glyph={
          <span className="grid h-5 w-5 place-items-center rounded-full" style={{ background: "rgba(200,255,0,0.16)" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill={LIME} aria-hidden="true">
              <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
            </svg>
          </span>
        }
        label={proof.speedLabel}
        right={<RankBadge color="#0f1400" bg={LIME}>100</RankBadge>}
      />
      <div className="px-3 py-2.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] uppercase tracking-[0.08em] text-white/45">FCP</span>
          <span className="font-mono text-[15px] font-semibold" style={{ color: LIME }}>
            {proof.speedMetric}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <span className="block h-full w-[92%] rounded-full" style={{ background: `linear-gradient(90deg, ${LIME}, ${LIME_HI})` }} />
        </div>
        <div className="mt-2 text-[11px] text-white/50">{proof.speedNote}</div>
      </div>
    </CardShell>
  );
}

function AppStoreCard({ proof }: { proof: Proof }) {
  return (
    <CardShell>
      <CardHeader
        glyph={<AppleMark className="h-3.5 w-3.5" color="rgba(255,255,255,0.7)" />}
        label="App Store"
        right={
          <span className="inline-flex items-center gap-1 text-[10px] text-white/55">
            <Stars className="h-2.5" color={LIME_HI} />
            4.9
          </span>
        }
      />
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px]" style={{ background: `linear-gradient(135deg, ${LIME}, #9ac400)` }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6.5 9v6M17.5 9v6M4 10.5v3M20 10.5v3M6.5 12h11" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-semibold leading-tight text-white">{proof.appName}</div>
          <div className="truncate text-[10.5px] text-white/45">{proof.appCategory}</div>
        </div>
        <span
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full"
          style={{ background: LIME }}
          title={proof.appAction}
          aria-label={proof.appAction}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0f1400" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v11M8 11l4 4 4-4M5 20h14" />
          </svg>
        </span>
      </div>
    </CardShell>
  );
}
