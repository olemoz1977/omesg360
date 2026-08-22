# OMESG360 / 2rasi project roadmap and handover

Status: ACTIVE CONTINUITY DOCUMENT
Last updated: 2026-08-22 23:24 Europe/Vilnius
Working branch: `recovery/v02-clean-baseline`

This file exists so project-critical plans do not live only in chat history. Accepted but not-yet-implemented ideas and decisions must be written here before a work session ends.

## Current source-of-truth boundaries

### OMESG360 production
- Current visual/production baseline is the recovered `omesg360.eu` V02 state restored after the 2026-08-22 Git -> Hostinger overwrite incident.
- Hostinger V02 was cleaned up manually by the site owner after the incident.
- GitHub recovery/reconstruction is performed only in `olemoz1977/omesg360` on `recovery/v02-clean-baseline`.
- Do not treat `main` or `agent/leadership-360-home` as a verified production mirror.
- `agent/leadership-360-home` is historical incident-era work and must not be resumed for this recovery.

### Automation objective
- The 2026-08-22 incident does **not** cancel the GitHub -> Hostinger automation objective.
- Final desired operating model remains: GitHub work -> validation gate -> controlled deployment -> post-deploy smoke -> rollback/recovery if needed.
- Production deployment remains intentionally blocked until the active Wave1 and Calibration satellites have exact frozen GitHub mirrors and the recovery validator passes.
- No Hostinger deployment has been performed from the current recovery work.

### Leadership 360
- Product is FROZEN after a clean C1 E2E PASS on 2026-08-22.
- Product source of truth: `olemoz1977/gla360-personal-full`.
- Detailed future product backlog lives there in `FUTURE_ROADMAP.md`; do not duplicate or silently reopen it here.
- OMESG360 owns presentation/routing only. Frozen scoring, Collector, Guardian, invitation, privacy, C1/C2 and 90-day-plan contracts remain unchanged unless a real integration defect is found.

### 2rasi
- `2rasi.com` remains the discovery / hook layer.
- After the native OMESG360 Leadership page is production-live and tested, update the 2rasi primary Leadership 360 Start link to `https://omesg360.eu/leadership-360/`.

### 2Pair satellites
- `wave1/` and `conflictlab/releases/calibration-v0.1/` are research satellite surfaces and are outside Leadership 360 product logic.
- Do not refactor or redesign them during OMESG360 recovery.
- Their exact live/frozen files must nevertheless be mirrored in GitHub before the recovery branch can become the verified production source.

## GitHub safety state

Branches:
- `main` — untouched during recovery; mixed/pre-recovery state.
- `agent/leadership-360-home` — historical/incident work; NEVER use as Hostinger deployment source.
- `omesg360bot-worker` — Telegram bot worker branch; unrelated to site recovery.
- `archive/pre-recovery-2026-08-22` — checkpoint of pre-recovery GitHub state.
- `recovery/v02-clean-baseline` — only branch for current cleanup, integration and deployment-safety work.

Do not enable production Hostinger writes until the recovery validator passes and a dry-run deployment has been reviewed.

## Implemented in `recovery/v02-clean-baseline` on 2026-08-22

### V02 baseline recovered
- `index.html` rebuilt from the recovered V02 source, not from the old mixed multi-page branch.
- Commit: `4b9fe9858d8f510f41e849d15ad44097da57ab11`.
- V02 keeps inline CSS/JS, LT/EN switching, root `/assets/img/...`, and the narrative `Stabilize. Standardize. Improve.`.

### Privacy centre recovered
- `privacy.html` restored to the current V02 privacy centre.
- Stale `/#lab` reference was removed.
- Commit: `fa5f62988686c60ef742b94501a28963a68f188d`.

### Native Leadership 360 integration completed in GitHub
- New native page: `/leadership-360/index.html`.
- Commit: `387ba362d0d04292d0e5310cc56ffd86eb029ee7`.
- Homepage Leadership 360 entry was added after methodology/principle and before About, never as a fourth process-improvement stage.
- Homepage integration commit: `d0b581c3677de475ef3bd097601d6eeccfef23b3`.
- Native page is bilingual and routes into the frozen product entry:
  - LT: `https://olemoz1977.github.io/gla360-personal-full/setup-v2.html?lang=lt`
  - EN: `https://olemoz1977.github.io/gla360-personal-full/setup-v2.html?lang=en`
- Privacy CTA routes to frozen `PRIVACY-v2.html`.
- Product copy preserves Guardian/process-only boundaries, Identity DB vs Response DB separation, pseudonymisation limits, and the rule that raw 360 answers/evaluator identities do not go to OMESG360Bot.

### SEO surface reconciled
- `sitemap.xml` and `sitemap_location.xml` now advertise only active V02 public surfaces:
  - `/`
  - `/leadership-360/`
  - `/privacy.html`
- Old `services.html`, `approach.html`, `about.html`, `esg.html`, etc. are no longer advertised.
- `robots.txt` remains valid and points to the sitemap.

### Root dependency review completed
- Old root multi-page HTML files are no longer part of the recovery branch active surface.
- V02 does not depend on old root `assets/css/styles.css`, `assets/js/main.js`, or `assets/js/translations.js`.
- `contact.php` contains no repository secret but is not used by current V02; it is excluded from the managed deployment package.
- `.private/config.json` contains only non-secret/public Hostinger endpoint values; runtime credentials remain outside Git.

## Approved V02 shared image assets

Keep exactly:
- `assets/img/favicon.svg`
- `assets/img/logo.svg`
- `assets/img/og-cover.png`
- `assets/img/og-cover.svg`

Do not invent a `public/assets` layer; the site uses root `assets/`.

## Validation gate implemented

Current validator: `scripts/validate-v02.sh`.
Current validator commit: `977928690c627d1d7b3f09d83a56b8312863ee6b`.

It checks at minimum:
- required V02 files,
- no legacy root-page references in active V02 surfaces,
- correct Leadership placement and frozen flow links,
- exact four-file shared image allowlist,
- current sitemap surface,
- no `.env`, `config.php`, private key or PEM material in Git,
- complete frozen Wave1 mirror,
- Calibration mirror presence/release identity.

The validator is intentionally **red/fail-closed** today because the two satellite mirrors are not yet complete in this repository. Do not weaken this gate merely to get a green CI result.

GitHub Actions validation workflow:
- `.github/workflows/validate-v02.yml`
- commit `ba64f002b59bff2ad72f5d21af8fd394238c04cf`.

## GitHub -> Hostinger deployment workflow implemented but intentionally gated

Workflow: `.github/workflows/deploy-hostinger.yml`.
Current hardened workflow commit: `8880345a7b2780e1ce8e54e8ae73d621573365c2`.

Current safety model:
- manual `workflow_dispatch` only during recovery,
- `dry_run=true` by default,
- validation job must pass first,
- production GitHub Environment is required,
- SSH private key is runner-only,
- pinned `known_hosts` + strict host-key checking,
- deployment concurrency prevents overlapping production deploys,
- backup snapshot is created before real writes,
- post-deploy HTTP smoke runs,
- managed V02 paths roll back automatically if deploy/smoke fails.

Managed deploy surface is deliberately narrow:
- root `index.html`, `privacy.html`, `robots.txt`, sitemap files and verification files,
- exact `assets/img/`,
- exact `leadership-360/`.

Explicitly untouched by this workflow:
- `wave1/`,
- `conflictlab/releases/calibration-v0.1/`,
- runtime `config.php`,
- databases,
- all unrelated server paths.

This narrow allowlist is intentional during recovery. Satellite deployment may be automated later only under a separate exact-mirror contract and its own validation rules.

### Required GitHub `production` Environment configuration before first dry run

Environment variables:
- `HOSTINGER_HOST`
- `HOSTINGER_USER`
- `HOSTINGER_PORT`
- `HOSTINGER_PUBLIC_PATH`
- `HOSTINGER_BACKUP_PATH`

Environment secrets:
- `HOSTINGER_SSH_PRIVATE_KEY`
- `HOSTINGER_KNOWN_HOSTS`

Do not put these credentials into repository files.

## Remaining recovery blocker 1 — exact Wave1 frozen mirror

Target public satellite: `/wave1/`, frozen protocol `wave1-v0.4`.

Exact v0.4 upload package from 2026-08-13 is known from File Library:
- `index.html` — 18,823 bytes — SHA256 `66aa836730d0e866e64a2301d211dac0c55d9d9284a9fc4ef1f7316a7d9e0730`
- `api.php` — 5,362 bytes — SHA256 `ef886f21e6cf2059693e47fe398a6c57a44a4c56d924126742cf3edac6d7ff00`
- `admin.php` — 15,532 bytes — SHA256 `21dc5c3dcb879b6a8fd83e63d5c567f15be66c19b61a65b5738c32a44c44af0e`
- `migrate_v04_language.sql` — 532 bytes — SHA256 `d8a22dec773236f2b1c7081c87d0391b718238eb14a8bc223f1a55e1d9bb57ae`
- `README_DEPLOY.txt` — 1,778 bytes — SHA256 `8869e2c5c38444f4773871a77ce9e3a0d360c0721c947265f82effde220781e1`

Historical provenance:
- ConflictLab commit `6094ba6aef1458e10f1aff90ed6cceeef50a3dbc` contains `deploy/wave1-hostinger/index.html` at exactly 18,823 bytes and `api.php` at exactly 5,362 bytes, matching the real v0.4 upload package sizes.
- The current `deploy/wave1-hostinger-v04-candidate/` is **not** a verified live mirror and must not be copied blindly; its file sizes differ from the known uploaded package.

Wave1 v0.4 deliberately reuses the same 12 frozen stimulus assets as v0.3:
- `more-reveal.webp`
- `less-reveal.jpg`
- `more-evidence.png`
- `less-evidence.png`
- `more-reference.png`
- `less-reference.png`
- `no-predefined-zones.png`
- `predefined-zones.png`
- `fixed-slots.png`
- `continuous-capacity.png`
- `partitioned-space.png`
- `open-space.png`

Asset provenance in ConflictLab history is known, including commit `691defcd40c361c067b448ce67191363d53d8cc2` for ten of the stimulus assets; the CS-PR pair was added separately.

Tooling limitation discovered during recovery:
- Git object SHAs cannot be referenced across repositories; GitHub rejected a cross-repo tree entry with HTTP 422.
- Binary file retrieval as base64 is truncated by the current connector response limit, so copying large binary assets byte-for-byte through the available GitHub text/file actions is not currently reliable.
- This is a tooling-transfer blocker, not a reason to fabricate or re-encode the frozen assets.

Do not mark Wave1 recovery complete until the exact v0.4 runtime files and all 12 unchanged binary stimuli exist in `omesg360/wave1/` and pass validation.

## Remaining recovery blocker 2 — exact Calibration release mirror

Required target path:
`conflictlab/releases/calibration-v0.1/`

Known source evidence includes a Calibration admin surface with `calibration-v0.1`, `6000 ms timing gate`, TECHNICAL/CALIBRATION modes and a `retention_cleanup.php` using the private DB layer.

However, the complete frozen runtime release inventory has not yet been recovered from an authoritative source. Do not invent missing runtime files and do not substitute a partial package merely to satisfy the validator.

## Live satellite smoke status — user-verified 2026-08-22

The site owner manually tested both public satellites through the 2rasi.com entry points shortly before this checkpoint:
- Wave1 public entry/core flow: **PASS** — opens successfully.
- Calibration public entry/core flow: **PASS** — opens successfully.
- Wave1 admin surface: **NOT YET CHECKED**.
- Calibration admin surface: **NOT YET CHECKED**.

This confirms that the current Hostinger public satellite deployments are live and reachable. It does **not** confirm either admin surface. The remaining satellite blocker is therefore **not public live availability**; it is exact GitHub mirroring/provenance required for a safe future GitHub -> Hostinger operating model. Do not weaken the GitHub mirror validation gate based only on the public PASS.

## Smoke gate before production promotion

Before recovery branch can become production source, verify at minimum:
- OMESG360 homepage desktop/mobile,
- LT/EN behavior,
- privacy page and links,
- Leadership 360 homepage entry,
- `/leadership-360/` page,
- frozen Leadership 360 entry flow,
- Wave1 LT/EN URL and core flow — user-verified public PASS on 2026-08-22,
- Wave1 admin surface — still pending,
- Calibration URL and core flow — user-verified public PASS on 2026-08-22,
- Calibration admin surface — still pending,
- SEO/robots/sitemap routes,
- no broken references to old root HTML pages,
- no secrets exposed in public Git history.

The deployment workflow adds post-deploy HTTP checks, but the first production promotion should also receive a human visual/mobile review.

## After native Leadership 360 is production-live

Pending follow-up:
- update 2rasi Leadership 360 primary `Start` link to `https://omesg360.eu/leadership-360/`,
- stop presenting the raw GitHub Pages URL as the primary public product destination,
- verify final canonical/OG metadata on the live OMESG360 product page,
- decide later whether the GitHub Pages frontend remains a technical fallback/testing surface.

## Deferred / do not expand scope now

- broader OMESG360 multi-page expansion,
- frozen Leadership 360 backend redesign,
- Organization Campaign / SaaS expansion,
- Wave1/Calibration redesign,
- 2Pair feature expansion before validation data,
- cosmetic work unrelated to recovery/safe deployment.

## Next-session starting point — updated 2026-08-22

Do **not** restart V02 reconstruction or Leadership 360 integration. Those GitHub pieces are already implemented.

Continue in this order:
1. Read this file and `RECOVERY_AND_INTEGRATION_PLAN.md`.
2. Work only on `recovery/v02-clean-baseline`.
3. Treat Wave1 and Calibration public live availability as already user-verified PASS; do not spend time re-proving basic reachability unless something changes.
4. Recover/transfer the exact frozen `wave1/` mirror, including all 12 binary stimulus assets; verify known v0.4 hashes/sizes where available.
5. Check both Wave1 admin and Calibration admin surfaces separately when practical; these are live maintenance/admin smoke items, not substitutes for GitHub mirror verification.
6. Recover the authoritative complete `conflictlab/releases/calibration-v0.1/` runtime inventory and mirror it without redesign.
7. Run `scripts/validate-v02.sh`; do not proceed while it is red.
8. Once validation is green, configure the GitHub `production` Environment variables/secrets without committing credentials.
9. Run `Deploy OMESG360 to Hostinger` with `dry_run=true` only and inspect the itemized rsync plan. It must list only the managed V02/Leadership paths and must leave Wave1, Calibration, runtime config and DB paths untouched.
10. After dry-run review, perform the first controlled production deploy with backup + post-deploy smoke + human visual/mobile check.
11. Only after a clean production PASS consider making GitHub-driven deployment the normal operating model.
12. Then update the 2rasi Leadership 360 primary entry to the native OMESG360 URL.

## Continuity rule

When a new idea is explicitly accepted as `later`, `after integration`, `backlog`, or `not now`, append it to the appropriate repository roadmap before ending the session. When implemented, mark it completed or move it to an implementation record rather than deleting the history.
