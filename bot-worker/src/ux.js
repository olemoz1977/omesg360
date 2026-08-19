import core, { ReminderHub as CoreReminderHub } from "./index.js";

export class ReminderHub extends CoreReminderHub {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/ui-language") {
      const state = await this.ctx.storage.get("state");
      return Response.json({ lang: state?.lang === "lt" ? "lt" : "en" });
    }
    return super.fetch(request);
  }
}

const UI = {
  lt: {
    intro: "OMESG360Bot yra papildomas tavo plano sluoksnis. Kalendoriuje gali likti visas 90 dienų planas, o čia gali sekti tik 1–3 svarbiausius pažadus ir trumpai fiksuoti progresą.\n\nLeadership 360° plane pažymėk norimus veiksmus ir spausk „Perduoti į Telegram“.",
    menu: "Pasirink veiksmą:",
    listButton: "📋 Aktyvūs priminimai",
    languageButton: "🌐 English"
  },
  en: {
    intro: "OMESG360Bot is an additional layer on top of your plan. Your full 90-day plan can stay in the calendar, while here you can track only 1–3 key commitments and quickly record progress.\n\nIn the Leadership 360° plan, select the actions you want and tap “Send to Telegram”.",
    menu: "Choose an action:",
    listButton: "📋 Active reminders",
    languageButton: "🌐 Lietuvių"
  }
};

function languageFromUpdate(update) {
  return String(update?.message?.from?.language_code || "").toLowerCase().startsWith("lt") ? "lt" : "en";
}

async function savedLanguage(env, chatId, fallback) {
  try {
    const stub = env.REMINDERS.getByName(String(chatId));
    const response = await stub.fetch(new Request("https://reminder.internal/ui-language"));
    if (!response.ok) return fallback;
    const data = await response.json();
    return data?.lang === "lt" ? "lt" : "en";
  } catch {
    return fallback;
  }
}

function keyboard(lang) {
  const ui = UI[lang];
  return {
    keyboard: [
      [{ text: ui.listButton }],
      [{ text: ui.languageButton }]
    ],
    resize_keyboard: true,
    is_persistent: true
  };
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

async function sendUi(env, chatId, text, lang) {
  return telegramApi(env, "sendMessage", {
    chat_id: chatId,
    text,
    disable_web_page_preview: true,
    reply_markup: keyboard(lang)
  });
}

function webhookAuthorized(request, env) {
  return request.headers.get("X-Telegram-Bot-Api-Secret-Token") === env.TELEGRAM_WEBHOOK_SECRET;
}

function commandForButton(text) {
  if (text === UI.lt.listButton || text === UI.en.listButton) return "/list";
  if (text === UI.lt.languageButton) return "/lang en";
  if (text === UI.en.languageButton) return "/lang lt";
  return null;
}

function languageAfterCommand(text, fallback) {
  const normalized = text.trim().toLowerCase();
  if (normalized === "/lang lt") return "lt";
  if (normalized === "/lang en") return "en";
  return fallback;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method !== "POST" || url.pathname !== "/telegram") {
      return core.fetch(request, env);
    }

    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_WEBHOOK_SECRET) {
      return core.fetch(request, env);
    }

    if (!webhookAuthorized(request, env)) {
      return new Response("forbidden", { status: 403 });
    }

    const update = await request.clone().json();
    const message = update.message;
    const chatId = message?.chat?.id;
    const originalText = typeof message?.text === "string" ? message.text.trim() : "";

    if (!chatId || !originalText) {
      return core.fetch(request, env);
    }

    const detectedLang = languageFromUpdate(update);
    const currentLang = await savedLanguage(env, chatId, detectedLang);

    if (originalText.toLowerCase().split("@")[0] === "/start") {
      await sendUi(env, chatId, UI[currentLang].intro, currentLang);
      return new Response("ok", { status: 200 });
    }

    const transformedText = commandForButton(originalText) || originalText;

    let forwardedRequest = request;
    if (transformedText !== originalText) {
      const forwardedUpdate = structuredClone(update);
      forwardedUpdate.message.text = transformedText;
      forwardedRequest = new Request(request.url, {
        method: "POST",
        headers: request.headers,
        body: JSON.stringify(forwardedUpdate)
      });
    }

    const response = await core.fetch(forwardedRequest, env);

    const normalized = transformedText.toLowerCase();
    if (normalized === "/lang lt" || normalized === "/lang en") {
      const lang = languageAfterCommand(transformedText, currentLang);
      await sendUi(env, chatId, UI[lang].menu, lang);
    }

    return response;
  }
};
