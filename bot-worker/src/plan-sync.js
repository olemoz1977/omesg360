import uiWorker, { ReminderHub as UiReminderHub } from "./ux.js";

const BOT_USERNAME = "OMESG360Bot";
const PLAN_TTL_MS = 30 * 60 * 1000;
const MAX_PLAN_ITEMS = 3;
const TZ = "Europe/Vilnius";
const ALLOWED_ORIGINS = new Set([
  "https://olemoz1977.github.io",
  "https://omesg360.eu",
  "https://www.omesg360.eu"
]);

function json(data, status = 200, origin = null) {
  const headers = { "content-type": "application/json; charset=utf-8" };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["access-control-allow-origin"] = origin;
    headers["access-control-allow-methods"] = "POST, OPTIONS";
    headers["access-control-allow-headers"] = "content-type";
    headers.vary = "Origin";
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function randomToken() {
  const bytes = new Uint8Array(9);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function cleanText(value, max) {
  return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, max);
}

function validIsoDate(value) {
  const m = String(value ?? "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const d = new Date(Date.UTC(year, month - 1, day, 12, 0));
  if (d.getUTCFullYear() !== year || d.getUTCMonth() + 1 !== month || d.getUTCDate() !== day) return null;
  return { year, month, day, iso: m[0] };
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
  for (let i = 0; i < 4; i += 1) {
    const p = zoneParts(new Date(guess));
    const represented = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, 0, 0);
    const delta = represented - naiveUtc;
    guess -= delta;
    if (delta === 0) break;
  }
  return guess;
}

function reminderAtForDate(isoDate) {
  const parsed = validIsoDate(isoDate);
  if (!parsed) return null;
  let target = parsed;
  let dueAt = zonedLocalToUtcMs(target.year, target.month, target.day, 18, 0);
  if (dueAt <= Date.now()) {
    target = addCalendarDays(target, 1);
    dueAt = zonedLocalToUtcMs(target.year, target.month, target.day, 18, 0);
  }
  return dueAt;
}

function stableHash(input) {
  let h = 0x811c9dc5;
  const s = String(input);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

function normalizePlan(input) {
  if (!input || typeof input !== "object") throw new Error("Invalid plan payload");
  const lang = input.lang === "en" ? "en" : "lt";
  const startDate = validIsoDate(input.startDate)?.iso;
  if (!startDate) throw new Error("Invalid plan start date");

  if (!Array.isArray(input.items) || input.items.length < 1) throw new Error("Select at least one plan item");
  if (input.items.length > MAX_PLAN_ITEMS) throw new Error(`Select no more than ${MAX_PLAN_ITEMS} plan items`);

  const items = input.items.map((raw) => {
    const text = cleanText(raw.text, 500);
    const frequency = cleanText(raw.frequency ?? raw.freq, 80);
    const phase = cleanText(raw.phase, 24);
    const competency = cleanText(raw.competency ?? raw.comp, 140);
    const dueDate = validIsoDate(raw.dueDate)?.iso;
    if (!text || !dueDate) throw new Error("Each plan item needs text and dueDate");
    const dueAt = reminderAtForDate(dueDate);
    if (!dueAt) throw new Error("Invalid reminder date");
    const planItemId = `l360_${stableHash(`${startDate}|${competency}|${phase}|${frequency}|${text}`)}`;
    return {
      planItemId,
      text,
      frequency,
      phase,
      competency,
      dueDate,
      dueAt
    };
  });

  return {
    version: 1,
    source: "leadership360",
    lang,
    startDate,
    createdAt: Date.now(),
    items
  };
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

function pairCopy(lang, result) {
  if (lang === "en") {
    const next = result.nextDueAt ? `\nFirst reminder: ${formatDue(result.nextDueAt, "en")}.` : "";
    return `✅ Leadership 360° plan connected.\nActive commitments: ${result.activeCount}.${next}\n\nView them with /list.`;
  }
  const next = result.nextDueAt ? `\nPirmas priminimas: ${formatDue(result.nextDueAt, "lt")}.` : "";
  return `✅ Leadership 360° planas prijungtas.\nAktyvūs pažadai: ${result.activeCount}.${next}\n\nJuos peržiūrėsi su /list.`;
}

function expiredCopy(lang) {
  return lang === "en"
    ? "This Leadership 360° handoff link has expired. Return to the 90-day plan and send the selected actions to Telegram again."
    : "Ši Leadership 360° perdavimo nuoroda nebegalioja. Grįžk į 90 dienų planą ir dar kartą perduok pasirinktus veiksmus į Telegram.";
}

export class ReminderHub extends UiReminderHub {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/pending-plan/store") {
      const pending = await request.json();
      if (!pending?.plan || !Number.isFinite(pending.expiresAt)) return json({ ok: false }, 400);
      await this.ctx.storage.put("pendingPlan", pending);
      await this.ctx.storage.setAlarm(pending.expiresAt);
      return json({ ok: true });
    }

    if (request.method === "POST" && url.pathname === "/pending-plan/consume") {
      const pending = await this.ctx.storage.get("pendingPlan");
      if (!pending) return json({ ok: false, error: "not_found" }, 404);
      if (pending.expiresAt <= Date.now()) {
        await this.ctx.storage.delete("pendingPlan");
        await this.ctx.storage.deleteAlarm();
        return json({ ok: false, error: "expired" }, 410);
      }
      await this.ctx.storage.delete("pendingPlan");
      await this.ctx.storage.deleteAlarm();
      return json({ ok: true, plan: pending.plan });
    }

    if (request.method === "POST" && url.pathname === "/plan/apply") {
      const plan = await request.json();
      if (!plan?.items?.length) return json({ ok: false, error: "empty_plan" }, 400);

      let state = await this.ctx.storage.get("state");
      if (!state) state = { lang: plan.lang === "en" ? "en" : "lt", nextId: 1, commitments: [] };
      if (!Array.isArray(state.commitments)) state.commitments = [];
      if (!Number.isInteger(state.nextId) || state.nextId < 1) {
        state.nextId = state.commitments.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
      }
      state.lang = plan.lang === "en" ? "en" : "lt";

      let added = 0;
      let updated = 0;
      for (const incoming of plan.items.slice(0, MAX_PLAN_ITEMS)) {
        const existing = state.commitments.find((c) => c.planItemId === incoming.planItemId);
        if (existing) {
          const dueChanged = existing.dueAt !== incoming.dueAt;
          existing.text = incoming.text;
          existing.dueAt = incoming.dueAt;
          existing.planItemId = incoming.planItemId;
          existing.source = "leadership360";
          existing.planStartDate = plan.startDate;
          existing.phase = incoming.phase;
          existing.frequency = incoming.frequency;
          existing.competency = incoming.competency;
          if (existing.status === "open" && dueChanged) existing.reminded = false;
          updated += 1;
        } else {
          state.commitments.push({
            id: state.nextId++,
            text: incoming.text,
            dueAt: incoming.dueAt,
            status: "open",
            reminded: false,
            steps: [],
            createdAt: Date.now(),
            planItemId: incoming.planItemId,
            source: "leadership360",
            planStartDate: plan.startDate,
            phase: incoming.phase,
            frequency: incoming.frequency,
            competency: incoming.competency
          });
          added += 1;
        }
      }

      state.lastPlanImportAt = Date.now();
      state.lastPlanStartDate = plan.startDate;
      await this.saveState(state);
      await this.scheduleNext(state);

      const open = state.commitments.filter((c) => c.status === "open");
      const nextDueAt = open
        .filter((c) => !c.reminded && Number.isFinite(c.dueAt))
        .map((c) => c.dueAt)
        .sort((a, b) => a - b)[0] ?? null;

      return json({
        ok: true,
        added,
        updated,
        activeCount: open.length,
        nextDueAt
      });
    }

    return super.fetch(request);
  }

  async alarm() {
    const pending = await this.ctx.storage.get("pendingPlan");
    if (pending) {
      if (pending.expiresAt <= Date.now()) await this.ctx.storage.delete("pendingPlan");
      return;
    }
    return super.alarm();
  }
}

async function importPlan(request, env) {
  const origin = request.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return json({ ok: false, error: "origin_not_allowed" }, 403, origin);

  let input;
  try {
    input = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400, origin);
  }

  let plan;
  try {
    plan = normalizePlan(input);
  } catch (error) {
    return json({ ok: false, error: error instanceof Error ? error.message : String(error) }, 400, origin);
  }

  const token = randomToken();
  const expiresAt = Date.now() + PLAN_TTL_MS;
  const stub = env.REMINDERS.getByName(`plan:${token}`);
  const stored = await stub.fetch(new Request("https://reminder.internal/pending-plan/store", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ plan, expiresAt })
  }));
  if (!stored.ok) return json({ ok: false, error: "handoff_store_failed" }, 500, origin);

  return json({
    ok: true,
    telegramUrl: `https://t.me/${BOT_USERNAME}?start=p_${token}`,
    expiresAt
  }, 200, origin);
}

function detectedLanguage(update) {
  return String(update?.message?.from?.language_code || "").toLowerCase().startsWith("lt") ? "lt" : "en";
}

function startToken(text) {
  const m = String(text ?? "").trim().match(/^\/start(?:@\w+)?\s+p_([A-Za-z0-9_-]{8,40})$/i);
  return m?.[1] ?? null;
}

async function pairPlanFromTelegram(request, env, ctx) {
  if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== env.TELEGRAM_WEBHOOK_SECRET) {
    return uiWorker.fetch(request, env, ctx);
  }

  const update = await request.clone().json();
  const chatId = update.message?.chat?.id;
  const token = startToken(update.message?.text);
  if (!chatId || !token) return uiWorker.fetch(request, env, ctx);

  const pendingStub = env.REMINDERS.getByName(`plan:${token}`);
  const consumed = await pendingStub.fetch(new Request("https://reminder.internal/pending-plan/consume", { method: "POST" }));

  const cleanUpdate = structuredClone(update);
  cleanUpdate.message.text = "/start";
  const cleanRequest = new Request(request.url, {
    method: "POST",
    headers: request.headers,
    body: JSON.stringify(cleanUpdate)
  });

  if (!consumed.ok) {
    const response = await uiWorker.fetch(cleanRequest, env, ctx);
    await sendText(env, String(chatId), expiredCopy(detectedLanguage(update)));
    return response;
  }

  const { plan } = await consumed.json();
  const chatStub = env.REMINDERS.getByName(String(chatId));
  const appliedResponse = await chatStub.fetch(new Request("https://reminder.internal/plan/apply", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(plan)
  }));
  if (!appliedResponse.ok) return new Response("plan apply failed", { status: 500 });
  const result = await appliedResponse.json();

  const response = await uiWorker.fetch(cleanRequest, env, ctx);
  await sendText(env, String(chatId), pairCopy(plan.lang, result));
  return response;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get("origin");

    if (url.pathname === "/plan/import" && request.method === "OPTIONS") {
      if (!origin || !ALLOWED_ORIGINS.has(origin)) return new Response(null, { status: 403 });
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": origin,
          "access-control-allow-methods": "POST, OPTIONS",
          "access-control-allow-headers": "content-type",
          vary: "Origin"
        }
      });
    }

    if (url.pathname === "/plan/import" && request.method === "POST") {
      return importPlan(request, env);
    }

    if (url.pathname === "/telegram" && request.method === "POST") {
      return pairPlanFromTelegram(request, env, ctx);
    }

    return uiWorker.fetch(request, env, ctx);
  }
};
