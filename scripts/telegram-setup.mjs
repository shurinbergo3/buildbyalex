#!/usr/bin/env node
/**
 * One-time Telegram bot setup: registers the webhook and the command menu.
 *
 * Usage (run once, after the site is deployed on its public HTTPS domain):
 *
 *   TELEGRAM_BOT_TOKEN=xxx \
 *   TELEGRAM_WEBHOOK_SECRET=yyy \
 *   SITE_URL=https://buildbyalex.com \
 *   node scripts/telegram-setup.mjs
 *
 * Re-run any time you change the domain or secret. Pass `delete` as the first
 * arg to remove the webhook (switch back to manual / polling):
 *
 *   TELEGRAM_BOT_TOKEN=xxx node scripts/telegram-setup.mjs delete
 */

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
const siteUrl = (process.env.SITE_URL || "https://buildbyalex.com").replace(/\/$/, "");

if (!token) {
  console.error("✗ TELEGRAM_BOT_TOKEN is required");
  process.exit(1);
}

if (!secret && process.argv[2] !== "delete") {
  console.error(
    "✗ TELEGRAM_WEBHOOK_SECRET is required — the webhook endpoint rejects updates without it"
  );
  process.exit(1);
}

const api = (method) => `https://api.telegram.org/bot${token}/${method}`;

async function call(method, body) {
  const res = await fetch(api(method), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`${method}: ${JSON.stringify(data)}`);
  return data.result;
}

async function setCommands() {
  await call("setMyCommands", {
    commands: [
      { command: "start", description: "Меню" },
      { command: "leads", description: "📋 Заявки" },
      { command: "reviews", description: "⭐ Отзывы" },
      { command: "stats", description: "📊 Статистика" },
    ],
  });
  console.log("✓ Команды бота установлены");
}

async function main() {
  if (process.argv[2] === "delete") {
    await call("deleteWebhook", { drop_pending_updates: false });
    console.log("✓ Webhook удалён");
    return;
  }

  const url = `${siteUrl}/api/telegram/webhook`;
  await call("setWebhook", {
    url,
    secret_token: secret,
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: true,
  });
  console.log(`✓ Webhook установлен → ${url}`);

  await setCommands();

  const info = await call("getWebhookInfo", {});
  console.log("ℹ getWebhookInfo:", JSON.stringify(info));
}

main().catch((err) => {
  console.error("✗", err.message);
  process.exit(1);
});
