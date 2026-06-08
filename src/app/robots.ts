import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Utility / no-index routes — kept out of every crawler's reach.
const disallow = [
  "/api/",
  "/*/contact/thank-you",
  "/*/kontakt/dziekuje",
  "/*/kontakt/dyakuyu",
  "/*/kontakty/spasibo",
];

// AI assistant / answer-engine crawlers we explicitly welcome, so the site can
// be discovered and cited by ChatGPT, Gemini, Perplexity, Claude, etc. The
// wildcard rule already allows them, but naming them is an explicit "you may
// use this" signal and guards against a future "*" tightening locking them out.
const aiBots = [
  "GPTBot", // OpenAI — model training
  "OAI-SearchBot", // OpenAI — ChatGPT search index
  "ChatGPT-User", // OpenAI — ChatGPT live browsing
  "PerplexityBot", // Perplexity — search index
  "Perplexity-User", // Perplexity — live fetch on user request
  "Google-Extended", // Gemini / Vertex grounding & training
  "Applebot-Extended", // Apple Intelligence
  "ClaudeBot", // Anthropic — crawl
  "Claude-Web", // Anthropic — live browsing
  "anthropic-ai", // Anthropic — legacy UA
  "CCBot", // Common Crawl — feeds many LLM training sets
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
