"use client";

import { useTranslations } from "next-intl";
import {
  MarketingCaseHero,
  CardShell,
  CardHeader,
  GoogleGChip,
  ChatGptLogo,
  RankBadge,
  Stars,
  CheckDot,
} from "@/components/CaseHeroKit";
import { LegalwinHeroMock } from "@/components/LegalwinHeroMock";

/* LegalWin case hero — the marketing cut, on the shared CaseHeroKit. The pitch
   leads with the one thing no other case can claim: the site is found in *both*
   classic Google and ChatGPT, worldwide, turning organic discovery into daily
   leads at zero ad spend. Proof cards dramatise that funnel: Google #1 →
   ChatGPT names it → a live lead lands. */

const ACCENT = "#FF7A2D";
const ACCENT_HI = "#FFB386";
const GREEN = "#34d17f";

type Proof = {
  googleLabel: string;
  googleQuery: string;
  googleRank: string;
  googleMeta: string;
  chatgptLabel: string;
  chatgptQuote: string;
  chatgptMeta: string;
  leadLabel: string;
  leadTopic: string;
  leadWhen: string;
};

export function LegalwinCaseHero({ url, liveLabel }: { url: string; liveLabel: string }) {
  const t = useTranslations("work.caseShowcase.legalwin.hero");
  const tShow = useTranslations("home.legalwinShowcase");
  const metrics = tShow.raw("metrics") as { value: string; label: string }[];
  const channels = t.raw("channels") as { google: string; chatgpt: string };
  const proof = t.raw("proof") as Proof;

  return (
    <MarketingCaseHero
      accent={ACCENT}
      accentHi={ACCENT_HI}
      theme="web"
      url={url}
      liveLabel={liveLabel}
      eyebrow={t("eyebrow")}
      titleTop={t("titleTop")}
      titleAccent={t("titleAccent")}
      subhead={t("subhead")}
      metrics={metrics}
      channels={[
        { icon: <GoogleGChip />, label: channels.google },
        { icon: <ChatGptLogo className="h-5 w-5 rounded-[5px]" />, label: channels.chatgpt },
      ]}
      wantLabel={t("want")}
      deviceMock={<LegalwinHeroMock />}
      proofCards={[
        <GoogleCard key="g" proof={proof} />,
        <ChatGptCard key="c" proof={proof} />,
        <LeadCard key="l" proof={proof} />,
      ]}
    />
  );
}

function GoogleCard({ proof }: { proof: Proof }) {
  return (
    <CardShell>
      <CardHeader
        glyph={<GoogleGChip className="h-4 w-4" />}
        label={proof.googleLabel}
        right={<RankBadge color={ACCENT_HI} bg="rgba(255,122,45,0.16)">{proof.googleRank}</RankBadge>}
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
          legalwin.pl
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-white/55">
          <Stars className="h-2.5" />
          <span>{proof.googleMeta}</span>
        </div>
      </div>
    </CardShell>
  );
}

function ChatGptCard({ proof }: { proof: Proof }) {
  return (
    <CardShell>
      <CardHeader
        glyph={<ChatGptLogo className="h-5 w-5 rounded-[5px]" />}
        label={proof.chatgptLabel}
        right={
          <span className="inline-flex items-center gap-1 text-[10px] text-white/45">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            GPT-5
          </span>
        }
      />
      <div className="px-3 py-2.5">
        <p className="text-[12.5px] leading-[1.45] text-white/85">
          <ChatGptSplit quote={proof.chatgptQuote} />
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 text-[11px]">
          <span style={{ color: "#8ab4f8" }}>legalwin.pl</span>
          <span className="text-white/30">·</span>
          <span className="inline-flex items-center gap-1 text-white/55">
            <Stars className="h-2.5" />
            4.9
          </span>
        </div>
      </div>
    </CardShell>
  );
}

/* Bolds the LegalWin brand token inside the AI quote, whatever the locale. */
function ChatGptSplit({ quote }: { quote: string }) {
  const idx = quote.indexOf("LegalWin");
  if (idx === -1) return <>{quote}</>;
  return (
    <>
      {quote.slice(0, idx)}
      <strong className="font-semibold text-white">LegalWin</strong>
      {quote.slice(idx + "LegalWin".length)}
    </>
  );
}

function LeadCard({ proof }: { proof: Proof }) {
  return (
    <CardShell>
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#FFB386] to-[#FF7A2D] text-[13px] font-bold text-[#1a1206]">
          LW
          <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#11131a] text-[8px]">
            🇺🇦
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-semibold text-white">{proof.leadLabel}</span>
            <span className="shrink-0 text-[10px] text-white/40">{proof.leadWhen}</span>
          </div>
          <div className="mt-0.5 truncate text-[11.5px] text-white/55">{proof.leadTopic}</div>
        </div>
        <CheckDot color={GREEN} />
      </div>
    </CardShell>
  );
}
