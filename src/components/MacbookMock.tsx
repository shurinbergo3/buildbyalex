import Image from "next/image";
import { useTranslations } from "next-intl";

/* VisionAir brand palette (the live site's own dark/gold theme — distinct
   from buildbyalex's amber). Recreated here so the laptop shows the real site. */
const GOLD = "#CBA45C";
const GOLD_HI = "#E6CB87";

type Stat = { k: string; v: string };

export function MacbookMock({
  url,
  image,
}: {
  url: string;
  image: string;
}) {
  const t = useTranslations("work.caseShowcase.visionair.macbook");
  const stats = t.raw("stats") as Stat[];
  const nav = t.raw("nav") as string[];
  const domain = url.replace(/^https?:\/\//, "");

  return (
    <div className="mx-auto w-full max-w-[600px] [perspective:1600px]">
      {/* ── Lid / screen ── */}
      <div
        className="relative rounded-[16px] border-[3px] border-[#3a3b3e] bg-[#0d0d0f] p-[10px] shadow-[0_40px_80px_-30px_rgba(10,15,25,0.55),0_0_0_1px_rgba(0,0,0,0.18)]"
      >
        {/* camera */}
        <div className="absolute left-1/2 top-[4px] z-10 h-[4px] w-[4px] -translate-x-1/2 rounded-full bg-[#26272a] ring-1 ring-black/40" />

        {/* viewport */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-[7px] bg-[#0a0c11]">
          {/* backdrop image + cinematic grade */}
          <Image
            src={image}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="scale-105 object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(8,10,15,0.92) 0%, rgba(8,10,15,0.74) 38%, rgba(8,10,15,0.32) 70%, rgba(8,10,15,0.55) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 78% 38%, rgba(203,164,92,0.16) 0%, transparent 55%)",
            }}
          />

          {/* ── site UI ── */}
          <div className="relative flex h-full flex-col px-[5%] py-[3.4%] text-white">
            {/* top bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[1.3%]">
                <span
                  className="grid h-[clamp(14px,2.6vw,20px)] w-[clamp(14px,2.6vw,20px)] place-items-center rounded-[4px] border"
                  style={{ borderColor: `${GOLD}88` }}
                >
                  <svg viewBox="0 0 24 24" width="58%" height="58%" fill="none" stroke={GOLD} strokeWidth="1.8">
                    <circle cx="12" cy="12" r="2.4" />
                    <path d="M12 9.6V4M12 14.4V20M9.6 12H4M14.4 12H20" strokeLinecap="round" />
                  </svg>
                </span>
                <div className="leading-none">
                  <div className="text-[clamp(8px,1.5vw,12px)] font-semibold tracking-[0.16em]">
                    VISIONAIR
                  </div>
                  <div
                    className="mt-[2px] text-[clamp(4.5px,0.85vw,6.5px)] tracking-[0.3em]"
                    style={{ color: `${GOLD}cc` }}
                  >
                    WARSAW · AERIAL CINEMA
                  </div>
                </div>
              </div>

              <div className="hidden items-center gap-[1.6%] text-[clamp(5px,1vw,8px)] tracking-[0.14em] text-white/70 sm:flex">
                {nav.map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>

              <div className="flex items-center gap-[6px]">
                <span className="hidden text-[clamp(5px,0.9vw,7px)] tracking-[0.16em] text-white/45 sm:inline">
                  RU · PL · EN · UA
                </span>
                <span
                  className="rounded-full px-[clamp(5px,1.3vw,11px)] py-[clamp(2px,0.7vw,5px)] text-[clamp(5px,0.95vw,7.5px)] font-semibold tracking-[0.12em] text-[#1a160c]"
                  style={{ background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD})` }}
                >
                  НАЧАТЬ ПРОЕКТ
                </span>
              </div>
            </div>

            {/* hero copy */}
            <div className="mt-auto max-w-[78%]">
              <div
                className="flex items-center gap-[5px] text-[clamp(5px,0.95vw,7.5px)] font-medium tracking-[0.26em]"
                style={{ color: GOLD }}
              >
                <span className="inline-block h-[3px] w-[3px] rounded-full" style={{ background: GOLD }} />
                WARSAW · EUROPE · WORLDWIDE
              </div>

              <h3 className="mt-[3%] text-[clamp(17px,5.1vw,42px)] font-extrabold uppercase leading-[0.92] tracking-[-0.01em]">
                {t("headline")}
              </h3>
              <p
                className="mt-[1.5%] font-serif text-[clamp(11px,3vw,24px)] italic leading-none"
                style={{ color: GOLD_HI }}
              >
                {t("accent")}
              </p>

              <p className="mt-[3%] max-w-[80%] text-[clamp(5.5px,1.1vw,9px)] leading-[1.5] text-white/65">
                {t("lead")}
              </p>

              <div className="mt-[3.5%] flex items-center gap-[2.5%]">
                <span
                  className="rounded-full px-[clamp(7px,1.8vw,15px)] py-[clamp(3px,0.9vw,7px)] text-[clamp(5px,1vw,8px)] font-semibold tracking-[0.12em] text-[#1a160c]"
                  style={{ background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD})` }}
                >
                  НАЧАТЬ ПРОЕКТ →
                </span>
                <span className="text-[clamp(5px,1vw,8px)] font-medium tracking-[0.12em] text-white/85">
                  ▶ {t("ctaGhost")}
                </span>
              </div>

              {/* stat strip */}
              <div className="mt-[4%] flex items-center gap-[5%] border-t border-white/12 pt-[2.5%]">
                {stats.map((s) => (
                  <div key={s.k} className="leading-tight">
                    <div className="text-[clamp(4px,0.8vw,6.5px)] uppercase tracking-[0.18em] text-white/40">
                      {s.k}
                    </div>
                    <div className="mt-[2px] text-[clamp(6px,1.2vw,10px)] font-semibold">
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* screen glare */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(125deg, rgba(255,255,255,0.10) 0%, transparent 22%, transparent 100%)",
            }}
          />
        </div>
      </div>

      {/* ── Base / hinge ── */}
      <div className="relative mx-auto -mt-[2px] h-[clamp(9px,1.6vw,14px)] w-[107%] -translate-x-[3.27%]">
        <div
          className="h-full w-full rounded-b-[12px] rounded-t-[3px]"
          style={{
            background:
              "linear-gradient(180deg, #cfd2d6 0%, #b7babf 40%, #9a9da2 75%, #7e8186 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 18px 24px -16px rgba(10,15,25,0.45)",
          }}
        />
        {/* notch */}
        <div
          className="absolute left-1/2 top-0 h-[34%] w-[15%] -translate-x-1/2 rounded-b-[6px]"
          style={{ background: "linear-gradient(180deg, #8b8e93, #b4b7bc)" }}
        />
      </div>

      {/* url caption */}
      <p className="mt-4 text-center font-mono text-[12px] tracking-[0.02em] text-[color:var(--color-text-3)]">
        {domain}
      </p>
    </div>
  );
}
