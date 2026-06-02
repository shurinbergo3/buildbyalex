import { handleUpdate } from "@/lib/telegram";

// Node runtime — the bot reads/writes the file-based store.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Telegram webhook endpoint.
 *
 * Telegram delivers updates here via POST. We verify the secret token that
 * Telegram echoes in the `X-Telegram-Bot-Api-Secret-Token` header (set when the
 * webhook is registered), then hand the update to the bot logic.
 *
 * Always returns 200 quickly so Telegram doesn't retry — errors are logged.
 */
export async function POST(req: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  if (secret) {
    const got = req.headers.get("x-telegram-bot-api-secret-token");
    if (got !== secret) {
      return new Response("forbidden", { status: 403 });
    }
  }

  let update: unknown;
  try {
    update = await req.json();
  } catch {
    return Response.json({ ok: true });
  }

  try {
    await handleUpdate(update as Parameters<typeof handleUpdate>[0]);
  } catch (err) {
    console.error("[telegram webhook] error", err);
  }

  return Response.json({ ok: true });
}

// Lightweight health check for manual verification in the browser.
export function GET() {
  return Response.json({ ok: true, service: "telegram-webhook" });
}
