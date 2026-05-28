import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

const showcaseImages = [
  {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85",
    alt: "Analytics dashboard with charts",
    span: "md:col-span-7 md:row-span-2",
    aspect: "aspect-[16/11] md:aspect-auto md:h-full",
    tint: "from-[#0A1230]/30 via-transparent to-[#0A1230]/10",
  },
  {
    src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=85",
    alt: "Mobile app interface in hand",
    span: "md:col-span-5",
    aspect: "aspect-[4/3]",
    tint: "from-[#1F0A30]/20 via-transparent to-[#1F0A30]/10",
  },
  {
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=85",
    alt: "Code editor on a clean desk",
    span: "md:col-span-5",
    aspect: "aspect-[4/3]",
    tint: "from-[#301A0A]/25 via-transparent to-[#301A0A]/10",
  },
];

export function Hero() {
  const t = useTranslations("home.hero");
  const headlineLines = t("headline").split("\n");
  const last = headlineLines.length - 1;

  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="hero-bg" aria-hidden="true" />
      <Container size="default" className="relative z-10">
        <div className="mx-auto max-w-[920px] text-center">
          <p
            className="t-eyebrow animate-[fadeUp_700ms_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: "60ms" }}
          >
            {t("eyebrow")}
          </p>

          <h1 className="mt-5 t-hero animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]" style={{ animationDelay: "160ms" }}>
            {headlineLines.map((line, i) => (
              <span key={i} className="block">
                {i === last ? <span className="hl-accent">{line}</span> : line}
              </span>
            ))}
          </h1>

          <p
            className="mx-auto mt-6 max-w-[640px] text-[clamp(17px,1.4vw+13px,22px)] leading-[1.45] tracking-[-0.013em] text-[color:var(--color-text-2)] animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: "260ms" }}
          >
            {t("subhead")}
          </p>

          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: "380ms" }}
          >
            <Button href="/contact" size="lg">
              {t("primaryCta")}
            </Button>
            <Button href="/work" variant="ghost" size="lg">
              {t("secondaryCta")}
            </Button>
          </div>

          <p
            className="mt-12 text-[13px] tracking-[0.04em] text-[color:var(--color-text-3)] animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: "500ms" }}
          >
            {t("trustLine")}
          </p>
        </div>

        <div
          className="mt-16 md:mt-24 animate-[fadeUp_1100ms_cubic-bezier(0.16,1,0.3,1)_both]"
          style={{ animationDelay: "640ms" }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:auto-rows-[180px] md:gap-5">
            {showcaseImages.map((img, i) => (
              <div
                key={img.src}
                className={`group relative overflow-hidden rounded-[24px] md:rounded-[28px] ${img.span} ${img.aspect}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-tr ${img.tint}`}
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-0 rounded-[24px] md:rounded-[28px] ring-1 ring-inset ring-white/10"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*='animate-'] { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
}
