"use client";

import { useTranslations } from "next-intl";
import {
  MarketingCaseHero,
  CardShell,
  CardHeader,
  GoogleG,
  GoogleGChip,
  RankBadge,
  Stars,
  CheckDot,
} from "@/components/CaseHeroKit";
import { BalticDockyardHeroMock } from "@/components/BalticDockyardHeroMock";

/* Baltic Dockyard case hero — the marketing cut. A B2B marine-parts supplier
   that was invisible online now gets found by procurement AND has quote
   requests land straight in its inbox. Proof cards: Google #1 → a 12,400-part
   bilingual catalog → a quote request hitting the corporate inbox. Keeps the
   real shipped-site screenshots in the device mock — the strongest B2B proof. */

const CYAN = "#33C4E8";
const CYAN_HI = "#8FDBF3";
const GREEN = "#34d17f";

type Proof = {
  googleLabel: string;
  googleQuery: string;
  googleRank: string;
  googleMeta: string;
  catalogLabel: string;
  catalogValue: string;
  catalogNote: string;
  inboxLabel: string;
  inboxFrom: string;
  inboxTopic: string;
  inboxWhen: string;
};

export function BalticCaseHero({ url, liveLabel }: { url: string; liveLabel: string }) {
  const t = useTranslations("work.caseShowcase.baltic.hero");
  const tm = useTranslations("work.caseMetrics");
  const metrics = tm.raw("baltic") as { value: string; label: string }[];
  const channels = t.raw("channels") as { seo: string; inbox: string };
  const proof = t.raw("proof") as Proof;

  return (
    <MarketingCaseHero
      accent={CYAN}
      accentHi={CYAN_HI}
      ink="#06232b"
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
            <span className="grid h-5 w-5 place-items-center rounded-full" style={{ background: "rgba(51,196,232,0.18)" }}>
              <MailMark className="h-3 w-3" color={CYAN_HI} />
            </span>
          ),
          label: channels.inbox,
        },
      ]}
      wantLabel={t("want")}
      deviceMock={<BalticDockyardHeroMock />}
      proofCards={[
        <GoogleCard key="g" proof={proof} />,
        <InboxCard key="i" proof={proof} />,
        <CatalogCard key="c" proof={proof} />,
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
        right={<RankBadge color={CYAN_HI} bg="rgba(51,196,232,0.18)">{proof.googleRank}</RankBadge>}
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
          baltic-dockyard.pl
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-white/55">
          <Stars className="h-2.5" color={CYAN_HI} />
          <span>{proof.googleMeta}</span>
        </div>
      </div>
    </CardShell>
  );
}

function CatalogCard({ proof }: { proof: Proof }) {
  return (
    <CardShell>
      <CardHeader
        glyph={
          <span className="grid h-5 w-5 place-items-center rounded-full" style={{ background: "rgba(51,196,232,0.16)" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={CYAN_HI} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="8" height="8" rx="1.5" />
              <rect x="13" y="4" width="8" height="8" rx="1.5" />
              <rect x="3" y="14" width="8" height="6" rx="1.5" />
              <rect x="13" y="14" width="8" height="6" rx="1.5" />
            </svg>
          </span>
        }
        label={proof.catalogLabel}
        right={<span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-semibold text-white/60">PL / EN</span>}
      />
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-1.5 rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-white/45">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span>part no. / OEM</span>
        </div>
        <div className="mt-2 font-semibold leading-tight" style={{ color: CYAN_HI }}>
          {proof.catalogValue}
        </div>
        <div className="mt-1 text-[11px] text-white/50">{proof.catalogNote}</div>
      </div>
    </CardShell>
  );
}

function InboxCard({ proof }: { proof: Proof }) {
  return (
    <CardShell>
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: "rgba(51,196,232,0.16)" }}>
          <MailMark className="h-4 w-4" color={CYAN_HI} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-semibold text-white">{proof.inboxLabel}</span>
            <span className="shrink-0 text-[10px] text-white/40">{proof.inboxWhen}</span>
          </div>
          <div className="mt-0.5 truncate text-[11.5px] text-white/60">{proof.inboxTopic}</div>
          <div className="truncate font-mono text-[10px] text-white/35">{proof.inboxFrom}</div>
        </div>
        <CheckDot color={GREEN} />
      </div>
    </CardShell>
  );
}

function MailMark({ className, color = "#fff" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}
