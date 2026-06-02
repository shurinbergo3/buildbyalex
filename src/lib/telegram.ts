/**
 * Telegram bot layer: low-level API calls + the whole admin UI
 * (menus, history with pagination, lead/review cards, stats).
 *
 * Reused by both the form routes (instant notifications) and the webhook
 * (interactive menu). Node runtime only.
 */
import {
  getLead,
  getReview,
  getStats,
  listLeads,
  listReviews,
  setLeadStatus,
  setReviewStatus,
  type Lead,
  type Review,
  type Status,
} from "./store";

const API = (token: string, method: string) =>
  `https://api.telegram.org/bot${token}/${method}`;

export function botToken(): string | undefined {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || undefined;
}

/** The single admin allowed to talk to the bot. */
export function adminChatId(): string | undefined {
  // ADMIN_CHAT_ID is the new name; TELEGRAM_CHAT_ID kept for backwards-compat.
  return (
    process.env.ADMIN_CHAT_ID?.trim() ||
    process.env.TELEGRAM_CHAT_ID?.trim() ||
    undefined
  );
}

export function isAdmin(id: number | string | undefined): boolean {
  const admin = adminChatId();
  return !!admin && String(id) === admin;
}

export function escape(s: string): string {
  return s.replace(
    /[<>&]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!,
  );
}

// ---- low-level API ---------------------------------------------------------

type Json = Record<string, unknown>;

async function call(method: string, params: Json): Promise<Response | null> {
  const token = botToken();
  if (!token) {
    console.warn(`[telegram] ${method}: TELEGRAM_BOT_TOKEN not configured`);
    return null;
  }
  try {
    return await fetch(API(token, method), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  } catch (err) {
    console.error(`[telegram] ${method} failed`, err);
    return null;
  }
}

export type InlineButton = { text: string; callback_data: string };
export type InlineKeyboard = InlineButton[][];

export async function sendMessage(
  chatId: string | number,
  text: string,
  keyboard?: InlineKeyboard,
): Promise<boolean> {
  const res = await call("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    ...(keyboard ? { reply_markup: { inline_keyboard: keyboard } } : {}),
  });
  return !!res?.ok;
}

async function editMessage(
  chatId: string | number,
  messageId: number,
  text: string,
  keyboard?: InlineKeyboard,
): Promise<boolean> {
  const res = await call("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    ...(keyboard ? { reply_markup: { inline_keyboard: keyboard } } : {}),
  });
  return !!res?.ok;
}

async function answerCallback(id: string, text?: string): Promise<void> {
  await call("answerCallbackQuery", {
    callback_query_id: id,
    ...(text ? { text } : {}),
  });
}

/** Render either as a new message or by editing an existing one. */
async function render(
  chatId: string | number,
  messageId: number | undefined,
  text: string,
  keyboard?: InlineKeyboard,
): Promise<void> {
  if (messageId) await editMessage(chatId, messageId, text, keyboard);
  else await sendMessage(chatId, text, keyboard);
}

// ---- formatting helpers ----------------------------------------------------

const STATUS_LABEL: Record<Status, string> = {
  new: "🟢 Новая",
  in_progress: "🟡 В работе",
  done: "✅ Готово",
};
const REVIEW_STATUS_LABEL: Record<Status, string> = {
  new: "🟢 Новый",
  in_progress: "🟡 Просмотрен",
  done: "✅ Опубликован",
};

const TYPE_LABEL: Record<string, string> = {
  website: "Сайт",
  ai: "AI-агент",
  mobile: "Мобильное приложение",
  other: "Другое",
};
const BUDGET_LABEL: Record<string, string> = {
  under1k: "до €1k",
  to3k: "€1k–3k",
  to10k: "€3k–10k",
  over10k: "€10k+",
  unknown: "не указан",
};

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Warsaw",
  });
}

function fmtType(t?: string): string {
  if (!t) return "—";
  return TYPE_LABEL[t] ?? t;
}
function fmtBudget(b?: string): string {
  if (!b) return "—";
  return BUDGET_LABEL[b] ?? b;
}

export function formatLead(lead: Lead): string {
  return [
    `🟢 <b>Заявка #${lead.id}</b> · ${STATUS_LABEL[lead.status]}`,
    `<i>${fmtDate(lead.createdAt)}</i>`,
    ``,
    `<b>Имя:</b> ${escape(lead.name)}`,
    `<b>Email:</b> ${escape(lead.email)}`,
    lead.phone ? `<b>Телефон:</b> ${escape(lead.phone)}` : null,
    lead.company ? `<b>Компания:</b> ${escape(lead.company)}` : null,
    `<b>Услуга:</b> ${escape(fmtType(lead.type))}`,
    `<b>Бюджет:</b> ${escape(fmtBudget(lead.budget))}`,
    `<b>Язык:</b> ${escape(lead.locale)}`,
    ``,
    `<b>Сообщение:</b>`,
    escape(lead.description),
  ]
    .filter((x) => x !== null)
    .join("\n");
}

export function formatReview(r: Review): string {
  const stars = "★".repeat(Math.round(r.rating)) + "☆".repeat(5 - Math.round(r.rating));
  return [
    `⭐ <b>Отзыв #${r.id}</b> · ${REVIEW_STATUS_LABEL[r.status]}`,
    `<i>${fmtDate(r.createdAt)}</i>`,
    ``,
    `<b>Оценка:</b> ${stars} (${r.rating}/5)`,
    `<b>Имя:</b> ${escape(r.name)}`,
    r.role ? `<b>Роль:</b> ${escape(r.role)}` : null,
    `<b>Язык:</b> ${escape(r.locale)}`,
    ``,
    `<b>Текст:</b>`,
    escape(r.quote),
  ]
    .filter((x) => x !== null)
    .join("\n");
}

// ---- keyboards -------------------------------------------------------------

// Callback data is capped at 64 bytes — keep tokens short.
//   m              → main menu
//   L|p|<page>|<f> → leads list page (f = "n" only-new | "a" all)
//   L|v|<id>       → view lead
//   L|s|<id>|<st>  → set lead status
//   R|p|<page>|<f> → reviews list
//   R|v|<id>       → view review
//   R|s|<id>|<st>  → set review status
//   st             → stats

const leadDetailKeyboard = (lead: Lead): InlineKeyboard => [
  [
    { text: "🟡 В работу", callback_data: `L|s|${lead.id}|in_progress` },
    { text: "✅ Готово", callback_data: `L|s|${lead.id}|done` },
  ],
  ...(lead.status !== "new"
    ? [[{ text: "↩️ Вернуть в новые", callback_data: `L|s|${lead.id}|new` }]]
    : []),
  [
    { text: "⬅️ К списку", callback_data: `L|p|0|a` },
    { text: "🏠 Меню", callback_data: "m" },
  ],
];

const reviewDetailKeyboard = (r: Review): InlineKeyboard => [
  [
    { text: "👁 Просмотрен", callback_data: `R|s|${r.id}|in_progress` },
    { text: "✅ Опубликован", callback_data: `R|s|${r.id}|done` },
  ],
  ...(r.status !== "new"
    ? [[{ text: "↩️ Вернуть в новые", callback_data: `R|s|${r.id}|new` }]]
    : []),
  [
    { text: "⬅️ К списку", callback_data: `R|p|0|a` },
    { text: "🏠 Меню", callback_data: "m" },
  ],
];

// ---- views -----------------------------------------------------------------

export async function viewMenu(
  chatId: string | number,
  messageId?: number,
): Promise<void> {
  const s = await getStats();
  const text = [
    `🏠 <b>buildbyalex — панель</b>`,
    ``,
    `📥 Заявки: <b>${s.leads.total}</b>  (новых: ${s.leads.new}, в работе: ${s.leads.in_progress})`,
    `⭐ Отзывы: <b>${s.reviews.total}</b>  (новых: ${s.reviews.new}, ср. оценка: ${s.reviews.avgRating || "—"})`,
    ``,
    `<i>За 7 дней: ${s.leads.last7} заявок, ${s.reviews.last7} отзывов.</i>`,
  ].join("\n");
  const keyboard: InlineKeyboard = [
    [
      { text: `📋 Заявки (${s.leads.total})`, callback_data: "L|p|0|a" },
      { text: `⭐ Отзывы (${s.reviews.total})`, callback_data: "R|p|0|a" },
    ],
    ...(s.leads.new > 0
      ? [[{ text: `🟢 Новые заявки (${s.leads.new})`, callback_data: "L|p|0|n" }]]
      : []),
    [
      { text: "📊 Статистика", callback_data: "st" },
      { text: "🔄 Обновить", callback_data: "m" },
    ],
  ];
  await render(chatId, messageId, text, keyboard);
}

const PAGE_SIZE = 6;

export async function viewLeads(
  chatId: string | number,
  page: number,
  onlyNew: boolean,
  messageId?: number,
): Promise<void> {
  const res = await listLeads({ page, pageSize: PAGE_SIZE, onlyNew });
  const filterLabel = onlyNew ? "🟢 только новые" : "все";
  const header =
    res.total === 0
      ? `📋 <b>Заявки</b>\n\n${onlyNew ? "Новых заявок нет." : "Заявок пока нет."}`
      : `📋 <b>Заявки</b> · ${filterLabel}\nВсего: ${res.total} · стр. ${res.page + 1}/${res.pages}`;

  const rows: InlineKeyboard = res.items.map((l) => [
    {
      text: `${STATUS_LABEL[l.status].slice(0, 2)} #${l.id} · ${l.name} · ${fmtType(l.type)}`.slice(
        0,
        60,
      ),
      callback_data: `L|v|${l.id}`,
    },
  ]);

  const nav: InlineButton[] = [];
  if (res.page > 0)
    nav.push({ text: "◀️", callback_data: `L|p|${res.page - 1}|${onlyNew ? "n" : "a"}` });
  if (res.page < res.pages - 1)
    nav.push({ text: "▶️", callback_data: `L|p|${res.page + 1}|${onlyNew ? "n" : "a"}` });
  if (nav.length) rows.push(nav);

  rows.push([
    onlyNew
      ? { text: "Показать все", callback_data: "L|p|0|a" }
      : { text: "Только новые", callback_data: "L|p|0|n" },
    { text: "🏠 Меню", callback_data: "m" },
  ]);

  await render(chatId, messageId, header, rows);
}

export async function viewReviews(
  chatId: string | number,
  page: number,
  onlyNew: boolean,
  messageId?: number,
): Promise<void> {
  const res = await listReviews({ page, pageSize: PAGE_SIZE, onlyNew });
  const filterLabel = onlyNew ? "🟢 только новые" : "все";
  const header =
    res.total === 0
      ? `⭐ <b>Отзывы</b>\n\n${onlyNew ? "Новых отзывов нет." : "Отзывов пока нет."}`
      : `⭐ <b>Отзывы</b> · ${filterLabel}\nВсего: ${res.total} · стр. ${res.page + 1}/${res.pages}`;

  const rows: InlineKeyboard = res.items.map((r) => [
    {
      text: `${"★".repeat(Math.round(r.rating))} #${r.id} · ${r.name}`.slice(0, 60),
      callback_data: `R|v|${r.id}`,
    },
  ]);

  const nav: InlineButton[] = [];
  if (res.page > 0)
    nav.push({ text: "◀️", callback_data: `R|p|${res.page - 1}|${onlyNew ? "n" : "a"}` });
  if (res.page < res.pages - 1)
    nav.push({ text: "▶️", callback_data: `R|p|${res.page + 1}|${onlyNew ? "n" : "a"}` });
  if (nav.length) rows.push(nav);

  rows.push([
    onlyNew
      ? { text: "Показать все", callback_data: "R|p|0|a" }
      : { text: "Только новые", callback_data: "R|p|0|n" },
    { text: "🏠 Меню", callback_data: "m" },
  ]);

  await render(chatId, messageId, header, rows);
}

export async function viewLead(
  chatId: string | number,
  id: number,
  messageId?: number,
): Promise<void> {
  const lead = await getLead(id);
  if (!lead) {
    await render(chatId, messageId, `Заявка #${id} не найдена.`, [
      [{ text: "🏠 Меню", callback_data: "m" }],
    ]);
    return;
  }
  await render(chatId, messageId, formatLead(lead), leadDetailKeyboard(lead));
}

export async function viewReview(
  chatId: string | number,
  id: number,
  messageId?: number,
): Promise<void> {
  const r = await getReview(id);
  if (!r) {
    await render(chatId, messageId, `Отзыв #${id} не найден.`, [
      [{ text: "🏠 Меню", callback_data: "m" }],
    ]);
    return;
  }
  await render(chatId, messageId, formatReview(r), reviewDetailKeyboard(r));
}

export async function viewStats(
  chatId: string | number,
  messageId?: number,
): Promise<void> {
  const s = await getStats();
  const text = [
    `📊 <b>Статистика</b>`,
    ``,
    `<b>Заявки</b>`,
    `• Всего: ${s.leads.total}`,
    `• 🟢 Новые: ${s.leads.new}`,
    `• 🟡 В работе: ${s.leads.in_progress}`,
    `• ✅ Готово: ${s.leads.done}`,
    `• За 7 дней: ${s.leads.last7}`,
    ``,
    `<b>Отзывы</b>`,
    `• Всего: ${s.reviews.total}`,
    `• 🟢 Новые: ${s.reviews.new}`,
    `• Средняя оценка: ${s.reviews.avgRating || "—"}`,
    `• За 7 дней: ${s.reviews.last7}`,
  ].join("\n");
  await render(chatId, messageId, text, [[{ text: "🏠 Меню", callback_data: "m" }]]);
}

// ---- notifications (called from form routes) -------------------------------

export async function notifyLead(lead: Lead): Promise<boolean> {
  const admin = adminChatId();
  if (!admin) {
    console.warn("[telegram] notifyLead: ADMIN_CHAT_ID not configured");
    return false;
  }
  const keyboard: InlineKeyboard = [
    [
      { text: "🟡 В работу", callback_data: `L|s|${lead.id}|in_progress` },
      { text: "✅ Готово", callback_data: `L|s|${lead.id}|done` },
    ],
    [{ text: "📋 Все заявки", callback_data: "L|p|0|a" }],
  ];
  return sendMessage(admin, formatLead(lead), keyboard);
}

export async function notifyReview(review: Review): Promise<boolean> {
  const admin = adminChatId();
  if (!admin) {
    console.warn("[telegram] notifyReview: ADMIN_CHAT_ID not configured");
    return false;
  }
  const keyboard: InlineKeyboard = [
    [
      { text: "👁 Просмотрен", callback_data: `R|s|${review.id}|in_progress` },
      { text: "✅ Опубликован", callback_data: `R|s|${review.id}|done` },
    ],
    [{ text: "⭐ Все отзывы", callback_data: "R|p|0|a" }],
  ];
  return sendMessage(admin, formatReview(review), keyboard);
}

// ---- webhook update handling -----------------------------------------------

type TgUpdate = {
  message?: {
    chat: { id: number };
    from?: { id: number };
    text?: string;
  };
  callback_query?: {
    id: string;
    from: { id: number };
    data?: string;
    message?: { chat: { id: number }; message_id: number };
  };
};

const WELCOME = [
  `👋 <b>buildbyalex bot</b>`,
  ``,
  `Сюда приходят все заявки и отзывы с сайта. Через меню можно смотреть историю, открывать карточки и менять статусы.`,
].join("\n");

async function handleCallback(cq: NonNullable<TgUpdate["callback_query"]>): Promise<void> {
  if (!isAdmin(cq.from.id)) {
    await answerCallback(cq.id, "Доступ запрещён");
    return;
  }
  const chatId = cq.message?.chat.id;
  const messageId = cq.message?.message_id;
  if (chatId === undefined || messageId === undefined) {
    await answerCallback(cq.id);
    return;
  }
  const data = cq.data ?? "";
  const parts = data.split("|");

  try {
    if (data === "m") {
      await viewMenu(chatId, messageId);
    } else if (data === "st") {
      await viewStats(chatId, messageId);
    } else if (parts[0] === "L" && parts[1] === "p") {
      await viewLeads(chatId, Number(parts[2]) || 0, parts[3] === "n", messageId);
    } else if (parts[0] === "L" && parts[1] === "v") {
      await viewLead(chatId, Number(parts[2]), messageId);
    } else if (parts[0] === "L" && parts[1] === "s") {
      await setLeadStatus(Number(parts[2]), parts[3] as Status);
      await viewLead(chatId, Number(parts[2]), messageId);
      await answerCallback(cq.id, "Статус обновлён");
      return;
    } else if (parts[0] === "R" && parts[1] === "p") {
      await viewReviews(chatId, Number(parts[2]) || 0, parts[3] === "n", messageId);
    } else if (parts[0] === "R" && parts[1] === "v") {
      await viewReview(chatId, Number(parts[2]), messageId);
    } else if (parts[0] === "R" && parts[1] === "s") {
      await setReviewStatus(Number(parts[2]), parts[3] as Status);
      await viewReview(chatId, Number(parts[2]), messageId);
      await answerCallback(cq.id, "Статус обновлён");
      return;
    } else {
      await viewMenu(chatId, messageId);
    }
  } catch (err) {
    console.error("[telegram] callback handler error", err);
  }
  await answerCallback(cq.id);
}

async function handleMessage(msg: NonNullable<TgUpdate["message"]>): Promise<void> {
  const fromId = msg.from?.id;
  if (!isAdmin(fromId)) return; // silently ignore strangers
  const chatId = msg.chat.id;
  const text = (msg.text ?? "").trim();

  if (text.startsWith("/start")) {
    await sendMessage(chatId, WELCOME);
    await viewMenu(chatId);
  } else if (text.startsWith("/leads") || text.startsWith("/zayavki")) {
    await viewLeads(chatId, 0, false);
  } else if (text.startsWith("/reviews") || text.startsWith("/otzyvy")) {
    await viewReviews(chatId, 0, false);
  } else if (text.startsWith("/stats")) {
    await viewStats(chatId);
  } else {
    await viewMenu(chatId);
  }
}

export async function handleUpdate(update: TgUpdate): Promise<void> {
  if (update.callback_query) await handleCallback(update.callback_query);
  else if (update.message) await handleMessage(update.message);
}
