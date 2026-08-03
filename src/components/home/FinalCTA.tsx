import { useTranslations } from "next-intl";
import { FinalCta } from "@/components/FinalCta";
import { TELEGRAM_URL } from "@/lib/contacts";

type Step = { k: string; v: string };

export function FinalCTA({ reviewCount }: { reviewCount: number }) {
  const t = useTranslations("home.finalCta");
  const tl = useTranslations("work.caseLabels");
  const tr = useTranslations("home.testimonials");

  return (
    <FinalCta
      theme="studio"
      eyebrow={t("eyebrow")}
      title={t("headline")}
      body={t("subhead")}
      steps={tl.raw("ctaSteps") as Step[]}
      available={tl("ctaAvailable")}
      primary={{ label: t("primaryCta"), href: "/contact" }}
      secondary={{ label: t("telegramCta"), href: TELEGRAM_URL, kind: "external" }}
      tertiary={{ label: t("email"), href: `mailto:${t("email")}` }}
      rating={{ value: tr("rating"), count: `${reviewCount} ${tr("count")}` }}
    />
  );
}
