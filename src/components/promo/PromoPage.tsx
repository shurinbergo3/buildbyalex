import "./promo.css";
import { useTranslations } from "next-intl";
import { QuoteForm } from "@/components/QuoteForm";
import { FinalCTA } from "@/components/home/FinalCTA";
import { PromoFilm } from "./PromoFilm";
import type { ChapterId } from "./film";
import {
  AgentLayer,
  AutoLayer,
  CrmLayer,
  HeroLayer,
  MorningLayer,
  SearchLayer,
  SiteLayer,
} from "./layers";
import { PromoFaq, PromoFit, PromoProcess, PromoReviews, PromoServices, PromoWork } from "./sections";

const NAV: Exclude<ChapterId, "hero">[] = ["search", "site", "agent", "crm", "auto", "morning"];

export function PromoPage({ reviewCount, now }: { reviewCount: number; now: number }) {
  const t = useTranslations("promo");

  return (
    <div className="promo-root">
      <PromoFilm
        layers={{
          hero: <HeroLayer reviewCount={reviewCount} />,
          search: <SearchLayer />,
          site: <SiteLayer />,
          agent: <AgentLayer />,
          crm: <CrmLayer />,
          auto: <AutoLayer />,
          morning: <MorningLayer />,
        }}
        nav={NAV.map((id) => ({ id, label: t(`nav.${id}`) }))}
        navLabel={t("nav.label")}
        clockLabels={{ night: t("clock.night"), morning: t("clock.morning"), now: t("clock.now") }}
      />
      <PromoWork />
      <PromoServices />
      <PromoProcess />
      <PromoFit />
      <PromoReviews now={now} reviewCount={reviewCount} />
      <PromoFaq />
      <QuoteForm />
      <FinalCTA reviewCount={reviewCount} />
    </div>
  );
}
