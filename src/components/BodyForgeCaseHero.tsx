"use client";

import { useTranslations } from "next-intl";
import {
  MarketingCaseHero,
  CardShell,
  CardHeader,
  AppleMark,
  Stars,
  CheckDot,
} from "@/components/CaseHeroKit";
import { BodyForgeHeroMock } from "@/components/BodyForgeHeroMock";

/* Body Forge app case hero — the marketing cut for the native iOS app. The
   pitch leads with the payoff: track sets in one tap, then a GPT-4o coach reads
   your numbers and returns a personal breakdown in ~10s. Proof cards: the App
   Store listing → the AI coach result → Apple Health rings. The device mock is
   the real app screen-recording. */

const LIME = "#C8FF00";
const LIME_HI = "#E2FF6B";
const GREEN = "#34d17f";

type Proof = {
  appName: string;
  appCategory: string;
  appAction: string;
  aiLabel: string;
  aiModel: string;
  aiResult: string;
  aiWhen: string;
  healthLabel: string;
  healthNote: string;
};

export function BodyForgeCaseHero({ url, liveLabel }: { url: string; liveLabel: string }) {
  const t = useTranslations("work.caseShowcase.bodyforge.pageHero");
  const tm = useTranslations("work.caseMetrics");
  const metrics = tm.raw("bodyforge") as { value: string; label: string }[];
  const channels = t.raw("channels") as { appstore: string; ai: string };
  const proof = t.raw("proof") as Proof;

  return (
    <MarketingCaseHero
      accent={LIME}
      accentHi={LIME_HI}
      ink="#182400"
      theme="mobile"
      url={url}
      displayHost="App Store"
      liveLabel={liveLabel}
      eyebrow={t("eyebrow")}
      titleTop={t("titleTop")}
      titleAccent={t("titleAccent")}
      subhead={t("subhead")}
      metrics={metrics}
      channels={[
        {
          icon: (
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white">
              <AppleMark className="h-3 w-3" color="#111" />
            </span>
          ),
          label: channels.appstore,
        },
        {
          icon: (
            <span className="grid h-5 w-5 place-items-center rounded-full" style={{ background: "rgba(200,255,0,0.16)" }}>
              <Sparkle className="h-3 w-3" color={LIME} />
            </span>
          ),
          label: channels.ai,
        },
      ]}
      wantLabel={t("want")}
      deviceMock={<BodyForgeHeroMock />}
      proofCards={[
        <AppStoreCard key="a" proof={proof} />,
        <AiCoachCard key="i" proof={proof} />,
        <HealthCard key="h" proof={proof} />,
      ]}
    />
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
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full" style={{ background: LIME }} title={proof.appAction} aria-label={proof.appAction}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0f1400" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v11M8 11l4 4 4-4M5 20h14" />
          </svg>
        </span>
      </div>
    </CardShell>
  );
}

function AiCoachCard({ proof }: { proof: Proof }) {
  return (
    <CardShell>
      <CardHeader
        glyph={
          <span className="grid h-5 w-5 place-items-center rounded-full" style={{ background: "rgba(200,255,0,0.16)" }}>
            <Sparkle className="h-3 w-3" color={LIME} />
          </span>
        }
        label={proof.aiLabel}
        right={<span className="text-[10px] text-white/45">{proof.aiModel}</span>}
      />
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-medium text-white">{proof.aiResult}</div>
          <div className="mt-0.5 text-[11px]" style={{ color: LIME_HI }}>{proof.aiWhen}</div>
        </div>
        <CheckDot color={GREEN} />
      </div>
    </CardShell>
  );
}

function HealthCard({ proof }: { proof: Proof }) {
  return (
    <CardShell>
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <Rings className="h-9 w-9 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-semibold text-white">{proof.healthLabel}</div>
          <div className="truncate text-[10.5px] text-white/45">{proof.healthNote}</div>
        </div>
        <CheckDot color={GREEN} />
      </div>
    </CardShell>
  );
}

function Rings({ className }: { className?: string }) {
  const ring = (r: number, color: string, dash: number) => (
    <circle
      cx="18"
      cy="18"
      r={r}
      fill="none"
      stroke={color}
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeDasharray={`${dash} ${2 * Math.PI * r}`}
      transform="rotate(-90 18 18)"
    />
  );
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
      <g opacity="0.18">
        <circle cx="18" cy="18" r="14" fill="none" stroke="#fa114f" strokeWidth="3.4" />
        <circle cx="18" cy="18" r="10" fill="none" stroke="#a6e22e" strokeWidth="3.4" />
        <circle cx="18" cy="18" r="6" fill="none" stroke="#1ad4fd" strokeWidth="3.4" />
      </g>
      {ring(14, "#fa114f", 2 * Math.PI * 14 * 0.78)}
      {ring(10, "#a6e22e", 2 * Math.PI * 10 * 0.66)}
      {ring(6, "#1ad4fd", 2 * Math.PI * 6 * 0.55)}
    </svg>
  );
}

function Sparkle({ className, color }: { className?: string; color: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={color} aria-hidden="true">
      <path d="M12 2c.4 3.6 2.4 5.6 6 6-3.6.4-5.6 2.4-6 6-.4-3.6-2.4-5.6-6-6 3.6-.4 5.6-2.4 6-6z" />
    </svg>
  );
}
