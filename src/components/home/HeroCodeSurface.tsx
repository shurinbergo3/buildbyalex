/**
 * The surface revealed under the hero spotlight.
 *
 * Not a stock photo of code — the actual (lightly edited) source of this very
 * hero, hand-tokenised so it stays crisp at any DPI and tints to the brand
 * palette. Self-referential on purpose: "this is how the thing you're looking
 * at was built." Decorative only — hidden from a11y, no pointer events.
 */
export function HeroCodeSurface() {
  return (
    <div className="hero-code" aria-hidden="true">
      <pre className="hero-code-pre">
        <code>
          <L n={1}>
            <K>import</K> {"{ useTranslations }"} <K>from</K> <S>&quot;next-intl&quot;</S>
            <P>;</P>
          </L>
          <L n={2}>
            <K>import</K> {"{ Container }"} <K>from</K> <S>&quot;@/components/Container&quot;</S>
            <P>;</P>
          </L>
          <L n={3}> </L>
          <L n={4}>
            <C>{"// один человек — от первого звонка до релиза"}</C>
          </L>
          <L n={5}>
            <K>export function</K> <Fn>Hero</Fn>
            <P>() {"{"}</P>
          </L>
          <L n={6}>
            {"  "}
            <K>const</K> t <P>=</P> <Fn>useTranslations</Fn>
            <P>(</P>
            <S>&quot;home.hero&quot;</S>
            <P>);</P>
          </L>
          <L n={7}> </L>
          <L n={8}>
            {"  "}
            <K>return</K> <P>(</P>
          </L>
          <L n={9}>
            {"    "}
            <P>&lt;</P>
            <T>section</T> <A>className</A>
            <P>=</P>
            <S>&quot;hero-scroll&quot;</S>
            <P>&gt;</P>
          </L>
          <L n={10}>
            {"      "}
            <P>&lt;</P>
            <T>h1</T> <A>className</A>
            <P>=</P>
            <S>&quot;t-hero&quot;</S>
            <P>&gt;</P>
          </L>
          <L n={11}>
            {"        "}
            <S>Продакшн-сайты, AI-агенты</S>
          </L>
          <L n={12}>
            {"        "}
            <S>и мобильные приложения.</S>
          </L>
          <L n={13}>
            {"        "}
            <P>&lt;</P>
            <T>span</T> <A>className</A>
            <P>=</P>
            <S>&quot;hl-accent&quot;</S>
            <P>&gt;</P>
            <Acc>За 1–3 недели.</Acc>
            <P>&lt;/</P>
            <T>span</T>
            <P>&gt;</P>
          </L>
          <L n={14}>
            {"      "}
            <P>&lt;/</P>
            <T>h1</T>
            <P>&gt;</P>
          </L>
          <L n={15}> </L>
          <L n={16}>
            {"      "}
            <P>&lt;</P>
            <T>Button</T> <A>href</A>
            <P>=</P>
            <S>&quot;/contact&quot;</S> <A>size</A>
            <P>=</P>
            <S>&quot;lg&quot;</S>
            <P>&gt;</P>
          </L>
          <L n={17}>
            {"        {"}
            <Fn>t</Fn>
            <P>(</P>
            <S>&quot;primaryCta&quot;</S>
            <P>{")}"}</P>
          </L>
          <L n={18}>
            {"      "}
            <P>&lt;/</P>
            <T>Button</T>
            <P>&gt;</P>
          </L>
          <L n={19}>
            {"    "}
            <P>&lt;/</P>
            <T>section</T>
            <P>&gt;</P>
          </L>
          <L n={20}>
            {"  "}
            <P>);</P>
          </L>
          <L n={21}>
            <P>{"}"}</P>
          </L>
          <L n={22}> </L>
          <L n={23}>
            <C>{"// ● Live · Warsaw — shipped, not staged"}</C>
          </L>
        </code>
      </pre>
    </div>
  );
}

/* ── tiny token helpers — keep the JSX above readable ── */
function L({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <span className="hcl">
      <span className="hcl-n">{n}</span>
      <span className="hcl-t">{children}</span>
    </span>
  );
}
const K = ({ children }: { children: React.ReactNode }) => <span className="t-kw">{children}</span>;
const Fn = ({ children }: { children: React.ReactNode }) => <span className="t-fn">{children}</span>;
const S = ({ children }: { children: React.ReactNode }) => <span className="t-str">{children}</span>;
const T = ({ children }: { children: React.ReactNode }) => <span className="t-tag">{children}</span>;
const A = ({ children }: { children: React.ReactNode }) => <span className="t-attr">{children}</span>;
const P = ({ children }: { children: React.ReactNode }) => <span className="t-pun">{children}</span>;
const C = ({ children }: { children: React.ReactNode }) => <span className="t-com">{children}</span>;
const Acc = ({ children }: { children: React.ReactNode }) => <span className="t-acc">{children}</span>;
