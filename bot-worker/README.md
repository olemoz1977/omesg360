# OMESG360Bot Worker

Telegram reminder/commitment bot for Cloudflare Workers.

## Behavior

- LT/EN interface (`/lang lt` or `/lang en`).
- Stores commitments per Telegram chat in a Durable Object.
- Stores intermediate progress with `/step`.
- Sends one reminder when the due time arrives.
- Does not keep nagging automatically; another reminder is created only when the user explicitly uses `/snooze`.

## Commands

```text
/start
/new rytoj 18:00 | Paruošti pasiūlymą
/new tomorrow 18:00 | Prepare the proposal
/list
/step 1 | Gavau tiekėjo atsakymą
/done 1
/snooze 1 2h
/lang lt
/lang en
/help
```

Times without an explicit timezone are interpreted as `Europe/Vilnius`.

## Deploy

From `bot-worker/`:

```bash
npm install
npx wrangler deploy --dry-run
npx wrangler deploy
```

The initial deployment intentionally uses the generated `*.workers.dev` URL. This lets us verify the bot before attaching `bot.omesg360.eu`.

## Required Worker secrets

Do not put these values into GitHub or source files.

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET
npx wrangler secret put SETUP_SECRET
```

`TELEGRAM_WEBHOOK_SECRET` should contain only letters, digits, `_` and `-`, matching Telegram's `secret_token` requirements. A long random hex string is suitable. `SETUP_SECRET` is a separate long random value used only to protect the admin endpoints.

## Health check

```bash
curl https://<worker-host>/health
```

Expected response:

```json
{"ok":true,"service":"OMESG360Bot"}
```

## Register Telegram webhook

After all three secrets are present:

```bash
curl -X POST \
  -H "Authorization: Bearer <SETUP_SECRET>" \
  https://<worker-host>/admin/set-webhook
```

The Worker registers its own `/telegram` URL and uses `TELEGRAM_WEBHOOK_SECRET` so incoming Telegram requests can be verified using the `X-Telegram-Bot-Api-Secret-Token` header.

Check webhook state:

```bash
curl \
  -H "Authorization: Bearer <SETUP_SECRET>" \
  https://<worker-host>/admin/webhook-info
```

## Production hostname

After the `workers.dev` smoke test passes, attach the Worker to `bot.omesg360.eu` as a Cloudflare Workers Custom Domain. Once the hostname is active, call `/admin/set-webhook` again through `https://bot.omesg360.eu`; the Worker will update Telegram to the production URL automatically.
