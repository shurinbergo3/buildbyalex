import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <Container size="sm" className="py-24 text-center md:py-36">
      <p className="font-mono text-[12px] tracking-[0.08em] text-[color:var(--color-text-3)]">{t("code")}</p>
      <h1 className="mt-4 t-h1">{t("headline")}</h1>
      <p className="mt-5 t-body-lg">{t("lead")}</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button href="/">{t("home")}</Button>
        <Button href="/blog" variant="ghost">{t("blog")}</Button>
      </div>
    </Container>
  );
}
