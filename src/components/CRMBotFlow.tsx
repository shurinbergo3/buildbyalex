"use client";

import { useEffect, useRef, useState } from "react";

type Step = {
  n: string;
  title: string;
  body: string;
  icon: React.ReactNode;
};

const steps: Step[] = [
  {
    n: "01",
    title: "AmoCRM lead arrives",
    body: "A new lead lands in AmoCRM and instantly triggers the bot.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
        <path d="M3 7h18M3 12h18M3 17h12" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "Telegram message sent",
    body: "The bot opens the conversation with the prospect on Telegram.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
        <path d="m3 11 18-7-3 17-6-4-2 5-2-7-5-4Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Gemini AI qualifies",
    body: "Gemini holds a natural conversation and scores the lead in real time.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    n: "04",
    title: "Pipeline auto-advances",
    body: "The deal moves to the next stage in AmoCRM without manual work.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
        <path d="M4 7h10l3 3M4 12h13M4 17h10l3-3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    n: "05",
    title: "Manager pinged",
    body: "A human is alerted only when judgment is actually required.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
        <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" strokeLinejoin="round" />
        <path d="M10 18a2 2 0 0 0 4 0" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function CRMBotFlow() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      data-active={active ? "true" : "false"}
      className="crm-flow group/flow relative isolate overflow-hidden rounded-2xl bg-neutral-950 px-6 py-12 text-neutral-100 ring-1 ring-white/5 md:px-10 md:py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(56,189,248,0.10), transparent 70%), radial-gradient(40% 40% at 100% 100%, rgba(168,85,247,0.10), transparent 70%)",
        }}
      />

      <ol className="relative grid grid-cols-1 gap-6 md:grid-cols-[repeat(5,minmax(0,1fr))_auto] md:gap-0 lg:gap-2">
        {steps.map((step, i) => (
          <li
            key={step.n}
            className="crm-flow__step relative flex"
            style={{ ["--i" as string]: i }}
          >
            <div className="relative z-10 flex w-full flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="grid size-9 place-items-center rounded-lg bg-white/[0.06] text-sky-300 ring-1 ring-white/10 [&>svg]:size-5">
                  {step.icon}
                </span>
                <span className="font-mono text-[11px] tracking-[0.12em] text-neutral-500">
                  {step.n}
                </span>
              </div>
              <h3 className="text-[15px] font-medium leading-tight text-white">
                {step.title}
              </h3>
              <p className="text-[13px] leading-[1.55] text-neutral-400">
                {step.body}
              </p>
            </div>

            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="crm-flow__arrow pointer-events-none"
                style={{ ["--i" as string]: i }}
              >
                <svg viewBox="0 0 40 16" fill="none" className="crm-flow__arrow-svg">
                  <line
                    x1="2"
                    y1="8"
                    x2="32"
                    y2="8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="3 4"
                  />
                  <path
                    d="M30 3l6 5-6 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </span>
            )}
          </li>
        ))}
      </ol>

      <style jsx>{`
        .crm-flow__step {
          opacity: 0;
          transform: translateY(12px);
        }
        .crm-flow[data-active="true"] .crm-flow__step {
          animation: crmFlowIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: calc(var(--i) * 300ms);
        }

        .crm-flow__arrow {
          color: rgba(125, 211, 252, 0.55);
          opacity: 0;
        }
        .crm-flow[data-active="true"] .crm-flow__arrow {
          animation: crmArrowIn 0.4s ease-out forwards;
          animation-delay: calc(var(--i) * 300ms + 250ms);
        }
        .crm-flow__arrow-svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .crm-flow[data-active="true"] .crm-flow__arrow-svg {
          animation: crmDash 1.6s linear infinite;
          animation-delay: calc(var(--i) * 300ms + 400ms);
        }

        /* Desktop: arrows between columns */
        @media (min-width: 768px) {
          .crm-flow__step {
            padding-right: 28px;
          }
          .crm-flow__step:last-child {
            padding-right: 0;
          }
          .crm-flow__arrow {
            position: absolute;
            top: 50%;
            right: 0;
            width: 28px;
            height: 16px;
            transform: translateY(-50%);
          }
        }

        /* Mobile: arrows below each step pointing down */
        @media (max-width: 767px) {
          .crm-flow__step {
            padding-bottom: 28px;
          }
          .crm-flow__step:last-child {
            padding-bottom: 0;
          }
          .crm-flow__arrow {
            position: absolute;
            bottom: 6px;
            left: 50%;
            width: 28px;
            height: 16px;
            transform: translateX(-50%) rotate(90deg);
          }
        }

        @keyframes crmFlowIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes crmArrowIn {
          to {
            opacity: 1;
          }
        }
        @keyframes crmDash {
          to {
            stroke-dashoffset: -28;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .crm-flow[data-active="true"] .crm-flow__step,
          .crm-flow[data-active="true"] .crm-flow__arrow {
            animation: none;
            opacity: 1;
            transform: none;
          }
          .crm-flow[data-active="true"] .crm-flow__arrow-svg {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
