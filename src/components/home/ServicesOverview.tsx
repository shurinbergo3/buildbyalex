import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

type Item = {
  key: "websites" | "ai" | "mobile";
  href: "/services/websites" | "/services/ai-agents" | "/services/mobile-apps";
  tint: string;
  image: string;
  imageAlt: string;
  glyph: React.ReactNode;
};

const items: Item[] = [
  {
    key: "websites",
    href: "/services/websites",
    tint: "from-[#FFE7D4]/85 to-[#FFD3AC]/80",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Code on a laptop screen — websites service",
    glyph: (
      <svg viewBox="0 0 80 80" fill="none" className="h-full w-full">
        <rect x="10" y="14" width="60" height="42" rx="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 24h60" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="19" r="1" fill="currentColor" />
        <circle cx="20" cy="19" r="1" fill="currentColor" />
        <circle cx="24" cy="19" r="1" fill="currentColor" />
        <path d="M20 34h28M20 40h36M20 46h24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="20" y="58" width="22" height="6" rx="3" fill="currentColor" opacity="0.85" />
      </svg>
    ),
  },
  {
    key: "ai",
    href: "/services/ai-agents",
    tint: "from-[#E4EAFF]/85 to-[#C6D2FF]/80",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Abstract neural network illustration — AI agents service",
    glyph: (
      <svg viewBox="0 0 80 80" fill="none" className="h-full w-full">
        <circle cx="40" cy="40" r="22" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="40" cy="40" r="3.5" fill="currentColor" />
        <path d="M40 18v6M40 56v6M18 40h6M56 40h6M24 24l4 4M52 52l4 4M24 56l4-4M52 28l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "mobile",
    href: "/services/mobile-apps",
    tint: "from-[#E2F2EA]/85 to-[#BFE3CF]/80",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "iPhone in hand — mobile apps service",
    glyph: (
      <svg viewBox="0 0 80 80" fill="none" className="h-full w-full">
        <rect x="26" y="10" width="28" height="60" rx="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M36 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="32" y="22" width="16" height="22" rx="2" fill="currentColor" opacity="0.85" />
        <circle cx="40" cy="62" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export function ServicesOverview() {
  const t = useTranslations("home.services");
  return (
    <Section tone="alt" pad="default" id="services">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
            <p className="mt-5 t-body-lg">{t("subhead")}</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.key} delay={i * 90}>
              <Link
                href={item.href}
                className="group block h-full"
              >
                <article className="flex h-full flex-col overflow-hidden rounded-[28px] bg-[color:var(--color-bg-elev)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
                  <div className="relative aspect-[16/10] overflow-hidden p-8">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${item.tint} mix-blend-multiply`}
                      aria-hidden="true"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-transparent"
                      aria-hidden="true"
                    />
                    <div className="relative grid h-full place-items-center text-[color:var(--c-text)] opacity-80 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
                      <div className="h-32 w-32 md:h-40 md:w-40">{item.glyph}</div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-7">
                    <h3 className="t-h3">{t(`items.${item.key}.title`)}</h3>
                    <p className="text-[15.5px] leading-[1.5] text-[color:var(--color-text-2)]">
                      {t(`items.${item.key}.body`)}
                    </p>
                    <p className="text-[12px] tracking-[0.02em] text-[color:var(--color-text-3)] mt-auto pt-2">
                      {t(`items.${item.key}.stack`)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[14px] font-medium text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                      {t(`items.${item.key}.link`)}
                      <svg width="14" height="14" viewBox="0 0 14 14" className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
                        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </span>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
