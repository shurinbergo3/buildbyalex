"use client";

import { useTranslations } from "next-intl";
import {
  MarketingCaseHero,
  CardShell,
  CardHeader,
  GoogleG,
  GoogleGChip,
  TelegramMark,
  RankBadge,
  Stars,
  CheckDot,
} from "@/components/CaseHeroKit";
import { VisionairHeroMock } from "@/components/VisionairHeroMock";

/* VisionAir case hero — the marketing cut. The pitch leads with the operator's
   killer win: a fast site that ranks across every filming vertical AND drops a
   fresh lead into Telegram within seconds, so nothing goes cold. Proof cards:
   Google #1 → sub-second Core Web Vitals → a lead landing in Telegram. */

const GOLD = "#CBA45C";
const GOLD_HI = "#E6CB87";
const TG = "#2AABEE";
const GREEN = "#34d17f";

type Proof = {
  googleLabel: string;
  googleQuery: string;
  googleRank: string;
  googleMeta: string;
  speedLabel: string;
  speedMetric: string;
  speedNote: string;
  leadLabel: string;
  leadTopic: string;
  leadWhen: string;
};

export function VisionairCaseHero({ url, liveLabel }: { url: string; liveLabel: string }) {
  const t = useTranslations("work.caseShowcase.visionair.hero");
  const metrics = t.raw("metrics") as { value: string; label: string }[];
  const channels = t.raw("channels") as { seo: string; telegram: string };
  const proof = t.raw("proof") as Proof;

  return (
    <MarketingCaseHero
      accent={GOLD}
      accentHi={GOLD_HI}
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
        { icon: <TelegramMark className="h-5 w-5" />, label: channels.telegram },
      ]}
      wantLabel={t("want")}
      deviceMock={<VisionairHeroMock url={url} />}
      proofCards={[
        <GoogleCard key="g" proof={proof} />,
        <SpeedCard key="s" proof={proof} />,
        <TelegramCard key="t" proof={proof} />,
      ]}
    />
  );
}

function GoogleCard({ proof }: { proof: Proof }) {
  return (
    <CardShell>
      <CardHeader
        glyph={<GoogleG className="h-3.5 w-3.5" />}
        label={proof.googleLabel}
        right={<RankBadge color={GOLD_HI} bg="rgba(203,164,92,0.18)">{proof.googleRank}</RankBadge>}
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
          visionair.biz.pl
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-white/55">
          <Stars className="h-2.5" color={GOLD_HI} />
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
          <span className="grid h-5 w-5 place-items-center rounded-full" style={{ background: `${GREEN}22` }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill={GREEN} aria-hidden="true">
              <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
            </svg>
          </span>
        }
        label={proof.speedLabel}
        right={
          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold" style={{ background: `${GREEN}22`, color: GREEN }}>
            100
          </span>
        }
      />
      <div className="px-3 py-2.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] uppercase tracking-[0.08em] text-white/45">LCP</span>
          <span className="font-mono text-[15px] font-semibold" style={{ color: GREEN }}>
            {proof.speedMetric}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <span className="block h-full w-[90%] rounded-full" style={{ background: `linear-gradient(90deg, ${GREEN}, #7be8ab)` }} />
        </div>
        <div className="mt-2 text-[11px] text-white/50">{proof.speedNote}</div>
      </div>
    </CardShell>
  );
}

function TelegramCard({ proof }: { proof: Proof }) {
  return (
    <CardShell>
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full">
          <TelegramMark className="h-8 w-8" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-semibold text-white">{proof.leadLabel}</span>
            <span className="shrink-0 text-[10px]" style={{ color: TG }}>
              {proof.leadWhen}
            </span>
          </div>
          <div className="mt-0.5 truncate text-[11.5px] text-white/60">{proof.leadTopic}</div>
        </div>
        <CheckDot color={GREEN} />
      </div>
    </CardShell>
  );
}
