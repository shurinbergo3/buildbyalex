import type { CSSProperties } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   Hero background contours — themed line-art glyphs scattered behind every
   glass hero stage. Each theme tells the story of what the page builds:
     web        → React · Next.js · HTML5 · Java · WordPress · SEO · </> · {}
     ai         → neural net · robot · GPT spark · CRM cloud/sprocket/board
     automation → flow nodes · gears · webhook loop · database · zap
     mobile     → Swift · Kotlin · Dart · Java · Apple · Android
     telegram   → paper-plane · bot · chat · mini-app · @
     ads        → Google · Meta · Facebook · Instagram · chart · target
   Strokes render as constant hairlines (see .hero-contour in globals.css) so
   the marks stay delicate at any scale. Masked away from the copy column so
   contrast on the headline stays clean. Purely decorative — hidden from a11y.
   ═══════════════════════════════════════════════════════════════════════════ */

export type ContourTheme = "web" | "ai" | "automation" | "mobile" | "telegram" | "ads" | "studio";

type GP = { className?: string; style?: CSSProperties };

/* Soft transparent hole over the protected copy area + a fade at the far edges,
   so the line-art never competes with the copy but still wraps the stage.
   "left" guards a left-aligned copy column (heroes); "center" guards centered
   copy (the final CTA bookend). */
const MASK_LEFT =
  "radial-gradient(62% 78% at 24% 48%, transparent 12%, rgba(0,0,0,0.45) 44%, #000 76%)";
const MASK_CENTER =
  "radial-gradient(82% 96% at 50% 50%, transparent 18%, rgba(0,0,0,0.5) 52%, #000 84%)";

/* ───────────────────────── brand-logo outlines (24vb) ───────────────────────── */
const APPLE =
  "M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z";
const ANDROID =
  "M17.523 15.341c-.551 0-.999-.448-.999-.999s.448-.999.999-.999.999.448.999.999-.448.999-.999.999m-11.046 0c-.551 0-.999-.448-.999-.999s.448-.999.999-.999.999.448.999.999-.448.999-.999.999m11.405-6.02 1.997-3.459a.416.416 0 0 0-.72-.415l-2.022 3.503C15.59 8.244 13.853 7.851 12 7.851s-3.59.393-5.137 1.099L4.841 5.447a.416.416 0 0 0-.72.415L6.118 9.32C2.689 11.187.343 14.659 0 18.761h24c-.343-4.102-2.689-7.574-6.118-9.44";
const GOOGLE =
  "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z";
const META =
  "M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.6 6.6 0 0 0 .265.86 5.3 5.3 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.74 3.74 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056C9.187 4.367 8.054 4.03 6.915 4.03zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.9 44.9 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.157-2.602zm-10.201.553c1.043 0 1.97.502 2.973 1.638.502.569 1.004 1.25 1.5 2.011-.521.797-1.045 1.66-1.564 2.51-1.4 2.287-1.85 2.973-2.722 3.835-.852.842-1.394 1.027-1.857 1.027-.589 0-1.176-.295-1.563-.84-.397-.563-.612-1.376-.612-2.46 0-1.95.59-4.124 1.493-5.633.628-1.044 1.397-1.738 2.354-1.738z";
const FACEBOOK =
  "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z";
const INSTAGRAM =
  "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z";
const SWIFT =
  "M9.5 3C5.36 3 3 5.3 3 9.4v5.2C3 18.7 5.36 21 9.5 21h5C18.64 21 21 18.7 21 14.6V9.4C21 5.3 18.64 3 14.5 3h-5zm4.04.41c4.11 2.47 6.55 7.16 5.55 11.13 1.5 1.85 1.06 4.78.86 4.27-.9-1.75-2.55-1.2-3.4-.78-2.1 1.12-4.96 1.2-7.81-.02a12.6 12.6 0 0 1-5.64-4.84c.65.48 1.35.9 2.1 1.25 3.02 1.41 6.05 1.31 8.2 0C9.65 12.73 7.1 9.67 5.15 7.19c-.4-.53-.73-1.04-1.01-1.38 2.34 2.14 6.04 4.83 7.37 5.58C8.69 8.41 6.2 4.74 6.32 4.86c4.44 4.47 8.53 7 8.53 7l.36.21c.08-.21.16-.44.22-.67.71-2.59-.09-5.55-1.89-7.99z";

function Brand({ d, sw = 0.5, vb = "0 0 24 24", className, style }: GP & { d: string; sw?: number | string; vb?: string }) {
  return (
    <svg viewBox={vb} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" className={className} style={style} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const Apple = (p: GP) => <Brand d={APPLE} {...p} />;
const Android = (p: GP) => <Brand d={ANDROID} {...p} />;
const Google = (p: GP) => <Brand d={GOOGLE} {...p} />;
const Meta = (p: GP) => <Brand d={META} {...p} />;
const Facebook = (p: GP) => <Brand d={FACEBOOK} {...p} />;
const Instagram = (p: GP) => <Brand d={INSTAGRAM} {...p} />;
const Swift = (p: GP) => <Brand d={SWIFT} {...p} />;

/* ───────────────────────── line-art glyphs ───────────────────────── */

function S({ className, style, children, vb = "0 0 24 24", sw = 1.5 }: GP & { children: React.ReactNode; vb?: string; sw?: number | string }) {
  return (
    <svg viewBox={vb} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      {children}
    </svg>
  );
}

/* Programming-language marks for the mobile stage — the languages apps are
   actually written in. Kotlin: rounded square with its signature left-pointing
   chevron. Dart: the angular bird silhouette. */
const Kotlin = (p: GP) => (
  <S {...p} sw="1.35">
    <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="2.6" />
    <path d="M20.4 3.6 4 12l16.4 8.4" />
  </S>
);
const Dart = (p: GP) => (
  <S {...p} sw="1.4">
    <path d="M4.2 13.4 13.4 4.2l6.4 2.8-1.4 10.4-10.2 1.6z" />
    <path d="M13.4 4.2 11 15.4l7.4 1.2" />
  </S>
);

const ReactAtom = (p: GP) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={p.className} style={p.style} aria-hidden="true">
    <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    <ellipse cx="12" cy="12" rx="11" ry="4.3" />
    <ellipse cx="12" cy="12" rx="11" ry="4.3" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="11" ry="4.3" transform="rotate(120 12 12)" />
  </svg>
);
const NextMark = (p: GP) => (
  <S {...p} sw="1.4">
    <circle cx="12" cy="12" r="10.4" />
    <path d="M8.6 16.2V7.8l7.2 9.2M15.4 7.8v6" />
  </S>
);
const Html5 = (p: GP) => (
  <S {...p} sw="1.4">
    <path d="M4 2.6 5.5 20 12 22l6.5-2L20 2.6H4z" />
    <path d="M8 7.2h8l-.5 5H10l.25 2.6 1.75.55 1.8-.55.2-1.9" />
  </S>
);
const JavaCup = (p: GP) => (
  <S {...p} sw="1.4">
    <path d="M5 11h12v4.5a4.5 4.5 0 0 1-4.5 4.5h-3A4.5 4.5 0 0 1 5 15.5V11z" />
    <path d="M17 12h1.6a2.2 2.2 0 0 1 0 4.4H17" />
    <path d="M9 3.5c-1 1.2 0 2.4 0 3.6M12.4 2.6c-1 1.2 0 2.4 0 3.6M15.6 3.5c-1 1.2 0 2.4 0 3.6" />
  </S>
);
const WordPress = (p: GP) => (
  <S {...p} sw="1.3">
    <circle cx="12" cy="12" r="10.4" />
    <path d="M3.2 9.4 7.5 19l2.1-5.7M8.7 8h5.4l2.9 9.6L20.4 9" />
    <path d="M8.7 8H6.4M16.6 8h1.9" />
  </S>
);
const Seo = (p: GP) => (
  <S {...p} sw="1.5">
    <circle cx="10" cy="10" r="6.4" />
    <path d="M14.6 14.6 21 21" />
    <path d="M7.4 11.6v-1.4M10 11.6V8M12.6 11.6V8.8" />
  </S>
);
const CodeBrackets = (p: GP) => (
  <S {...p} sw="1.6">
    <path d="M8 7 3 12l5 5M16 7l5 5-5 5M13.6 4.6l-3.2 14.8" />
  </S>
);
const CurlyBraces = (p: GP) => (
  <S {...p} sw="1.6">
    <path d="M9 4c-2 0-2 1.6-2 3.2 0 2-1 3-2 3 1 0 2 1 2 3 0 1.6 0 3.2 2 3.2M15 4c2 0 2 1.6 2 3.2 0 2 1 3 2 3-1 0-2 1-2 3 0 1.6 0 3.2-2 3.2" />
  </S>
);
const BrowserWindow = (p: GP) => (
  <S {...p} sw="1.4">
    <rect x="2.5" y="4" width="19" height="16" rx="2.4" />
    <path d="M2.5 8.6h19" />
    <circle cx="5.4" cy="6.3" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="7.6" cy="6.3" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="9.8" cy="6.3" r="0.6" fill="currentColor" stroke="none" />
  </S>
);
const TailwindWaves = (p: GP) => (
  <S {...p} vb="0 0 24 18" sw="1.4">
    <path d="M6 4.5c1.6-3.2 3.6-4.8 6-4.8 3.6 0 4.05 2.4 5.85 3 1.2.4 2.25.15 3.15-.75-1.6 3.2-3.6 4.8-6 4.8-3.6 0-4.05-2.4-5.85-3-1.2-.4-2.25-.15-3.15.75z" />
    <path d="M0 10.5c1.6-3.2 3.6-4.8 6-4.8 3.6 0 4.05 2.4 5.85 3 1.2.4 2.25.15 3.15-.75-1.6 3.2-3.6 4.8-6 4.8-3.6 0-4.05-2.4-5.85-3-1.2-.4-2.25-.15-3.15.75z" />
  </S>
);
const Spark = (p: GP) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={p.className} style={p.style} aria-hidden="true">
    <path d="M12 2c.45 4.7 2.6 6.85 7 7-4.4.15-6.55 2.3-7 7-.45-4.7-2.6-6.85-7-7 4.4-.15 6.55-2.3 7-7z" />
  </svg>
);

const NeuralNet = (p: GP) => {
  const L1 = [40, 100, 160];
  const L2 = [30, 90, 150, 188];
  const L3 = [70, 130];
  return (
    <svg viewBox="0 0 200 200" fill="none" className={p.className} style={p.style} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.85">
        {L1.map((y1, i) => L2.map((y2, j) => <line key={`a${i}-${j}`} x1={26} y1={y1} x2={100} y2={y2} />))}
        {L2.map((y2, i) => L3.map((y3, j) => <line key={`b${i}-${j}`} x1={100} y1={y2} x2={174} y2={y3} />))}
      </g>
      <g stroke="currentColor" strokeWidth="1.4" fill="none">
        {L1.map((y) => <circle key={`n1${y}`} cx={26} cy={y} r={7} />)}
        {L2.map((y) => <circle key={`n2${y}`} cx={100} cy={y} r={7} />)}
        {L3.map((y) => <circle key={`n3${y}`} cx={174} cy={y} r={7} />)}
      </g>
    </svg>
  );
};
const Robot = (p: GP) => (
  <S {...p} sw="1.6">
    <path d="M12 3v2.4" />
    <circle cx="12" cy="2.2" r="1" />
    <rect x="4.5" y="7" width="15" height="11" rx="3.4" />
    <path d="M2.6 11.5v3M21.4 11.5v3" />
    <circle cx="9" cy="12.4" r="1.5" />
    <circle cx="15" cy="12.4" r="1.5" />
    <path d="M9.5 15.6h5" />
  </S>
);
const CrmCloud = (p: GP) => (
  <S {...p} sw="1.6">
    <path d="M17.5 18.5a4 4 0 0 0 .3-8 5.5 5.5 0 0 0-10.5-1.2A3.8 3.8 0 0 0 6.5 18.5z" />
  </S>
);
const Sprocket = (p: GP) => (
  <S {...p} sw="1.5">
    <line x1="12" y1="6" x2="12" y2="10.2" />
    <line x1="7.6" y1="16.4" x2="10.4" y2="13.4" />
    <line x1="16.4" y1="16.4" x2="13.6" y2="13.4" />
    <circle cx="12" cy="12.4" r="2.4" />
    <circle cx="12" cy="4.2" r="2.1" />
    <circle cx="5.6" cy="18" r="2.1" />
    <circle cx="18.4" cy="18" r="2.1" />
  </S>
);
const Kanban = (p: GP) => (
  <S {...p} sw="1.6">
    <rect x="3" y="5" width="4.6" height="14" rx="1.4" />
    <rect x="9.7" y="5" width="4.6" height="9.5" rx="1.4" />
    <rect x="16.4" y="5" width="4.6" height="11.5" rx="1.4" />
  </S>
);
const ChatBubble = (p: GP) => (
  <S {...p} sw="1.5">
    <path d="M4 5h16v11H10l-4 4v-4H4z" />
    <path d="M8 9h8M8 12h5" />
  </S>
);
const TelegramPlane = (p: GP) => (
  <S {...p} sw="1.5">
    <circle cx="12" cy="12" r="10.6" strokeOpacity="0.55" strokeWidth="1.1" />
    <path d="M17.6 7.3 6.2 11.8c-.7.27-.69 1.27.02 1.49l2.86.85.9 3.4c.13.5.78.62 1.1.21l1.46-1.84 2.86 2.1c.4.3.98.08 1.08-.41l1.9-9.2c.12-.56-.43-1.03-.98-.8z" />
    <path d="m9.1 14.1 6.3-4.3-4.9 5" strokeWidth="1.1" />
  </S>
);
const MiniApp = (p: GP) => (
  <S {...p} sw="1.5">
    <rect x="4" y="4" width="16" height="16" rx="5" />
    <path d="M10 8.8 15.4 12 10 15.2z" />
  </S>
);
const AtSign = (p: GP) => (
  <S {...p} sw="1.5">
    <circle cx="12" cy="12" r="4" />
    <path d="M16 12v1.6a2.4 2.4 0 0 0 4.8 0V12a8.8 8.8 0 1 0-3.4 6.95" />
  </S>
);

const FlowNodes = (p: GP) => (
  <S {...p} sw="1.5">
    <circle cx="5" cy="12" r="2.6" />
    <circle cx="19" cy="6" r="2.6" />
    <circle cx="19" cy="18" r="2.6" />
    <path d="M7.4 11.4c2.6-.7 4.2-4.2 9-5.1M7.4 12.6c2.6.7 4.2 4.2 9 5.1" />
  </S>
);
const Gear = (p: GP) => (
  <S {...p} sw="1.5">
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.4v3M12 18.6v3M2.4 12h3M18.6 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1" />
  </S>
);
const Zap = (p: GP) => (
  <S {...p} sw="1.5">
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
  </S>
);
const LoopArrows = (p: GP) => (
  <S {...p} sw="1.5">
    <path d="M4 9a8 8 0 0 1 13.4-3.2L20 8M20 15a8 8 0 0 1-13.4 3.2L4 16" />
    <path d="M20 4v4h-4M4 20v-4h4" />
  </S>
);
const Database = (p: GP) => (
  <S {...p} sw="1.5">
    <ellipse cx="12" cy="6" rx="7" ry="2.6" />
    <path d="M5 6v12c0 1.45 3.13 2.6 7 2.6s7-1.15 7-2.6V6" />
    <path d="M5 12c0 1.45 3.13 2.6 7 2.6s7-1.15 7-2.6" />
  </S>
);
const Webhook = (p: GP) => (
  <S {...p} sw="1.5">
    <path d="M9 9a3 3 0 1 1 4.2 2.75l-2.2 3.85" />
    <path d="M15 13a3 3 0 1 1-2 5.27H8.6" />
    <path d="M9 13.5A3 3 0 1 1 6.2 9.4" />
    <circle cx="12" cy="9" r="0.6" fill="currentColor" stroke="none" />
  </S>
);

const BarChart = (p: GP) => (
  <S {...p} sw="1.5">
    <path d="M3 20.5h18" />
    <rect x="5" y="11" width="3" height="7" rx="0.6" />
    <rect x="10.5" y="6" width="3" height="12" rx="0.6" />
    <rect x="16" y="13" width="3" height="5" rx="0.6" />
    <path d="M5 9 10.5 4l3 2.5L19 3" strokeOpacity="0.7" />
  </S>
);
const CursorClick = (p: GP) => (
  <S {...p} sw="1.5">
    <path d="M9 4V2M5 6 3.5 4.5M5 10H3" strokeOpacity="0.75" />
    <path d="M11 11.5 20 14.8l-3.6 1.4L18.4 20l-2 1-2.2-3.8L11 20.4z" />
  </S>
);
const Target = (p: GP) => (
  <S {...p} sw="1.5">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </S>
);

/* ───────────────────────── scene composition ─────────────────────────
   Each entry: a glyph, a position/size class, a tint (accent | ink-white),
   and an opacity. Two "drift" layers gently float for life. */

type Mark = {
  G: (p: GP) => React.ReactNode;
  cls: string;
  tint: "accent" | "ink";
  o: number;
  drift?: "" | "fast" | "slow";
};

const SCENES: Record<ContourTheme, Mark[]> = {
  web: [
    { G: ReactAtom, cls: "absolute right-[6%] -top-[4%] h-[clamp(190px,28vw,340px)] w-[clamp(190px,28vw,340px)]", tint: "accent", o: 0.16, drift: "slow" },
    { G: BrowserWindow, cls: "absolute left-[46%] top-[6%] hidden h-[clamp(120px,15vw,210px)] w-[clamp(120px,15vw,210px)] md:block", tint: "ink", o: 0.1 },
    { G: NextMark, cls: "absolute right-[30%] top-[3%] hidden h-[clamp(80px,9vw,128px)] w-[clamp(80px,9vw,128px)] lg:block", tint: "ink", o: 0.12 },
    { G: Html5, cls: "absolute right-[4%] bottom-[7%] h-[clamp(96px,12vw,160px)] w-[clamp(96px,12vw,160px)]", tint: "accent", o: 0.15, drift: "fast" },
    { G: JavaCup, cls: "absolute right-[40%] bottom-[5%] hidden h-[clamp(86px,10vw,140px)] w-[clamp(86px,10vw,140px)] md:block", tint: "ink", o: 0.1 },
    { G: WordPress, cls: "absolute left-[3%] bottom-[10%] hidden h-[clamp(92px,11vw,150px)] w-[clamp(92px,11vw,150px)] sm:block", tint: "ink", o: 0.11 },
    { G: Seo, cls: "absolute left-[6%] top-[20%] hidden h-[clamp(70px,8vw,112px)] w-[clamp(70px,8vw,112px)] lg:block", tint: "accent", o: 0.13 },
    { G: CodeBrackets, cls: "absolute left-[30%] top-[8%] hidden h-[clamp(64px,7vw,96px)] w-[clamp(64px,7vw,96px)] lg:block", tint: "ink", o: 0.1 },
    { G: TailwindWaves, cls: "absolute right-[18%] bottom-[20%] hidden h-[clamp(70px,8vw,112px)] w-[clamp(96px,11vw,150px)] md:block", tint: "ink", o: 0.09 },
    { G: CurlyBraces, cls: "absolute left-[34%] bottom-[6%] hidden h-[clamp(60px,7vw,88px)] w-[clamp(60px,7vw,88px)] xl:block", tint: "accent", o: 0.1 },
  ],
  ai: [
    { G: NeuralNet, cls: "absolute right-[12%] top-[4%] h-[clamp(200px,30vw,350px)] w-[clamp(200px,30vw,350px)]", tint: "accent", o: 0.17, drift: "slow" },
    { G: TelegramPlane, cls: "absolute left-[45%] top-[7%] hidden h-[clamp(80px,9vw,120px)] w-[clamp(80px,9vw,120px)] md:block", tint: "accent", o: 0.16 },
    { G: Robot, cls: "absolute right-[5%] bottom-[6%] h-[clamp(116px,15vw,182px)] w-[clamp(116px,15vw,182px)]", tint: "ink", o: 0.12, drift: "fast" },
    { G: CrmCloud, cls: "absolute right-[34%] top-[5%] hidden h-[clamp(82px,9vw,124px)] w-[clamp(82px,9vw,124px)] lg:block", tint: "ink", o: 0.1 },
    { G: Sprocket, cls: "absolute left-[4%] bottom-[12%] hidden h-[clamp(86px,10vw,140px)] w-[clamp(86px,10vw,140px)] sm:block", tint: "accent", o: 0.12 },
    { G: Kanban, cls: "absolute right-[42%] bottom-[6%] hidden h-[clamp(78px,9vw,124px)] w-[clamp(78px,9vw,124px)] md:block", tint: "ink", o: 0.1 },
    { G: Spark, cls: "absolute left-[8%] top-[22%] h-[clamp(40px,5vw,68px)] w-[clamp(40px,5vw,68px)]", tint: "accent", o: 0.16 },
    { G: ChatBubble, cls: "absolute left-[32%] top-[10%] hidden h-[clamp(64px,7vw,96px)] w-[clamp(64px,7vw,96px)] xl:block", tint: "ink", o: 0.09 },
  ],
  automation: [
    { G: FlowNodes, cls: "absolute right-[8%] top-[2%] h-[clamp(170px,24vw,300px)] w-[clamp(170px,24vw,300px)]", tint: "accent", o: 0.16, drift: "slow" },
    { G: Gear, cls: "absolute right-[6%] bottom-[8%] h-[clamp(110px,14vw,180px)] w-[clamp(110px,14vw,180px)]", tint: "ink", o: 0.12, drift: "fast" },
    { G: LoopArrows, cls: "absolute left-[45%] top-[8%] hidden h-[clamp(86px,10vw,134px)] w-[clamp(86px,10vw,134px)] md:block", tint: "accent", o: 0.15 },
    { G: Database, cls: "absolute right-[38%] bottom-[6%] hidden h-[clamp(86px,10vw,138px)] w-[clamp(86px,10vw,138px)] md:block", tint: "ink", o: 0.1 },
    { G: Webhook, cls: "absolute left-[4%] bottom-[12%] hidden h-[clamp(84px,9vw,130px)] w-[clamp(84px,9vw,130px)] sm:block", tint: "ink", o: 0.11 },
    { G: Zap, cls: "absolute left-[7%] top-[20%] hidden h-[clamp(58px,7vw,92px)] w-[clamp(58px,7vw,92px)] lg:block", tint: "accent", o: 0.14 },
    { G: Gear, cls: "absolute right-[30%] top-[6%] hidden h-[clamp(56px,6vw,84px)] w-[clamp(56px,6vw,84px)] xl:block", tint: "ink", o: 0.09 },
  ],
  mobile: [
    { G: Swift, cls: "absolute left-[2%] -top-[6%] h-[clamp(180px,24vw,320px)] w-[clamp(180px,24vw,320px)] -rotate-[8deg]", tint: "accent", o: 0.16, drift: "slow" },
    { G: Kotlin, cls: "absolute right-[8%] bottom-[2%] h-[clamp(146px,19vw,270px)] w-[clamp(146px,19vw,270px)] rotate-[6deg]", tint: "ink", o: 0.12, drift: "fast" },
    { G: Dart, cls: "absolute right-[6%] top-[7%] hidden h-[clamp(108px,13vw,176px)] w-[clamp(108px,13vw,176px)] sm:block", tint: "accent", o: 0.14 },
    { G: JavaCup, cls: "absolute right-[39%] bottom-[6%] hidden h-[clamp(94px,11vw,148px)] w-[clamp(94px,11vw,148px)] md:block", tint: "ink", o: 0.11 },
    { G: Apple, cls: "absolute right-[33%] top-[4%] hidden h-[clamp(78px,9vw,120px)] w-[clamp(78px,9vw,120px)] lg:block", tint: "ink", o: 0.1 },
    { G: Android, cls: "absolute left-[6%] top-[34%] hidden h-[clamp(72px,8vw,110px)] w-[clamp(72px,8vw,110px)] lg:block", tint: "ink", o: 0.1 },
  ],
  telegram: [
    { G: TelegramPlane, cls: "absolute right-[8%] -top-[4%] h-[clamp(180px,26vw,320px)] w-[clamp(180px,26vw,320px)]", tint: "accent", o: 0.16, drift: "slow" },
    { G: Robot, cls: "absolute right-[6%] bottom-[6%] h-[clamp(116px,15vw,182px)] w-[clamp(116px,15vw,182px)]", tint: "ink", o: 0.12, drift: "fast" },
    { G: ChatBubble, cls: "absolute left-[45%] top-[8%] hidden h-[clamp(82px,9vw,128px)] w-[clamp(82px,9vw,128px)] md:block", tint: "accent", o: 0.15 },
    { G: MiniApp, cls: "absolute right-[38%] bottom-[6%] hidden h-[clamp(82px,9vw,128px)] w-[clamp(82px,9vw,128px)] md:block", tint: "ink", o: 0.1 },
    { G: AtSign, cls: "absolute left-[5%] bottom-[14%] hidden h-[clamp(70px,8vw,112px)] w-[clamp(70px,8vw,112px)] sm:block", tint: "ink", o: 0.11 },
    { G: Sprocket, cls: "absolute left-[8%] top-[22%] hidden h-[clamp(60px,7vw,92px)] w-[clamp(60px,7vw,92px)] xl:block", tint: "accent", o: 0.12 },
  ],
  ads: [
    { G: Google, cls: "absolute right-[2%] -top-[8%] h-[clamp(190px,28vw,360px)] w-[clamp(190px,28vw,360px)] rotate-[6deg]", tint: "accent", o: 0.16, drift: "slow" },
    { G: Meta, cls: "absolute right-[6%] bottom-[2%] h-[clamp(160px,22vw,300px)] w-[clamp(160px,22vw,300px)] -rotate-[5deg]", tint: "ink", o: 0.12, drift: "fast" },
    { G: BarChart, cls: "absolute left-[45%] top-[8%] hidden h-[clamp(86px,10vw,138px)] w-[clamp(86px,10vw,138px)] md:block", tint: "accent", o: 0.15 },
    { G: Facebook, cls: "absolute right-[40%] top-[6%] hidden h-[clamp(86px,10vw,140px)] w-[clamp(86px,10vw,140px)] lg:block", tint: "ink", o: 0.1 },
    { G: Instagram, cls: "absolute right-[34%] bottom-[8%] hidden h-[clamp(80px,9vw,128px)] w-[clamp(80px,9vw,128px)] md:block", tint: "accent", o: 0.13 },
    { G: Target, cls: "absolute left-[5%] bottom-[12%] hidden h-[clamp(78px,9vw,120px)] w-[clamp(78px,9vw,120px)] sm:block", tint: "ink", o: 0.11 },
    { G: CursorClick, cls: "absolute left-[8%] top-[24%] hidden h-[clamp(58px,7vw,90px)] w-[clamp(58px,7vw,90px)] xl:block", tint: "ink", o: 0.1 },
  ],
  // A cross-discipline sampler for the home page bookend — one mark per craft.
  studio: [
    { G: ReactAtom, cls: "absolute right-[6%] -top-[6%] h-[clamp(150px,20vw,260px)] w-[clamp(150px,20vw,260px)]", tint: "accent", o: 0.15, drift: "slow" },
    { G: NeuralNet, cls: "absolute left-[4%] bottom-[4%] h-[clamp(140px,18vw,240px)] w-[clamp(140px,18vw,240px)]", tint: "ink", o: 0.12, drift: "fast" },
    { G: TelegramPlane, cls: "absolute left-[6%] top-[10%] hidden h-[clamp(74px,8vw,116px)] w-[clamp(74px,8vw,116px)] sm:block", tint: "accent", o: 0.14 },
    { G: Apple, cls: "absolute right-[8%] bottom-[8%] hidden h-[clamp(86px,10vw,140px)] w-[clamp(86px,10vw,140px)] sm:block", tint: "ink", o: 0.12 },
    { G: Spark, cls: "absolute right-[26%] top-[20%] h-[clamp(34px,4vw,56px)] w-[clamp(34px,4vw,56px)]", tint: "accent", o: 0.16 },
    { G: CodeBrackets, cls: "absolute left-[27%] top-[8%] hidden h-[clamp(56px,6vw,84px)] w-[clamp(56px,6vw,84px)] lg:block", tint: "ink", o: 0.1 },
    { G: Gear, cls: "absolute right-[31%] bottom-[8%] hidden h-[clamp(54px,6vw,82px)] w-[clamp(54px,6vw,82px)] lg:block", tint: "ink", o: 0.1 },
  ],
};

export function HeroContours({
  theme,
  accent = "#FF7A2D",
  focus = "left",
}: {
  theme: ContourTheme;
  accent?: string;
  focus?: "left" | "center";
}) {
  const marks = SCENES[theme];
  const mask = focus === "center" ? MASK_CENTER : MASK_LEFT;
  return (
    <div
      aria-hidden="true"
      className="hero-contour pointer-events-none absolute inset-0 overflow-hidden"
      style={{ WebkitMaskImage: mask, maskImage: mask }}
    >
      {marks.map(({ G, cls, tint, o, drift }, i) => {
        const driftCls = drift === "fast" ? "hero-contour-drift" : drift === "slow" ? "hero-contour-drift hero-contour-drift--slow" : "";
        return (
          <G
            key={i}
            className={`${cls} ${driftCls}`}
            style={{ color: tint === "accent" ? accent : "#ffffff", opacity: Math.min(0.42, o * 1.5) }}
          />
        );
      })}
    </div>
  );
}
