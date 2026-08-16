import core, { ReminderHub } from "./index.js";

export { ReminderHub };

const UI = {
  lt: {
    intro: "OMESG360Bot padeda užfiksuoti pažadą ir terminą. Primenu vieną kartą, be spaudimo.\n\nPasirink veiksmą apačioje.",
    newPrompt: "Ką nori užfiksuoti?\n\nParašyk vienoje žinutėje:\nrytoj 18:00 | Paruošti pasiūlymą\n\nKomandos /new rašyti nereikia.",
    menu: "Pasirink veiksmą:",
    newButton: "➕ Naujas pažadas",
    listButton: "📋 Mano pažadai",
    languageButton: "🌐 English"
  },
  en: {
    intro: "OMESG360Bot keeps track of a commitment and its deadline. I remind you once, without nagging.\n\nChoose an action below.",
    newPrompt: "What do you want to keep track of?\n\nSend one message like:\ntomorrow 18:00 | Prepare the proposal\n\nYou do not need to type /new.",
    menu: "Choose an action:",
    newButton: "➕ New commitment",
    listButton: "📋 My commitments",
    languageButton: "🌐 Lietuvių"
  }
};

function languageFromUpdate(update) {
  return String(update?.message?.from?.language_code || "").toLowerCase().startsWith("lt") ? "lt" : "en";
}

function keyboard(lang) {
  const ui = UI[lang];
  return {
    keyboard: [
      [{ text: ui.newButton }, { text: ui.listButton }],
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

    if (originalText.toLowerCase().split("@")[0] === "/start") {
      await sendUi(env, chatId, UI[detectedLang].intro, detectedLang);
      return new Response("ok", { status: 200 });
    }

    if (originalText === UI.lt.newButton || originalText === UI.en.newButton) {
      const lang = originalText === UI.lt.newButton ? "lt" : "en";
      await sendUi(env, chatId, UI[lang].newPrompt, lang);
      return new Response("ok", { status: 200 });
    }

    let transformedText = commandForButton(originalText) || originalText;

    if (!transformedText.startsWith("/") && transformedText.includes("|")) {
      transformedText = `/new ${transformedText}`;
    }

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
      const lang = languageAfterCommand(transformedText, detectedLang);
      await sendUi(env, chatId, UI[lang].menu, lang);
    }

    return response;
  }
};
