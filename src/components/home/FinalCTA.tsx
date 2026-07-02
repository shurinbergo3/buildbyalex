import { useTranslations } from "next-intl";
import { FinalCta } from "@/components/FinalCta";

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
      secondary={{ label: t("email"), href: `mailto:${t("email")}`, kind: "link" }}
      rating={{ value: tr("rating"), count: `${reviewCount} ${tr("count")}` }}
    />
  );
}
