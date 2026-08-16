# buildbyalex.com

Personal site of Alex — independent senior fullstack developer based in Warsaw. Built with Next.js 15, fully multilingual (RU / EN / PL / UA), with technical SEO and GEO baked in.

---

## Stack

- **Next.js 15** (App Router, React Server Components)
- **TypeScript** strict
- **Tailwind CSS v4** + `@tailwindcss/typography`
- **next-intl 3.x** for i18n (typed `pathnames`, localized URLs)
- **next-mdx-remote** for the blog (RSC-rendered MDX)
- **Motion** for animation (used sparingly)
- **Yandex.Metrika** for analytics
- Deploy target: **self-hosted Docker** (GitHub Actions → ghcr.io → Dokploy)

## Languages and routing

Locales: `ru` (default), `en`, `pl`, `ua`. Locale prefixes are always present in the URL.

Each route has a localized slug in [`src/i18n/routing.ts`](src/i18n/routing.ts) — e.g. `/ru/obo-mne`, `/en/about`, `/pl/o-mnie`, `/ua/pro-mene`. Always link via `Link` / `useRouter` from `@/i18n/navigation` so next-intl resolves the locale-specific path automatically.

`hreflang` and `canonical` are generated centrally in [`src/lib/metadata.ts`](src/lib/metadata.ts) via `buildLocalizedMetadata()` — pass a logical pathname like `/services/ai-agents` and the helper fills the rest from `routing.pathnames`.

## Local development

```bash
# 1. Install
npm install

# 2. Configure env (see below)
cp .env.example .env.local

# 3. Run
npm run dev
# → http://localhost:3000 (redirects to /ru)
```

Other scripts:

```bash
npm run build      # Production build, generates sitemap.xml and robots.txt
npm run start      # Run the production build locally
npm run lint       # ESLint
npm run type-check # tsc --noEmit
```

> **If you hit a `Cannot find module './vendor-chunks/...'` after running both `build` and `dev`**, delete `.next` and restart: `rm -rf .next && npm run dev`. Dev and production builds share the same folder.

## Environment variables

All required-for-features variables are documented in [`.env.example`](.env.example). Nothing is required for the site to *render* — only specific features need their env vars.

| Variable | Required for | Notes |
|---|---|---|
| `SITE_URL` | Sitemap, OG, canonical URLs | Defaults to `https://buildbyalex.com` |
| `DATA_DIR` | Leads / reviews storage | Set to `/app/data` by the image; mount a volume there or submissions die with the container |
| `TELEGRAM_BOT_TOKEN` | Lead + review delivery | |
| `ADMIN_CHAT_ID` | Lead + review delivery | Numeric Telegram ID; the only account the bot answers. `TELEGRAM_CHAT_ID` still works as a legacy alias |
| `TELEGRAM_WEBHOOK_SECRET` | Telegram bot webhook | Without it `/api/telegram/webhook` rejects everything — fail-closed on purpose |
| `TRUSTED_PROXY_HOPS` | Rate-limit accuracy | Number of proxies in front of the app. Defaults to `1` (Dokploy's Traefik); behind Cloudflare + Traefik set `2` |
| `UPSTASH_REDIS_REST_URL` | Shared rate-limit + dedupe | **Optional** — without it the limiter falls back to an in-process counter, which is per-container and resets on redeploy |
| `UPSTASH_REDIS_REST_TOKEN` | Shared rate-limit + dedupe | **Optional** |
| `GOOGLE_SITE_VERIFICATION` | Search Console | **Optional** — has a baked-in default |
| `YANDEX_VERIFICATION` / `BING_SITE_VERIFICATION` | Webmaster tools | **Optional** |

Set these in Dokploy → Application → Environment.

## Project structure

```
buildbyalex/
├── content/blog/           # MDX blog posts, organized by locale
│   ├── ru/                 # Russian posts
│   ├── en/                 # English posts
│   ├── pl/                 # Polish posts
│   └── ua/                 # Ukrainian posts
├── messages/               # next-intl translations
│   ├── ru.json             # ← default locale
│   ├── en.json
│   ├── pl.json
│   └── ua.json
├── public/
│   ├── llms.txt            # GEO: machine-readable site summary for AI search
│   └── …
├── src/
│   ├── app/
│   │   ├── [locale]/       # All user-facing pages live here
│   │   │   ├── layout.tsx  # Root layout, sets html lang, theme cookie, providers
│   │   │   ├── page.tsx    # Homepage
│   │   │   ├── about/      # /about (localized: /obo-mne, /o-mnie, …)
│   │   │   ├── services/   # /services + /services/{websites,ai-agents,mobile-apps}
│   │   │   ├── work/       # /work + /work/[slug] (case studies)
│   │   │   ├── blog/       # /blog + /blog/[slug] (MDX)
│   │   │   ├── contact/    # /contact + /contact/thank-you
│   │   │   ├── not-found.tsx
│   │   │   └── opengraph-image.tsx  # Dynamic OG per locale via next/og
│   │   ├── api/
│   │   │   └── contact/    # Edge API route for the contact form
│   │   ├── sitemap.ts      # Dynamic sitemap.xml
│   │   ├── robots.ts       # Dynamic robots.txt
│   │   └── globals.css     # Design tokens + Tailwind v4 config
│   ├── components/
│   │   ├── home/           # Homepage sections (Hero, Services, FAQ, …)
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Logo.tsx
│   │   ├── ThemeProvider.tsx   # Cookie-backed light/dark
│   │   ├── ContactForm.tsx
│   │   ├── ServicePageTemplate.tsx
│   │   └── …
│   ├── i18n/
│   │   ├── routing.ts      # Locales + localized pathnames
│   │   ├── request.ts      # Server-side message loading
│   │   └── navigation.ts   # Locale-aware Link / useRouter
│   ├── lib/
│   │   ├── blog.ts         # MDX file reader + frontmatter
│   │   ├── cases.ts        # Case-study slug ↔ key map + images
│   │   ├── metadata.ts     # buildLocalizedMetadata() — canonical + hreflang
│   │   ├── site.ts         # SITE_URL helpers
│   │   └── utils.ts        # cn()
│   └── middleware.ts       # next-intl locale routing
```

## How to…

### Add a new blog post

1. Pick a `cluster` ID — a stable identifier shared across language versions of the same post (e.g. `website-cost-poland-2025`). Used to wire up hreflang between translations later.
2. Create the file in the locale's folder, with a localized slug:

```bash
# Russian version
content/blog/ru/{slug-on-russian}.mdx

# Optional translations
content/blog/en/{slug-in-english}.mdx
content/blog/pl/{slug-po-polsku}.mdx
content/blog/ua/{slug-ukr}.mdx
```

3. Frontmatter:

```yaml
---
title: "Post title"
description: "150–160 character meta description."
date: "2025-05-01"
cluster: "shared-id-across-locales"
keywords: ["keyword 1", "keyword 2"]
ogImage: "/og/optional-static-image.png"   # leave out to use the dynamic locale OG
---
```

4. Body in standard Markdown / MDX. Supports GFM tables, `>` blockquotes, code, links. The post is automatically:
   - Added to `/blog` index for that locale (newest first).
   - Picked up by `/sitemap.xml`.
   - Given `Article` JSON-LD schema and reading-time estimate.
   - Rendered with the typography system from [`src/app/[locale]/blog/[slug]/page.tsx`](src/app/[locale]/blog/[slug]/page.tsx).

### Add a new case study

1. Add the translated content to all four `messages/*.json` under `work.cases.{key}` (industry, title, tagline, problem, solution, results, stack, url, quote, quoteAuthor).
2. Add the slug↔key mapping in [`src/lib/cases.ts`](src/lib/cases.ts) — pick a URL-safe slug:

```ts
export const caseSlugs: CaseKey[] = ["legalwin", "visionair", "crmbot", "newcase"];
export const caseSlugToKey = { …, "new-case": "newcase" };
export const caseKeyToSlug = { …, newcase: "new-case" };
export const caseImages = { …, newcase: { src: "…", alt: "…" } };
```

3. Add the case to the homepage's `FeaturedWork` if it should be promoted.

### Add a new service page

1. Add a `services.{branchKey}` block to all four `messages/*.json` (see the existing `websites` / `ai` / `mobile` for the schema).
2. Add a new pathname in [`src/i18n/routing.ts`](src/i18n/routing.ts) with localized slugs.
3. Create `src/app/[locale]/services/{branch}/page.tsx` — copy one of the existing ones and change the branch and metadata namespace.

### Deploy

Push to `main` — [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) does the rest:

```
git push origin main
  → docker buildx build (Dockerfile, multi-stage, standalone output)
  → push ghcr.io/shurinbergo3/buildbyalex:latest + :<sha>
  → GET the Dokploy webhook, which pulls the new image and restarts
  → submit blog URLs changed in this push to IndexNow
```

Repository secrets the workflow needs:

| Secret | Purpose |
|---|---|
| `DOKPLOY_WEBHOOK` | Redeploy trigger. Without it the image is pushed but the server keeps the old one |
| `DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN` | **Optional** — only lifts the anonymous pull rate limit on the buildkit image. The step self-skips when unset |

`GITHUB_TOKEN` is provided automatically and is what authenticates the ghcr.io push.

Two things to keep in sync, both of which have broken the build before:

- **`package-lock.json` must satisfy `npm ci`, not just `npm install`.** A lock with missing transitive entries (this bit us with `@emnapi/*`) installs fine locally and then dies in the image with `Missing: ... from lock file`. After any dependency change run `npm ci` locally — it is the same strict check the build does.
- **`DATA_DIR` needs a mounted volume.** It defaults to `/app/data` inside the container; without a volume every redeploy wipes stored leads and reviews.

Run the production image locally the same way the server does:

```bash
docker build -t buildbyalex .
docker run --rm -p 3000:3000 -e SITE_URL=http://localhost:3000 buildbyalex
```

After deploy:

1. **Submit the sitemap** to Google Search Console at `https://buildbyalex.com/sitemap.xml`.
2. **Verify the domain** in GSC — when Google gives you a `google-site-verification` meta tag, add it to the root `<head>` via the `verification` field in the `generateMetadata` of [`src/app/[locale]/layout.tsx`](src/app/[locale]/layout.tsx):
   ```ts
   verification: { google: "your-verification-string" }
   ```
3. **Test rich results** for any case study or blog post at [search.google.com/test/rich-results](https://search.google.com/test/rich-results).

## SEO and GEO at a glance

- **Sitemap** ([`src/app/sitemap.ts`](src/app/sitemap.ts)) lists every page in every locale with `alternates.languages` for hreflang.
- **Robots** ([`src/app/robots.ts`](src/app/robots.ts)) allows everything except `/api/` and thank-you pages.
- **Canonical + hreflang** on every page via `buildLocalizedMetadata()`. `x-default` always points to the `ru` version.
- **JSON-LD schemas** present:
  - `FAQPage` on the homepage FAQ and on every service page.
  - `Article` on every blog post and case study.
  - `Person` on `/about`.
- **Dynamic OG image** generated per locale by [`src/app/[locale]/opengraph-image.tsx`](src/app/[locale]/opengraph-image.tsx) (edge runtime, 1200×630).
- **`llms.txt`** at [`public/llms.txt`](public/llms.txt) — structured plain text for AI search engines (ChatGPT / Perplexity / Gemini).

## Design system

Tokens, type scale, motion easings and spacing all live as CSS variables at the top of [`src/app/globals.css`](src/app/globals.css). Components consume them via `var(--color-…)`, never hardcoded values.

Key choices:

- **Geist** (variable font, `next/font`) for Latin and Latin-Ext. Cyrillic falls through to SF Pro / system stack per-glyph.
- **One accent color** — warm amber `#FF6B1A` — used only for CTAs and key highlights. No purple gradients, no AI-look.
- **Apple-style easings**: `cubic-bezier(0.28, 0.11, 0.32, 1)` for hover, `cubic-bezier(0.16, 1, 0.3, 1)` for entrances.
- **`prefers-reduced-motion`** disables all animations globally via CSS — no per-component handling required.

## Accessibility

- Skip-to-content link on every page.
- Visible focus rings (amber, 2px, 3px offset) on all interactive elements.
- `aria-label` on every icon-only button.
- Semantic heading hierarchy preserved across pages.
- Keyboard-operable accordion, mobile menu, locale switcher.
- WCAG AA contrast on all text/background pairs in both light and dark themes.

## License

All code in this repo is the property of buildbyalex. Content (blog posts, case studies, copy) — same. Don't redistribute without permission.
