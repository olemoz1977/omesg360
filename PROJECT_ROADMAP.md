# OMESG360 / 2rasi project roadmap and handover

Status: ACTIVE CONTINUITY DOCUMENT
Last updated: 2026-08-22 23:40 Europe/Vilnius
Working branch: `recovery/v02-clean-baseline`

This file is the durable cross-session handover for OMESG360 / 2rasi work. `RECOVERY_AND_INTEGRATION_PLAN.md` contains the detailed recovery rules. Do not resume old incident-era work from chat memory alone.

## Current source-of-truth boundaries

### OMESG360 production
- The recovered Hostinger V02 state is accepted as the healthy live baseline for the current release work.
- Do not make routine manual Hostinger edits during recovery.
- GitHub work happens only in `olemoz1977/omesg360` on `recovery/v02-clean-baseline`.
- Current `main` is not yet the verified production source.
- `agent/leadership-360-home` is historical incident-era work and must never be used as the Hostinger source.

### Leadership 360
- Product logic is FROZEN after the clean C1 E2E PASS in `olemoz1977/gla360-personal-full`.
- OMESG360 owns presentation/routing only.
- Frozen scoring, Collector, Guardian, invitation, privacy, C1/C2 and 90-day-plan contracts remain unchanged unless a genuine integration defect is found.
- Future product backlog remains in `gla360-personal-full/FUTURE_ROADMAP.md`.

### 2rasi
- `2rasi.com` remains the discovery / hook layer.
- After native OMESG360 Leadership is live and tested, change the primary 2rasi Leadership Start link to `https://omesg360.eu/leadership-360/`.

### 2Pair satellites
- Wave1 and Calibration are active research satellites, not part of Leadership 360 product logic.
- Live state is user-verified PASS on public and admin surfaces.
- They are protected/unmanaged by the first recovered V02 / Leadership deploy.
- Exact GitHub mirrors remain a separate recovery task required before satellite deployment itself is automated.

## GitHub safety state

Branches:
- `main` — mixed/pre-recovery state; not production source yet.
- `agent/leadership-360-home` — historical/incident work; never deploy.
- `omesg360bot-worker` — unrelated Telegram worker branch.
- `archive/pre-recovery-2026-08-22` — pre-recovery checkpoint.
- `recovery/v02-clean-baseline` — only active recovery / integration / deployment-safety branch.

Draft PR #2 `Recovery V02 + Leadership 360 release candidate` is open from `recovery/v02-clean-baseline` to `main` only for CI/review. It must stay draft and must not be merged until the deployment gates below pass.

## Hostinger live smoke — accepted baseline

User-verified on 2026-08-22:
- recovered OMESG360 V02 homepage: accepted baseline;
- Wave1 public/core flow: PASS;
- Wave1 admin: PASS, screenshot confirms read-only `wave1-v0.4`;
- Calibration public/core flow: PASS;
- Calibration admin: PASS, screenshot confirms `calibration-v0.1`, `6000 ms timing gate`, `SERVER MODE: CALIBRATION` and rendered admin stats.

Calibration `0 / 20 calibration eligible clean primary` is an empty research-data state, not an admin failure.

## Implemented in `recovery/v02-clean-baseline`

### Recovered V02 surface
- `index.html` rebuilt from the recovered V02 source, not the old mixed multi-page architecture.
- V02 keeps inline CSS/JS, LT/EN switching, root `/assets/img/...`, and `Stabilize. Standardize. Improve.` positioning.
- `privacy.html` restored to the V02 privacy centre.
- `robots.txt`, `sitemap.xml`, `sitemap_location.xml` reconciled to active routes.
- Old root multi-page pages are not part of the active V02 surface.
- V02 does not depend on old `assets/css/styles.css`, `assets/js/main.js`, or `assets/js/translations.js`.

Approved shared images, exactly:
- `assets/img/favicon.svg`
- `assets/img/logo.svg`
- `assets/img/og-cover.png`
- `assets/img/og-cover.svg`

### Leadership 360 native integration
- Homepage entry is already present in GitHub under `LEADERSHIP DEVELOPMENT` / `Leadership 360°`.
- Placement: after methodology/principle, before About; never a fourth `Stabilize -> Standardize -> Improve` stage.
- Homepage CTA routes to `/leadership-360/?lang=lt|en`.
- Native `/leadership-360/index.html` is implemented in OMESG360 visual language.
- Native page routes Start into the frozen flow:
  - LT `https://olemoz1977.github.io/gla360-personal-full/setup-v2.html?lang=lt`
  - EN `https://olemoz1977.github.io/gla360-personal-full/setup-v2.html?lang=en`
- The live `omesg360.eu` does **not yet** show this card/page because no recovered GitHub deployment has been executed yet.

Historical implementation commits include:
- V02 homepage baseline `4b9fe9858d8f510f41e849d15ad44097da57ab11`
- privacy baseline `fa5f62988686c60ef742b94501a28963a68f188d`
- native Leadership page `387ba362d0d04292d0e5310cc56ffd86eb029ee7`
- homepage Leadership integration `d0b581c3677de475ef3bd097601d6eeccfef23b3`

## Deployment safety model

Workflow: `.github/workflows/deploy-hostinger.yml`.

Managed paths only:
- root `index.html`, `privacy.html`, `robots.txt`, sitemap and supported verification files;
- `assets/img/`;
- `leadership-360/`.

Protected/unmanaged paths:
- `wave1/`;
- `conflictlab/releases/calibration-v0.1/`;
- runtime `config.php`;
- databases;
- private/server support;
- every unrelated Hostinger path.

Rules:
- no root-level `rsync --delete`;
- `--delete` only inside explicitly managed directories;
- manual `workflow_dispatch` during recovery;
- `dry_run=true` by default;
- GitHub `production` Environment;
- pinned SSH known-host check;
- no parallel production deploys;
- backup managed paths before a real write;
- post-deploy HTTP smoke;
- rollback only managed paths on failure.

## Validator — PASS

`scripts/validate-v02.sh` validates the managed V02 / Leadership release contract.

It checks:
- required V02 files;
- no legacy route references;
- Leadership placement and frozen-flow routing;
- exact four-file image allowlist;
- SEO surface;
- no forbidden runtime secrets/config files;
- deploy workflow safety contract;
- no root-level destructive sync;
- Wave1 and Calibration remain protected/unmanaged.

Validator hardening commit: `4997745c5f792464ccf746294b5f143a9bbba349`.

GitHub Actions validation was executed through draft PR #2:
- workflow: `Validate OMESG360 V02`
- run id: `32597286998`
- job `validate`: **SUCCESS**
- checkout: PASS
- `Validate recovered V02 surface`: PASS

PR diff audit also confirms that neither `wave1/` nor `conflictlab/releases/calibration-v0.1/` is changed by the recovery PR. The branch is ahead of `main` and not behind it.

## Current external gate — GitHub `production` Environment

The GitHub connector available in this workspace can modify repository files and inspect CI, but it does not expose GitHub Environment / Actions secrets or variables creation APIs. No installable Hostinger/hPanel deployment plugin is available.

Therefore one one-time account-level setup remains outside the assistant's direct tooling before the first dry-run.

Environment name: `production`.

Variables:
- `HOSTINGER_HOST`
- `HOSTINGER_USER`
- `HOSTINGER_PORT`
- `HOSTINGER_PUBLIC_PATH`
- `HOSTINGER_BACKUP_PATH`

Secrets:
- `HOSTINGER_SSH_PRIVATE_KEY`
- `HOSTINGER_KNOWN_HOSTS`

Never commit these values and do not paste private credentials into roadmap/source files.

Once those values exist in GitHub, the next action is the `Deploy OMESG360 to Hostinger` workflow with `dry_run=true` only.

## Satellite mirror backlog — no longer blocking V02 / Leadership release

### Wave1
Known real v0.4 package provenance:
- `index.html` 18,823 bytes, SHA256 `66aa836730d0e866e64a2301d211dac0c55d9d9284a9fc4ef1f7316a7d9e0730`
- `api.php` 5,362 bytes, SHA256 `ef886f21e6cf2059693e47fe398a6c57a44a4c56d924126742cf3edac6d7ff00`
- `admin.php` 15,532 bytes, SHA256 `21dc5c3dcb879b6a8fd83e63d5c567f15be66c19b61a65b5738c32a44c44af0e`
- `migrate_v04_language.sql` 532 bytes, SHA256 `d8a22dec773236f2b1c7081c87d0391b718238eb14a8bc223f1a55e1d9bb57ae`
- `README_DEPLOY.txt` 1,778 bytes, SHA256 `8869e2c5c38444f4773871a77ce9e3a0d360c0721c947265f82effde220781e1`

Wave1 v0.4 reuses the same 12 frozen v0.3 stimulus assets. Exact mirror work remains pending because current connector transfer is not reliable for the binary set.

### Calibration
The live `calibration-v0.1` public/admin surfaces are verified, but the authoritative complete runtime source inventory has not yet been mirrored into this repository.

Do not fabricate either satellite mirror. Recover them separately before automating satellite deployment.

## Immediate starting point

Do **not** restart V02 reconstruction, Leadership page design, validator work, or satellite live testing. Those are already resolved for this release.

Continue in this order:
1. Read this file and `RECOVERY_AND_INTEGRATION_PLAN.md`.
2. Work only on `recovery/v02-clean-baseline`.
3. Keep draft PR #2 unmerged.
4. Complete the one-time GitHub `production` Environment variables/secrets setup.
5. Run `Deploy OMESG360 to Hostinger` with `dry_run=true` only.
6. Inspect the itemized rsync plan. It must contain only managed V02 / Leadership paths and must leave Wave1, Calibration, runtime config and DB paths untouched.
7. If dry-run is clean, execute the first controlled real deploy with backup and post-deploy smoke.
8. Human-check desktop/mobile, LT/EN, privacy, homepage Leadership entry, `/leadership-360/`, frozen Leadership Start flow, Wave1 public/admin and Calibration public/admin.
9. If all pass, decide promotion of the recovered release to the normal production source model and only then finish/merge the release PR as appropriate.
10. Update 2rasi Leadership Start to the native OMESG360 path.
11. Separately finish exact Wave1 and Calibration GitHub mirrors before any satellite deployment automation.

## Final operating model

Target steady state:

GitHub work -> validation gate -> controlled Hostinger deployment -> post-deploy smoke -> rollback/recovery if needed.

Routine OMESG360 site changes should not require manual Hostinger file uploads.

## Deferred / do not expand scope now

- broader OMESG360 multi-page expansion;
- frozen Leadership 360 backend redesign;
- Organization Campaign / SaaS expansion;
- Wave1/Calibration redesign;
- 2Pair feature expansion before validation data;
- cosmetic work unrelated to recovery/safe deployment.

## Continuity rule

When a new idea is explicitly accepted as later/backlog/not-now, record it in the appropriate repository roadmap before ending the session. When implemented, mark it complete or move it to an implementation record rather than erasing the history.
