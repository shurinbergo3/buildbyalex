import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PHONE_HREF, WHATSAPP_URL, formatPhone } from "@/lib/contacts";
import { Logo } from "./Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Container } from "./Container";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden border-t border-[color:var(--c-hairline)] bg-[color:var(--color-bg)] pt-16 pb-28 md:pt-20 md:pb-36">
      <Container className="relative z-10">
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-12 md:gap-y-0">
          <div className="col-span-2 md:col-span-3">
            <Link href="/" aria-label="buildbyalex — home" className="inline-block">
              <Logo size={30} />
            </Link>
            <p className="mt-5 max-w-[34ch] text-[15px] leading-[1.5] text-[color:var(--color-text-2)]">
              {t("tagline")}
            </p>
            <p className="mt-6 text-[13px] text-[color:var(--color-text-3)]">{t("location")}</p>
          </div>

          <div className="col-span-1 md:col-span-2 md:col-start-4">
            <h4 className="t-eyebrow mb-4 text-[11px]">{t("sections.explore")}</h4>
            <ul className="space-y-2.5 text-[14px] text-[color:var(--color-text-2)]">
              <li><Link href="/work" className="hover:text-[color:var(--color-text)] transition-colors">{nav("work")}</Link></li>
              <li><Link href="/pricing" className="hover:text-[color:var(--color-text)] transition-colors">{nav("pricing")}</Link></li>
              <li><Link href="/blog" className="hover:text-[color:var(--color-text)] transition-colors">{nav("blog")}</Link></li>
              <li><Link href="/contact" className="hover:text-[color:var(--color-text)] transition-colors">{nav("contact")}</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="t-eyebrow mb-4 text-[11px]">{t("sections.services")}</h4>
            <ul className="space-y-2.5 text-[14px] text-[color:var(--color-text-2)]">
              <li><Link href="/services/websites" className="hover:text-[color:var(--color-text)] transition-colors">{t("links.websites")}</Link></li>
              <li><Link href="/services/online-store" className="hover:text-[color:var(--color-text)] transition-colors">{t("links.onlineStore")}</Link></li>
              <li><Link href="/services/ai-agents" className="hover:text-[color:var(--color-text)] transition-colors">{t("links.aiAgents")}</Link></li>
              <li><Link href="/services/automation" className="hover:text-[color:var(--color-text)] transition-colors">{t("links.automation")}</Link></li>
              <li><Link href="/services/mobile-apps" className="hover:text-[color:var(--color-text)] transition-colors">{t("links.mobileApps")}</Link></li>
              <li><Link href="/services/telegram-bots" className="hover:text-[color:var(--color-text)] transition-colors">{nav("servicesMenu.telegram.title")}</Link></li>
              <li><Link href="/services/advertising" className="hover:text-[color:var(--color-text)] transition-colors">{t("links.advertising")}</Link></li>
            </ul>

            <h4 className="t-eyebrow mb-4 mt-8 text-[11px]">{nav("servicesMenu.offersLabel")}</h4>
            <ul className="space-y-2.5 text-[14px] text-[color:var(--color-text-2)]">
              <li><Link href="/services/ai-audit" className="hover:text-[color:var(--color-text)] transition-colors">{nav("servicesMenu.aiAudit.title")}</Link></li>
              <li><Link href="/services/document-automation" className="hover:text-[color:var(--color-text)] transition-colors">{nav("servicesMenu.documents.title")}</Link></li>
              <li><Link href="/services/ai-act-compliance" className="hover:text-[color:var(--color-text)] transition-colors">{nav("servicesMenu.aiAct.title")}</Link></li>
              <li><Link href="/services/ai-visibility" className="hover:text-[color:var(--color-text)] transition-colors">{nav("servicesMenu.aiVisibility.title")}</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-2">
            <h4 className="t-eyebrow mb-4 text-[11px]">{t("sections.contact")}</h4>
            <ul className="space-y-2.5 text-[14px] text-[color:var(--color-text-2)]">
              {PHONE_HREF && (
                <li><a href={PHONE_HREF} className="hover:text-[color:var(--color-text)] transition-colors">{formatPhone()}</a></li>
              )}
              {WHATSAPP_URL && (
                <li><a href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener" className="hover:text-[color:var(--color-text)] transition-colors">WhatsApp</a></li>
              )}
              <li><a href="mailto:info@buildbyalex.com" className="hover:text-[color:var(--color-text)] transition-colors">info@buildbyalex.com</a></li>
              <li><a href="https://t.me/sumotry" target="_blank" rel="noreferrer noopener" className="hover:text-[color:var(--color-text)] transition-colors">{t("links.telegram")} @sumotry</a></li>
            </ul>
          </div>
        </div>

        <div className="relative mt-14 flex flex-col-reverse items-center gap-6 border-t border-[color:var(--c-hairline)] pt-6 md:block">
          <p className="text-center text-[12px] text-[color:var(--color-text-3)]">
            © {year} buildbyalex. {t("rights")} <span className="mx-1 opacity-50">·</span> {t("legal")}
          </p>
          <div className="md:absolute md:right-0 md:top-6">
            <LocaleSwitcher />
          </div>
        </div>
      </Container>

      {/* Oversized brand wordmark standing on a reflective floor — the apple.com
          "typography is the brand" move, with a mirrored echo fading downward.
          A flow element so the mirror always has room; purely decorative. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex translate-y-[34%] select-none flex-col items-center overflow-hidden"
      >
        {/* the wordmark — brighter than before, fading in from the top */}
        <Logo
          size="clamp(76px, 16.5vw, 252px)"
          showDot={false}
          className="block whitespace-nowrap opacity-[0.13] [mask-image:linear-gradient(to_bottom,transparent_2%,#000_52%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_2%,#000_52%)]"
        />
        {/* mirrored reflection — flipped, dimmer, fading out into the floor */}
        <Logo
          size="clamp(76px, 16.5vw, 252px)"
          showDot={false}
          className="-mt-[0.02em] block scale-y-[-1] whitespace-nowrap opacity-[0.06] blur-[0.6px] [mask-image:linear-gradient(to_bottom,transparent_38%,#000_104%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_38%,#000_104%)]"
        />
      </div>
    </footer>
  );
}
