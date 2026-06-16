#!/usr/bin/env node
// IndexNow submitter — pings Bing/Yandex (and any IndexNow partner) that the
// given URLs changed, so they re-crawl quickly. ChatGPT search also leans on
// Bing's index, so this helps AI discovery too.
//
// IMPORTANT: submit ONLY pages whose content actually changed (new post,
// edited copy, new service). Do NOT blast the whole sitemap on every deploy —
// repeatedly re-submitting unchanged URLs is treated as spam and gets the key
// throttled or ignored.
//
// Usage:
//   node scripts/indexnow.mjs <url> [url...]          # explicit URLs
//   node scripts/indexnow.mjs --file changed.txt      # one URL per line
//   node scripts/indexnow.mjs --since HEAD~1          # URLs from changed .mdx since a git ref
//
// Examples:
//   node scripts/indexnow.mjs https://buildbyalex.com/ru/blog/novaya-statya
//   node scripts/indexnow.mjs --since HEAD~1

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const KEY = "651a30e89eaac746deaee9f96737b359";
const HOST = "buildbyalex.com";
const SITE = `https://${HOST}`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

function fromArgsExplicit(args) {
  return args.filter((a) => a.startsWith("http"));
}

function fromFile(path) {
  return readFileSync(path, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("http"));
}

// Map a changed content file (e.g. content/blog/en/foo.mdx) → its public URL.
function contentPathToUrl(file) {
  const m = file.match(/^content\/blog\/(ru|en|pl|ua)\/(.+)\.mdx$/);
  if (m) return `${SITE}/${m[1]}/blog/${m[2]}`;
  return null;
}

// Discover changed blog URLs from git since a ref. Static/service pages live in
// localized routes that aren't 1:1 with files, so for those pass URLs explicitly.
function fromGitSince(ref) {
  const out = execSync(`git diff --name-only ${ref} HEAD`, { encoding: "utf8" });
  const urls = [];
  for (const file of out.split("\n").map((l) => l.trim()).filter(Boolean)) {
    const url = contentPathToUrl(file);
    if (url) urls.push(url);
  }
  return urls;
}

function parse(argv) {
  if (argv[0] === "--file") return fromFile(argv[1]);
  if (argv[0] === "--since") return fromGitSince(argv[1] ?? "HEAD~1");
  return fromArgsExplicit(argv);
}

async function main() {
  const urls = [...new Set(parse(process.argv.slice(2)))];

  if (urls.length === 0) {
    console.error(
      "No URLs to submit.\n" +
        "  node scripts/indexnow.mjs <url> [url...]\n" +
        "  node scripts/indexnow.mjs --file changed.txt\n" +
        "  node scripts/indexnow.mjs --since HEAD~1",
    );
    process.exit(1);
  }

  const bad = urls.filter((u) => !u.startsWith(SITE));
  if (bad.length) {
    console.error(`Refusing — these URLs are not on ${HOST}:\n${bad.join("\n")}`);
    process.exit(1);
  }

  console.log(`Submitting ${urls.length} URL(s) to IndexNow:`);
  urls.forEach((u) => console.log("  " + u));

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList: urls,
    }),
  });

  // 200 / 202 = accepted. 422 = key/host mismatch. 429 = throttled (too frequent).
  const body = await res.text();
  console.log(`\nIndexNow responded: HTTP ${res.status} ${body || "(ok)"}`);
  if (res.status >= 400) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
