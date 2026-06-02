import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

export function Numbers() {
  const t = useTranslations("home.numbers");
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <Section tone="ink" pad="default">
      <Container>
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="flex flex-col gap-3">
                <span className="text-[clamp(44px,5vw,72px)] font-semibold leading-none tracking-[-0.035em] text-white">
                  {s.value}
                </span>
                <span className="text-[14px] leading-[1.4] text-white/55">
                  {s.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
