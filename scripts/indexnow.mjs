#!/usr/bin/env node
// IndexNow submitter — pings Bing/Yandex (and any IndexNow partner) that the
// given URLs changed, so they re-crawl quickly. ChatGPT search also leans on
// Bing's index, so this helps AI discovery too.
//
// Two rules this script exists to enforce:
//
//   1. Never submit a post that isn't live yet. Posts carry a frontmatter date
//      and stay hidden (404) until that day — see getAllPosts() in lib/blog.ts.
//      Submitting a queued post hands Bing a 404 and it stops coming back.
//   2. Never submit a redirect. The default locale (ru) is served unprefixed
//      ("as-needed"), so /ru/blog/x is a 307 to /blog/x. Only the final URL counts.
//
// Also: submit ONLY pages whose content actually changed. Blasting the whole
// sitemap on every deploy gets the key throttled.
//
// Usage:
//   node scripts/indexnow.mjs <url> [url...]           # explicit URLs
//   node scripts/indexnow.mjs --file changed.txt       # one URL per line
//   node scripts/indexnow.mjs --since HEAD~1           # posts changed since a git ref
//   node scripts/indexnow.mjs --today                  # posts going live today (daily cron)
//   node scripts/indexnow.mjs --live-since 2026-07-01  # backfill a date range
//   ... add --dry-run to print without sending

import { execSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const KEY = "651a30e89eaac746deaee9f96737b359";
const HOST = "buildbyalex.com";
const SITE = `https://${HOST}`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

const LOCALES = ["ru", "en", "pl", "ua"];
const DEFAULT_LOCALE = "ru";
const BLOG_DIR = "content/blog";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// UTC — the same clock lib/blog.ts uses to decide what's published.
const TODAY = new Date().toISOString().slice(0, 10);

function postUrl(locale, slug) {
  const seg = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return `${SITE}${seg}/blog/${slug}`;
}

function readDate(file) {
  try {
    const m = readFileSync(file, "utf8").match(/^date:\s*"?(\d{4}-\d{2}-\d{2})/m);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

// Every post on disk, with its publish date.
function allPosts() {
  const out = [];
  for (const locale of LOCALES) {
    const dir = path.join(ROOT, BLOG_DIR, locale);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!name.endsWith(".mdx")) continue;
      const slug = name.slice(0, -4);
      const date = readDate(path.join(dir, name));
      if (!date) continue;
      out.push({ locale, slug, date, url: postUrl(locale, slug) });
    }
  }
  return out;
}

function contentPathToPost(file) {
  const m = file.match(/^content\/blog\/(ru|en|pl|ua)\/(.+)\.mdx$/);
  if (!m) return null;
  const [, locale, slug] = m;
  const date = readDate(path.join(ROOT, file));
  return date ? { locale, slug, date, url: postUrl(locale, slug) } : null;
}

function fromGitSince(ref) {
  let out;
  try {
    out = execSync(`git diff --name-only ${ref} HEAD`, { encoding: "utf8", cwd: ROOT });
  } catch {
    console.error(`IndexNow: git ref "${ref}" unavailable, skipping.`);
    return [];
  }
  return out
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map(contentPathToPost)
    .filter(Boolean);
}

// A queued post is a 404 until its day. Hold it back — the daily --today run
// picks it up the morning it goes live.
function keepLive(posts) {
  const queued = posts.filter((p) => p.date > TODAY);
  if (queued.length) {
    console.log(
      `Holding back ${queued.length} post(s) not published yet — they go out on their own date.`,
    );
  }
  return posts.filter((p) => p.date <= TODAY);
}

function parse(argv) {
  const dryRun = argv.includes("--dry-run");
  const rest = argv.filter((a) => a !== "--dry-run");
  const mode = rest[0];

  let urls;
  if (mode === "--file") {
    urls = readFileSync(rest[1], "utf8")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("http"));
  } else if (mode === "--since") {
    urls = keepLive(fromGitSince(rest[1] ?? "HEAD~1")).map((p) => p.url);
  } else if (mode === "--today") {
    urls = allPosts()
      .filter((p) => p.date === TODAY)
      .map((p) => p.url);
  } else if (mode === "--live-since") {
    const from = rest[1];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(from ?? "")) {
      console.error("--live-since needs a YYYY-MM-DD date");
      process.exit(1);
    }
    urls = allPosts()
      .filter((p) => p.date >= from && p.date <= TODAY)
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .map((p) => p.url);
  } else {
    urls = rest.filter((a) => a.startsWith("http"));
  }

  return { urls: [...new Set(urls)], dryRun };
}

async function main() {
  const { urls, dryRun } = parse(process.argv.slice(2));

  if (urls.length === 0) {
    console.log("Nothing to submit.");
    return;
  }

  const bad = urls.filter((u) => !u.startsWith(SITE) || u.startsWith(`${SITE}/ru/`));
  if (bad.length) {
    console.error(`Refusing — not a canonical ${HOST} URL:\n${bad.join("\n")}`);
    process.exit(1);
  }

  console.log(`${dryRun ? "[dry-run] " : ""}Submitting ${urls.length} URL(s) to IndexNow:`);
  urls.forEach((u) => console.log("  " + u));
  if (dryRun) return;

  // 10 000 URLs per request is the protocol cap; chunk well under it.
  const chunks = [];
  for (let i = 0; i < urls.length; i += 500) chunks.push(urls.slice(i, i + 500));

  for (const [i, chunk] of chunks.entries()) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `${SITE}/${KEY}.txt`,
        urlList: chunk,
      }),
    });
    const body = await res.text();
    console.log(
      `Batch ${i + 1}/${chunks.length} (${chunk.length} URLs): HTTP ${res.status} ${body || "(ok)"}`,
    );
    if (res.status >= 400) process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
