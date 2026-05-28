"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const QUERIES = [
  "karta pobytu Warszawa",
  "adwokat imigracyjny Polska",
  "pobyt stały dla Ukraińca",
  "pomoc prawna dla cudzoziemców Warszawa",
];

const RESULTS_BY_QUERY: Record<string, ResultSet> = {
  "karta pobytu Warszawa": {
    count: "About 48 200 results (0.31 sec)",
    items: [
      {
        site: "legalwin.pl",
        breadcrumb: "https://legalwin.pl › karta-pobytu",
        title: "Karta pobytu w Warszawie — kompletny przewodnik 2026 | LegalWin",
        snippet:
          "Krok po kroku: jakie dokumenty zebrać, gdzie złożyć wniosek, ile to trwa. Bezpłatna konsultacja AI 24/7. Ocena klientów 4.9★.",
        rating: "Ocena 4.9 · 312 opinii",
      },
      {
        site: "gov.pl",
        breadcrumb: "https://gov.pl › karty-pobytu",
        title: "Karta pobytu czasowego — Serwis Rzeczypospolitej Polskiej",
        snippet:
          "Informacje urzędowe o procedurze ubiegania się o kartę pobytu czasowego dla obcokrajowców…",
      },
      {
        site: "infor.pl",
        breadcrumb: "https://infor.pl › prawo › karta-pobytu",
        title: "Karta pobytu 2025 — wniosek, dokumenty, opłaty",
        snippet:
          "Sprawdź, jakie dokumenty są wymagane do wniosku o kartę pobytu w 2025 roku oraz aktualne opłaty…",
      },
    ],
  },
  "adwokat imigracyjny Polska": {
    count: "About 31 700 results (0.42 sec)",
    items: [
      {
        site: "legalwin.pl",
        breadcrumb: "https://legalwin.pl",
        title: "LegalWin — adwokat imigracyjny w Warszawie · RU · PL · UA",
        snippet:
          "Specjalizacja: karta pobytu, pobyt stały, obywatelstwo, łączenie rodzin. Pierwsza konsultacja bezpłatna. 312 zadowolonych klientów.",
        rating: "Ocena 4.9 · 312 opinii",
      },
      {
        site: "adwokat-warszawa.pl",
        breadcrumb: "https://adwokat-warszawa.pl › imigracja",
        title: "Kancelaria Adwokacka — prawo imigracyjne Warszawa",
        snippet:
          "Pomoc prawna w sprawach cudzoziemskich, reprezentacja przed Urzędem do Spraw Cudzoziemców…",
      },
      {
        site: "panoramafirm.pl",
        breadcrumb: "https://panoramafirm.pl › adwokaci",
        title: "Adwokat imigracyjny Polska — katalog kancelarii",
        snippet:
          "Lista 247 kancelarii specjalizujących się w prawie imigracyjnym w Polsce. Opinie, kontakt, lokalizacja…",
      },
    ],
  },
  "pobyt stały dla Ukraińca": {
    count: "About 22 400 results (0.28 sec)",
    items: [
      {
        site: "legalwin.pl",
        breadcrumb: "https://legalwin.pl › pobyt-staly",
        title: "Pobyt stały dla obywateli Ukrainy — przewodnik 2026 | LegalWin",
        snippet:
          "Warunki, dokumenty, terminy. AI-konsultant odpowie po polsku, ukraińsku lub rosyjsku. Ocena 4.9★ od 312 klientów.",
        rating: "Ocena 4.9 · 312 opinii",
      },
      {
        site: "ukrayinets.pl",
        breadcrumb: "https://ukrayinets.pl › pobyt-staly",
        title: "Постійний побут у Польщі — як отримати",
        snippet:
          "Що потрібно для отримання постійного побуту, які документи готувати, скільки чекати рішення…",
      },
      {
        site: "migrant.info.pl",
        breadcrumb: "https://migrant.info.pl › pobyt-staly",
        title: "Zezwolenie na pobyt stały — informacje dla cudzoziemców",
        snippet:
          "Kompletne informacje o procedurze uzyskania zezwolenia na pobyt stały w Polsce…",
      },
    ],
  },
  "pomoc prawna dla cudzoziemców Warszawa": {
    count: "About 18 900 results (0.36 sec)",
    items: [
      {
        site: "legalwin.pl",
        breadcrumb: "https://legalwin.pl",
        title: "Pomoc prawna dla cudzoziemców · Warszawa | LegalWin",
        snippet:
          "Wsparcie 24/7 w trzech językach. Sprawy imigracyjne, karta pobytu, obywatelstwo. Bezpłatna pierwsza konsultacja online.",
        rating: "Ocena 4.9 · 312 opinii",
      },
      {
        site: "ngo.pl",
        breadcrumb: "https://ngo.pl › pomoc-prawna",
        title: "Bezpłatna pomoc prawna dla cudzoziemców — lista organizacji",
        snippet:
          "Spis organizacji pozarządowych oferujących bezpłatne porady prawne dla cudzoziemców w Warszawie…",
      },
      {
        site: "warszawa19115.pl",
        breadcrumb: "https://warszawa19115.pl › cudzoziemcy",
        title: "Warszawa 19115 — pomoc dla cudzoziemców",
        snippet:
          "Miejski punkt informacyjny dla osób z zagranicy mieszkających w stolicy. Kontakt, godziny pracy…",
      },
    ],
  },
};

type ResultItem = {
  site: string;
  breadcrumb: string;
  title: string;
  snippet: string;
  rating?: string;
};

type ResultSet = {
  count: string;
  items: ResultItem[];
};

const TYPE_PER_CHAR = 55;
const HOLD_AFTER_RESULTS = 4200;
const HOLD_BEFORE_TYPING = 600;

export function GoogleSerpMock() {
  const [queryIndex, setQueryIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [showResults, setShowResults] = useState(false);

  const query = QUERIES[queryIndex];
  const results = RESULTS_BY_QUERY[query];

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(() => !cancelled && fn(), ms);
      timers.push(id);
    };

    setTyped("");
    setShowResults(false);

    let cursor = HOLD_BEFORE_TYPING;
    for (let i = 1; i <= query.length; i++) {
      schedule(() => setTyped(query.slice(0, i)), cursor);
      cursor += TYPE_PER_CHAR;
    }
    schedule(() => setShowResults(true), cursor + 250);
    schedule(
      () => setQueryIndex((idx) => (idx + 1) % QUERIES.length),
      cursor + 250 + HOLD_AFTER_RESULTS,
    );

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [queryIndex, query]);

  return (
    <div
      className="relative mx-auto w-full max-w-[860px] overflow-hidden rounded-2xl shadow-[0_30px_80px_-20px_rgba(20,30,50,0.35),0_0_0_1px_rgba(0,0,0,0.06)]"
      style={{ background: "#ffffff" }}
    >
      {/* Browser frame */}
      <div className="flex items-center gap-3 border-b border-black/5 px-4 py-3" style={{ background: "#f1f3f4" }}>
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="mx-auto flex max-w-[420px] flex-1 items-center gap-2 rounded-full bg-white px-3 py-1 text-[12px] text-[#5f6368]">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 1a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-2V6a5 5 0 0 0-5-5zm-3 8V6a3 3 0 1 1 6 0v3H9z"
              fill="currentColor"
            />
          </svg>
          <span className="truncate">google.com/search</span>
        </div>
        <div className="w-12" />
      </div>

      {/* Google header */}
      <div className="flex items-center gap-6 px-6 pt-5 pb-3">
        <GoogleLogo />
        <div className="relative flex-1">
          <div className="flex h-[44px] items-center gap-3 rounded-full border border-[#dfe1e5] px-5 shadow-[0_1px_6px_rgba(32,33,36,0.08)]">
            <span className="min-h-[20px] flex-1 text-[16px] text-[#202124]">
              {typed}
              <span className="ml-0.5 inline-block h-[16px] w-[1.5px] -mb-[2px] animate-pulse bg-[#202124]" />
            </span>
            <button className="text-[#4285f4]" aria-label="Search by voice">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
              </svg>
            </button>
            <button className="text-[#4285f4]" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2.2" />
                <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#ebebeb] px-6 text-[13px] text-[#5f6368]">
        <Tab label="All" active />
        <Tab label="Images" />
        <Tab label="News" />
        <Tab label="Maps" />
        <Tab label="Videos" />
        <Tab label="More" />
      </div>

      {/* Results */}
      <div className="min-h-[420px] px-6 py-4">
        <p className="text-[12.5px] text-[#70757a]">{results.count}</p>

        <AnimatePresence mode="wait">
          {showResults && (
            <motion.ol
              key={query}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 space-y-6"
            >
              {results.items.map((item, i) => (
                <Result key={`${query}-${i}`} item={item} highlight={i === 0} delay={i * 80} />
              ))}
            </motion.ol>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Result({
  item,
  highlight,
  delay,
}: {
  item: ResultItem;
  highlight: boolean;
  delay: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay / 1000 }}
      className={`relative max-w-[600px] ${highlight ? "rounded-lg" : ""}`}
    >
      {highlight && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-3 -z-0 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          style={{
            background:
              "linear-gradient(135deg, rgba(255,107,26,0.08) 0%, rgba(255,107,26,0.02) 100%)",
            boxShadow: "0 0 0 1px rgba(255,107,26,0.20)",
          }}
        />
      )}
      <div className="relative">
        <div className="flex items-center gap-2 text-[12.5px] text-[#202124]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f1f3f4] text-[10px] font-semibold text-[#5f6368]">
            {item.site.charAt(0).toUpperCase()}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-medium">{item.site}</span>
            <span className="text-[11.5px] text-[#5f6368]">{item.breadcrumb}</span>
          </span>
          {highlight && (
            <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-[#ff6b1a]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#c44a00]">
              #1
            </span>
          )}
        </div>
        <h3
          className={`mt-1 text-[20px] leading-[1.3] ${
            highlight ? "text-[#1a0dab]" : "text-[#1a0dab]"
          } hover:underline`}
        >
          {item.title}
        </h3>
        <p className="mt-1 text-[14px] leading-[1.5] text-[#4d5156]">
          {item.snippet}
        </p>
        {item.rating && (
          <p className="mt-1 flex items-center gap-1 text-[13px] text-[#70757a]">
            <span className="text-[#fbbc05]">★★★★★</span>
            <span>{item.rating}</span>
          </p>
        )}
      </div>
    </motion.li>
  );
}

function Tab({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`relative py-3 ${
        active ? "text-[#1a73e8]" : "text-[#5f6368]"
      }`}
    >
      {label}
      {active && (
        <span className="absolute inset-x-0 -bottom-px h-[3px] rounded-t bg-[#1a73e8]" />
      )}
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="92" height="30" viewBox="0 0 272 92" aria-label="Google">
      <path
        fill="#4285F4"
        d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.86 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
      />
      <path
        fill="#EA4335"
        d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
      />
      <path
        fill="#FBBC05"
        d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.62 13.36 12.35 13.36 6.63 0 11.84-5.62 11.84-13.36z"
      />
      <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z" />
      <path
        fill="#EA4335"
        d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
      />
      <path
        fill="#4285F4"
        d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"
      />
    </svg>
  );
}
