"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

type Segment =
  | { type: "text"; content: string }
  | { type: "bold"; content: string }
  | { type: "link"; content: string; href: string };

const TYPE_SPEED_MS = 12;
const HOLD_AFTER_QUESTION = 700;
const HOLD_BEFORE_RESPONSE = 900;
const HOLD_AFTER_COMPLETE = 4500;

export function ChatGPTRecommendMock() {
  const t = useTranslations("work.caseShowcase.legalwin.chatgpt");
  const userQuestion = t("userQuestion");
  const response = useMemo(() => t.raw("response") as Segment[], [t]);
  const fullText = useMemo(() => response.map((s) => s.content).join(""), [response]);

  const [phase, setPhase] = useState<"idle" | "question" | "thinking" | "typing" | "done">("idle");
  const [charsTyped, setCharsTyped] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(() => !cancelled && fn(), ms);
      timers.push(id);
    };

    const run = () => {
      setPhase("idle");
      setCharsTyped(0);

      schedule(() => setPhase("question"), 400);
      schedule(() => setPhase("thinking"), 400 + HOLD_AFTER_QUESTION);
      schedule(() => setPhase("typing"), 400 + HOLD_AFTER_QUESTION + HOLD_BEFORE_RESPONSE);

      let cursor = 400 + HOLD_AFTER_QUESTION + HOLD_BEFORE_RESPONSE;
      for (let i = 1; i <= fullText.length; i++) {
        schedule(() => setCharsTyped(i), cursor);
        cursor += TYPE_SPEED_MS;
      }
      schedule(() => setPhase("done"), cursor);
      schedule(run, cursor + HOLD_AFTER_COMPLETE);
    };

    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [fullText]);

  const visibleSegments = sliceSegments(response, charsTyped);

  return (
    <div
      className="relative mx-auto w-full max-w-[860px] overflow-hidden rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)]"
      style={{ background: "#212121" }}
    >
      {/* Browser frame */}
      <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3" style={{ background: "#171717" }}>
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="mx-auto flex max-w-[420px] flex-1 items-center gap-2 rounded-md bg-black/40 px-3 py-1 text-[12px] text-white/60">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 1a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-2V6a5 5 0 0 0-5-5zm-3 8V6a3 3 0 1 1 6 0v3H9z"
              fill="currentColor"
            />
          </svg>
          <span className="truncate">chatgpt.com</span>
        </div>
        <div className="w-12" />
      </div>

      {/* ChatGPT app header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3" style={{ background: "#212121" }}>
        <div className="flex items-center gap-2 text-white/90">
          <span className="text-[15px] font-semibold">ChatGPT</span>
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium">5</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white/40">
            <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md p-1.5 text-white/60 hover:bg-white/5" aria-label="Share">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-[11px] font-semibold text-white grid place-items-center">
            M
          </div>
        </div>
      </div>

      {/* Chat body */}
      <div className="min-h-[520px] px-6 py-8 md:px-12" style={{ background: "#212121" }}>
        <div className="mx-auto max-w-[680px] space-y-7">
          {phase !== "idle" && (
            <div
              className="ml-auto max-w-[80%] rounded-2xl rounded-br-md px-4 py-3 text-[15px] leading-[1.55] text-white"
              style={{ background: "#2f2f2f", animation: "ctgFadeUp 350ms ease-out both" }}
            >
              {userQuestion}
            </div>
          )}

          {(phase === "thinking" || phase === "typing" || phase === "done") && (
            <div className="flex gap-4" style={{ animation: "ctgFadeUp 350ms ease-out both" }}>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/40 ring-1 ring-white/10">
                <ChatGPTSparkle />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                {phase === "thinking" ? (
                  <ThinkingDots />
                ) : (
                  <div className="whitespace-pre-line text-[15px] leading-[1.65] text-white/90">
                    {visibleSegments.map((seg, i) => {
                      if (seg.type === "bold")
                        return (
                          <strong key={i} className="font-semibold text-white">
                            {seg.content}
                          </strong>
                        );
                      if (seg.type === "link")
                        return (
                          <a
                            key={i}
                            href={seg.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-[#7ab7ff] underline decoration-[#7ab7ff]/40 underline-offset-2 hover:decoration-[#7ab7ff]"
                          >
                            {seg.content}
                          </a>
                        );
                      return <span key={i}>{seg.content}</span>;
                    })}
                    {phase === "typing" && (
                      <span className="ml-0.5 inline-block h-[14px] w-[8px] -mb-[2px] bg-white/80 align-baseline" style={{ animation: "ctgBlink 900ms steps(2) infinite" }} />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-white/[0.06] px-6 py-4 md:px-12" style={{ background: "#212121" }}>
        <div className="mx-auto flex max-w-[680px] items-center gap-2 rounded-full border border-white/10 px-4 py-2.5" style={{ background: "#2f2f2f" }}>
          <button className="text-white/50" aria-label="Attach">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <span className="flex-1 text-[14px] text-white/40">Ask anything</span>
          <button className="rounded-full bg-white/90 p-1.5 text-black" aria-label="Send">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes ctgFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes ctgBlink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function sliceSegments(segments: Segment[], chars: number): Segment[] {
  const out: Segment[] = [];
  let remaining = chars;
  for (const seg of segments) {
    if (remaining <= 0) break;
    if (seg.content.length <= remaining) {
      out.push(seg);
      remaining -= seg.content.length;
    } else {
      out.push({ ...seg, content: seg.content.slice(0, remaining) } as Segment);
      remaining = 0;
    }
  }
  return out;
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 pt-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block h-2 w-2 rounded-full bg-white/40"
          style={{
            animation: `ctgPulse 1s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes ctgPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}

function ChatGPTSparkle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"
        stroke="white"
        strokeOpacity="0.75"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.5" fill="white" fillOpacity="0.9" />
    </svg>
  );
}
