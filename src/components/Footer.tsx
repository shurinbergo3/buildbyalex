import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Container } from "./Container";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden border-t border-[color:var(--c-hairline)] bg-[color:var(--color-bg)] pt-16 md:pt-20">
      <Container className="relative z-10">
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-12 md:gap-y-0">
          <div className="col-span-2 md:col-span-4">
            <Link href="/" aria-label="buildbyalex — home" className="inline-block">
              <Logo size={30} />
            </Link>
            <p className="mt-5 max-w-[34ch] text-[15px] leading-[1.5] text-[color:var(--color-text-2)]">
              {t("tagline")}
            </p>
            <p className="mt-6 text-[13px] text-[color:var(--color-text-3)]">{t("location")}</p>
          </div>

          <div className="col-span-1 md:col-span-2 md:col-start-6">
            <h4 className="t-eyebrow mb-4 text-[11px]">{t("sections.explore")}</h4>
            <ul className="space-y-2.5 text-[14px] text-[color:var(--color-text-2)]">
              <li><Link href="/work" className="hover:text-[color:var(--color-text)] transition-colors">{nav("work")}</Link></li>
              <li><Link href="/about" className="hover:text-[color:var(--color-text)] transition-colors">{nav("about")}</Link></li>
              <li><Link href="/blog" className="hover:text-[color:var(--color-text)] transition-colors">{nav("blog")}</Link></li>
              <li><Link href="/contact" className="hover:text-[color:var(--color-text)] transition-colors">{nav("contact")}</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="t-eyebrow mb-4 text-[11px]">{t("sections.services")}</h4>
            <ul className="space-y-2.5 text-[14px] text-[color:var(--color-text-2)]">
              <li><Link href="/services/websites" className="hover:text-[color:var(--color-text)] transition-colors">{t("links.websites")}</Link></li>
              <li><Link href="/services/ai-agents" className="hover:text-[color:var(--color-text)] transition-colors">{t("links.aiAgents")}</Link></li>
              <li><Link href="/services/mobile-apps" className="hover:text-[color:var(--color-text)] transition-colors">{t("links.mobileApps")}</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3">
            <h4 className="t-eyebrow mb-4 text-[11px]">{t("sections.contact")}</h4>
            <ul className="space-y-2.5 text-[14px] text-[color:var(--color-text-2)]">
              <li><a href="mailto:alex@buildbyalex.com" className="hover:text-[color:var(--color-text)] transition-colors">alex@buildbyalex.com</a></li>
              <li><a href="https://t.me/sumotry" target="_blank" rel="noreferrer noopener" className="hover:text-[color:var(--color-text)] transition-colors">{t("links.telegram")} @sumotry</a></li>
              <li><a href="https://wa.me/48453474944" target="_blank" rel="noreferrer noopener" className="hover:text-[color:var(--color-text)] transition-colors">WhatsApp</a></li>
              <li><a href="tel:+48453474944" className="hover:text-[color:var(--color-text)] transition-colors">+48 453 474 944</a></li>
              <li><a href="https://www.linkedin.com/in/oleksandr-shuvalov" target="_blank" rel="noreferrer noopener" className="hover:text-[color:var(--color-text)] transition-colors">{t("links.linkedin")}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse gap-6 border-t border-[color:var(--c-hairline)] pt-6 pb-[clamp(56px,9vw,128px)] md:flex-row md:items-center md:justify-between">
          <p className="text-[12px] text-[color:var(--color-text-3)]">
            © {year} Oleksandr Shuvalov. {t("rights")} <span className="mx-1 opacity-50">·</span> {t("legal")}
          </p>
          <LocaleSwitcher />
        </div>
      </Container>

      {/* Oversized brand wordmark, clipped by the footer's bottom edge — the apple.com
          "typography is the brand" move. Faint, fading in from the top, purely decorative. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-[0.16em] z-0 select-none overflow-hidden"
      >
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
          <Logo
            size="clamp(88px, 17vw, 248px)"
            showDot={false}
            className="block whitespace-nowrap opacity-[0.06] [mask-image:linear-gradient(to_bottom,transparent_8%,#000_64%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_8%,#000_64%)]"
          />
        </div>
      </div>
    </footer>
  );
}
