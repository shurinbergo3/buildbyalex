"use client";

import { Fragment, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NavServices } from "./NavServices";
import { cn } from "@/lib/utils";

const linkItems = [
  { href: "/work", key: "work" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <header
      data-light-header={!scrolled && isHome ? "true" : undefined}
      data-scrolled={scrolled ? "" : undefined}
      className="site-header fixed inset-x-0 top-0 z-40 h-[var(--header-h)]"
    >
      {/* From md up the nav gets its own middle column, so it sits on the page's
          centre axis however wide the logo and the buttons on the right are. */}
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-5 md:grid md:grid-cols-[1fr_auto_1fr] md:px-8">
        <Link href="/" aria-label="buildbyalex — home" className="-ml-1 p-1 md:justify-self-start">
          <Logo size={23} />
        </Link>

        <nav className="hidden md:block" aria-label="Primary">
          <ul className="flex items-center gap-7">
            {linkItems.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              const node = (
                <Link
                  href={item.href}
                  className={cn(
                    "text-[14px] font-medium tracking-[-0.011em] text-[color:var(--color-text-2)] transition-colors hover:text-[color:var(--color-text)]",
                    active && "text-[color:var(--color-text)]",
                  )}
                >
                  {t(item.key)}
                </Link>
              );
              // Slot the services mega-dropdown right after "Работы".
              return (
                <Fragment key={item.key}>
                  <li>{node}</li>
                  {item.key === "work" && (
                    <li>
                      <NavServices />
                    </li>
                  )}
                </Fragment>
              );
            })}
          </ul>
        </nav>

        <div className="hidden md:flex items-center gap-2 md:justify-self-end">
          <LocaleSwitcher />
          <Button href="/contact" size="md">
            {t("letsTalk")}
          </Button>
        </div>

        <div className="flex md:hidden items-center gap-1.5">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
