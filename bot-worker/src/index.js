import { DurableObject } from "cloudflare:workers";

const TZ = "Europe/Vilnius";

const COPY = {
  lt: {
    start: "OMESG360Bot. Užfiksuoju pažadą, terminą ir tarpinius žingsnius. Primenu vieną kartą, be spaudimo.\n\nNaujas pažadas:\n/new rytoj 18:00 | Paruošti pasiūlymą\n\nKomandos: /list, /step, /done, /snooze, /lang, /help",
    help: "Komandos:\n/new <kada> | <pažadas>\n/list\n/step <id> | <tarpinis žingsnis>\n/done <id>\n/snooze <id> <30m|2h|1d>\n/lang lt|en\n\nLaikas: „rytoj 18:00“, „šiandien 20:30“ arba „2026-08-20 18:00“. Primenu tik kartą. Jei nori dar vieno priminimo, naudoji /snooze.",
    newUsage: "Pvz.: /new rytoj 18:00 | Paruošti pasiūlymą",
    badDate: "Nesupratau laiko. Rašyk, pvz., „rytoj 18:00“ arba „2026-08-20 18:00“.",
    added: ({ id, text, due }) => `Užfiksuota #${id}: ${text}\nTerminas: ${due}`,
    empty: "Atvirų pažadų nėra.",
    listHeader: "Atviri pažadai:",
    notFound: "Tokio atviro pažado neradau.",
    done: ({ id }) => `#${id} pažymėtas atliktu.`,
    stepUsage: "Pvz.: /step 2 | Gavau tiekėjo atsakymą",
    stepAdded: ({ id, text }) => `#${id} žingsnis užfiksuotas: ${text}`,
    snoozeUsage: "Pvz.: /snooze 2 2h arba /snooze 2 1d",
    snoozed: ({ id, due }) => `#${id} perkeltas. Naujas priminimas: ${due}`,
    lang: "Kalba pakeista į lietuvių.",
    reminder: ({ id, text }) => `Primenu vieną kartą: #${id} ${text}\n\nJei jau padaryta: /done ${id}\nJei reikia daugiau laiko: /snooze ${id} 1d`,
    unknown: "Nesupratau komandos. /help parodys trumpą sąrašą."
  },
  en: {
    start: "OMESG360Bot. I keep track of commitments, deadlines and intermediate steps. I remind you once, without nagging.\n\nNew commitment:\n/new tomorrow 18:00 | Prepare the proposal\n\nCommands: /list, /step, /done, /snooze, /lang, /help",
    help: "Commands:\n/new <when> | <commitment>\n/list\n/step <id> | <intermediate step>\n/done <id>\n/snooze <id> <30m|2h|1d>\n/lang lt|en\n\nTime examples: “tomorrow 18:00”, “today 20:30” or “2026-08-20 18:00”. I remind you only once. Use /snooze if you want another reminder.",
    newUsage: "Example: /new tomorrow 18:00 | Prepare the proposal",
    badDate: "I could not understand the time. Use “tomorrow 18:00” or “2026-08-20 18:00”.",
    added: ({ id, text, due }) => `Saved #${id}: ${text}\nDue: ${due}`,
    empty: "No open commitments.",
    listHeader: "Open commitments:",
    notFound: "I could not find that open commitment.",
    done: ({ id }) => `#${id} marked done.`,
    stepUsage: "Example: /step 2 | Supplier replied",
    stepAdded: ({ id, text }) => `#${id} step saved: ${text}`,
    snoozeUsage: "Example: /snooze 2 2h or /snooze 2 1d",
    snoozed: ({ id, due }) => `#${id} moved. New reminder: ${due}`,
    lang: "Language changed to English.",
    reminder: ({ id, text }) => `One gentle reminder: #${id} ${text}\n\nIf done: /done ${id}\nNeed more time: /snooze ${id} 1d`,
    unknown: "I did not understand that command. /help shows the short list."
  }
};

function textFor(lang, key, data = {}) {
  const value = COPY[lang]?.[key] ?? COPY.en[key];
  return typeof value === "function" ? value(data) : value;
}

function zoneParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute)
  };
}

function addCalendarDays(parts, days) {
  const d = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days, 12, 0));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

function zonedLocalToUtcMs(year, month, day, hour, minute) {
  const naiveUtc = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  let guess = naiveUtc;
  for (let i = 0; i < 3; i += 1) {
    const p = zoneParts(new Date(guess));
    const represented = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, 0, 0);
    const delta = represented - naiveUtc;
    guess -= delta;
    if (delta === 0) break;
  }
  return guess;
}

function parseWhen(raw) {
  const input = raw.trim();

  const explicitOffset = Date.parse(input);
  if (/T/.test(input) && /(?:Z|[+-]\d{2}:?\d{2})$/i.test(input) && Number.isFinite(explicitOffset)) {
    return explicitOffset;
  }

  let m = input.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2})$/);
  if (m) {
    const [, y, mo, d, h, mi] = m;
    return zonedLocalToUtcMs(Number(y), Number(mo), Number(d), Number(h), Number(mi));
  }

  m = input.match(/^(šiandien|siandien|today|rytoj|tomorrow)\s+(\d{1,2}):(\d{2})$/i);
  if (m) {
    const today = zoneParts();
    const dayOffset = /rytoj|tomorrow/i.test(m[1]) ? 1 : 0;
    const target = addCalendarDays(today, dayOffset);
    return zonedLocalToUtcMs(target.year, target.month, target.day, Number(m[2]), Number(m[3]));
  }

  return null;
}

function parseDuration(raw) {
  const m = raw.trim().match(/^(\d+)(m|h|d)$/i);
  if (!m) return null;
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  if (n <= 0) return null;
  return n * (unit === "m" ? 60_000 : unit === "h" ? 3_600_000 : 86_400_000);
}

function formatDue(ms, lang) {
  return new Intl.DateTimeFormat(lang === "lt" ? "lt-LT" : "en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(ms));
}

async function telegramApi(env, method, body) {
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(`Telegram ${method} failed: ${data.description ?? response.status}`);
  }
  return data.result;
}

async function sendText(env, chatId, text) {
  return telegramApi(env, "sendMessage", {
    chat_id: chatId,
    text,
    disable_web_page_preview: true
  });
}

function defaultState(lang = "en") {
  return { lang, nextId: 1, commitments: [] };
}

export class ReminderHub extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx = ctx;
    this.env = env;
  }

  async loadState(languageCode) {
    const existing = await this.ctx.storage.get("state");
    if (existing) return existing;
    const lang = String(languageCode || "").toLowerCase().startsWith("lt") ? "lt" : "en";
    const state = defaultState(lang);
    await this.ctx.storage.put("state", state);
    return state;
  }

  async saveState(state) {
    await this.ctx.storage.put("state", state);
  }

  async scheduleNext(state) {
    const future = state.commitments
      .filter((c) => c.status === "open" && !c.reminded)
      .map((c) => c.dueAt)
      .filter((x) => Number.isFinite(x))
      .sort((a, b) => a - b);

    if (!future.length) {
      await this.ctx.storage.deleteAlarm();
      return;
    }
    await this.ctx.storage.setAlarm(Math.max(Date.now(), future[0]));
  }

  async fetch(request) {
    const update = await request.json();
    const message = update.message;
    if (!message?.chat?.id || typeof message.text !== "string") {
      return new Response("ignored", { status: 200 });
    }

    const chatId = String(message.chat.id);
    const state = await this.loadState(message.from?.language_code);
    const rawText = message.text.trim();
    const [rawCommand, ...restTokens] = rawText.split(/\s+/);
    const command = rawCommand.toLowerCase().split("@")[0];
    const rest = restTokens.join(" ").trim();

    let reply;

    if (command === "/start") {
      reply = textFor(state.lang, "start");
    } else if (command === "/help") {
      reply = textFor(state.lang, "help");
    } else if (command === "/lang") {
      const requested = rest.toLowerCase();
      if (requested === "lt" || requested === "en") {
        state.lang = requested;
        await this.saveState(state);
        reply = textFor(state.lang, "lang");
      } else {
        reply = "/lang lt | /lang en";
      }
    } else if (command === "/new") {
      const separator = rest.indexOf("|");
      if (separator < 0) {
        reply = textFor(state.lang, "newUsage");
      } else {
        const whenRaw = rest.slice(0, separator).trim();
        const commitmentText = rest.slice(separator + 1).trim();
        const dueAt = parseWhen(whenRaw);
        if (!commitmentText) {
          reply = textFor(state.lang, "newUsage");
        } else if (!dueAt || dueAt <= Date.now()) {
          reply = textFor(state.lang, "badDate");
        } else {
          const commitment = {
            id: state.nextId++,
            text: commitmentText,
            dueAt,
            status: "open",
            reminded: false,
            steps: [],
            createdAt: Date.now()
          };
          state.commitments.push(commitment);
          await this.saveState(state);
          await this.scheduleNext(state);
          reply = textFor(state.lang, "added", {
            id: commitment.id,
            text: commitment.text,
            due: formatDue(commitment.dueAt, state.lang)
          });
        }
      }
    } else if (command === "/list") {
      const open = state.commitments.filter((c) => c.status === "open");
      if (!open.length) {
        reply = textFor(state.lang, "empty");
      } else {
        const lines = open.map((c) => {
          const stepSuffix = c.steps.length ? ` · ${c.steps.length} step${c.steps.length === 1 ? "" : "s"}` : "";
          return `#${c.id} · ${formatDue(c.dueAt, state.lang)} · ${c.text}${stepSuffix}`;
        });
        reply = `${textFor(state.lang, "listHeader")}\n${lines.join("\n")}`;
      }
    } else if (command === "/done") {
      const id = Number(rest);
      const item = state.commitments.find((c) => c.id === id && c.status === "open");
      if (!item) {
        reply = textFor(state.lang, "notFound");
      } else {
        item.status = "done";
        item.doneAt = Date.now();
        await this.saveState(state);
        await this.scheduleNext(state);
        reply = textFor(state.lang, "done", { id });
      }
    } else if (command === "/step") {
      const separator = rest.indexOf("|");
      if (separator < 0) {
        reply = textFor(state.lang, "stepUsage");
      } else {
        const id = Number(rest.slice(0, separator).trim());
        const stepText = rest.slice(separator + 1).trim();
        const item = state.commitments.find((c) => c.id === id && c.status === "open");
        if (!item) {
          reply = textFor(state.lang, "notFound");
        } else if (!stepText) {
          reply = textFor(state.lang, "stepUsage");
        } else {
          item.steps.push({ text: stepText, at: Date.now() });
          await this.saveState(state);
          reply = textFor(state.lang, "stepAdded", { id, text: stepText });
        }
      }
    } else if (command === "/snooze") {
      const match = rest.match(/^(\d+)\s+(\d+[mhd])$/i);
      if (!match) {
        reply = textFor(state.lang, "snoozeUsage");
      } else {
        const id = Number(match[1]);
        const duration = parseDuration(match[2]);
        const item = state.commitments.find((c) => c.id === id && c.status === "open");
        if (!item || !duration) {
          reply = item ? textFor(state.lang, "snoozeUsage") : textFor(state.lang, "notFound");
        } else {
          item.dueAt = Date.now() + duration;
          item.reminded = false;
          await this.saveState(state);
          await this.scheduleNext(state);
          reply = textFor(state.lang, "snoozed", { id, due: formatDue(item.dueAt, state.lang) });
        }
      }
    } else {
      reply = textFor(state.lang, "unknown");
    }

    await sendText(this.env, chatId, reply);
    return new Response("ok", { status: 200 });
  }

  async alarm() {
    const state = await this.ctx.storage.get("state");
    if (!state) return;

    const now = Date.now();
    const due = state.commitments.filter(
      (c) => c.status === "open" && !c.reminded && c.dueAt <= now
    );

    for (const item of due) {
      const chatId = this.ctx.id.name;
      if (!chatId) throw new Error("Durable Object name unavailable");
      await sendText(this.env, chatId, textFor(state.lang, "reminder", { id: item.id, text: item.text }));
      item.reminded = true;
      item.remindedAt = Date.now();
      await this.saveState(state);
    }

    await this.scheduleNext(state);
  }
}

function assertConfigured(env) {
  const missing = ["TELEGRAM_BOT_TOKEN", "TELEGRAM_WEBHOOK_SECRET", "SETUP_SECRET"].filter((key) => !env[key]);
  if (missing.length) throw new Error(`Missing Worker secrets: ${missing.join(", ")}`);
}

function isAdmin(request, env) {
  return request.headers.get("authorization") === `Bearer ${env.SETUP_SECRET}`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ ok: true, service: "OMESG360Bot" });
    }

    if (request.method === "POST" && url.pathname === "/admin/set-webhook") {
      assertConfigured(env);
      if (!isAdmin(request, env)) return new Response("unauthorized", { status: 401 });
      const webhookUrl = `${url.origin}/telegram`;
      const result = await telegramApi(env, "setWebhook", {
        url: webhookUrl,
        secret_token: env.TELEGRAM_WEBHOOK_SECRET,
        allowed_updates: ["message"],
        drop_pending_updates: false
      });
      return Response.json({ ok: true, webhookUrl, result });
    }

    if (request.method === "GET" && url.pathname === "/admin/webhook-info") {
      assertConfigured(env);
      if (!isAdmin(request, env)) return new Response("unauthorized", { status: 401 });
      const result = await telegramApi(env, "getWebhookInfo", {});
      return Response.json({ ok: true, result });
    }

    if (request.method !== "POST" || url.pathname !== "/telegram") {
      return new Response("not found", { status: 404 });
    }

    assertConfigured(env);
    const telegramSecret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (telegramSecret !== env.TELEGRAM_WEBHOOK_SECRET) {
      return new Response("forbidden", { status: 403 });
    }

    const update = await request.json();
    const chatId = update.message?.chat?.id;
    if (!chatId) return new Response("ignored", { status: 200 });

    const stub = env.REMINDERS.getByName(String(chatId));
    const forwarded = new Request("https://reminder.internal/update", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(update)
    });
    const response = await stub.fetch(forwarded);
    if (!response.ok) return new Response("processing failed", { status: 500 });
    return new Response("ok", { status: 200 });
  }
};
