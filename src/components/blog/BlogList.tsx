"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export type BlogListItem = {
  slug: string;
  title: string;
  description: string;
  dateLabel: string;
  dateTime: string;
  readingLabel: string;
  image: string | null;
  category: string | null;
};

type Category = { key: string; label: string };

export function BlogList({
  posts,
  categories,
  allLabel,
  filterLabel,
}: {
  posts: BlogListItem[];
  categories: Category[];
  allLabel: string;
  filterLabel: string;
}) {
  const [active, setActive] = useState<string>("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of posts) if (p.category) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [posts]);

  const filtered = active === "all" ? posts : posts.filter((p) => p.category === active);

  const chip = (key: string, label: string, count: number) => {
    const on = active === key;
    return (
      <button
        key={key}
        type="button"
        role="tab"
        aria-selected={on}
        onClick={() => setActive(key)}
        className={[
          "shrink-0 rounded-full border px-4 py-1.5 text-[13.5px] font-medium tracking-[-0.006em] transition-colors",
          on
            ? "border-transparent bg-[color:var(--c-accent)] text-white"
            : "border-[color:var(--c-hairline)] text-[color:var(--color-text-2)] hover:border-[color:var(--c-accent)] hover:text-[color:var(--c-accent-ink)] dark:hover:text-[color:var(--c-accent)]",
        ].join(" ")}
      >
        {label}
        <span className={on ? "ml-1.5 text-white/70" : "ml-1.5 text-[color:var(--color-text-3)]"}>
          {count}
        </span>
      </button>
    );
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label={filterLabel}
        className="-mx-4 mb-2 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
      >
        {chip("all", allLabel, posts.length)}
        {categories.map((c) => chip(c.key, c.label, counts[c.key] ?? 0))}
      </div>

      <ul className="divide-y divide-[color:var(--c-hairline)] border-y border-[color:var(--c-hairline)]">
        {filtered.map((p) => (
          <li key={p.slug}>
            <Link
              href={{ pathname: "/blog/[slug]", params: { slug: p.slug } }}
              className="group flex flex-col gap-4 py-7 transition-colors md:flex-row md:items-center md:gap-8 md:py-8"
            >
              {p.image && (
                <div className="order-first overflow-hidden rounded-xl border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)] md:order-last md:w-[224px] md:shrink-0">
                  <Image
                    src={p.image}
                    alt={p.title}
                    width={1200}
                    height={630}
                    sizes="(max-width: 768px) 100vw, 224px"
                    className="aspect-[1200/630] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <time
                dateTime={p.dateTime}
                className="shrink-0 font-mono text-[12.5px] tracking-[0.04em] text-[color:var(--color-text-3)] md:w-40"
              >
                {p.dateLabel}
              </time>
              <div className="flex-1">
                <h2 className="text-[clamp(20px,1.6vw+12px,26px)] font-semibold tracking-[-0.018em] leading-[1.25] transition-colors group-hover:text-[color:var(--c-accent-ink)] dark:group-hover:text-[color:var(--c-accent)]">
                  {p.title}
                </h2>
                <p className="mt-2 text-[15.5px] leading-[1.55] text-[color:var(--color-text-2)]">
                  {p.description}
                </p>
                <p className="mt-3 text-[12.5px] tracking-[0.02em] text-[color:var(--color-text-3)]">
                  {p.readingLabel}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
