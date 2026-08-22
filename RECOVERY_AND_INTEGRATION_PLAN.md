# OMESG360 recovery and Leadership 360 integration plan

Status: active recovery work
Date: 2026-08-22
Working branch: `recovery/v02-clean-baseline`

## Incident context

On 2026-08-22 an automated Git -> Hostinger deployment was connected to the OMESG360 repository using the `agent/leadership-360-home` branch. The deployment overwrote the production `omesg360.eu` file tree. Hostinger recovery work restored the production file structure to the 2026-08-20 07:12 progress state.

The current GitHub repository therefore must not be treated as a verified mirror of production until reconciliation is complete.

## Safety rules

1. Do not deploy `agent/leadership-360-home` to Hostinger.
2. Do not use the current `main` branch as a Hostinger deployment source until the recovered V02 baseline has been reconciled and verified.
3. Preserve the pre-recovery GitHub state in `archive/pre-recovery-2026-08-22`.
4. Perform cleanup and reconstruction only in `recovery/v02-clean-baseline` until smoke testing is complete.
5. Do not modify the active Wave1 or Calibration satellites during the OMESG360 homepage / Leadership 360 integration work.
6. Do not copy secrets, server credentials, `.env` values or private configuration into public Git history.

## Current coordination checkpoint — 2026-08-22 22:19 Europe/Vilnius

- The site owner is cleaning the recovered Hostinger `public_html` manually.
- GitHub recovery/cleanup is handled separately in `recovery/v02-clean-baseline`.
- Do not use GitHub writes as a shortcut to modify Hostinger during recovery.
- `main` and `agent/leadership-360-home` remain untouched by cleanup work.
- The current Hostinger image asset set intentionally kept is:
  - `assets/img/favicon.svg`
  - `assets/img/logo.svg`
  - `assets/img/og-cover.png`
  - `assets/img/og-cover.svg`
- There is no intended `public/assets` layer; the working site structure uses root `assets/`.

## Production baseline supplied from Hostinger

The recovered Hostinger `public_html` snapshot is the working visual / production baseline for V02.

Known active V02 surface:
- `index.html`
- `privacy.html`
- required logo / favicon / SEO verification assets
- Wave1 satellite
- Calibration satellite

The recovered repository also contains older root HTML files and an earlier Leadership 360 page that appear to belong to a previous / alternate site architecture. These must be reviewed and archived or removed from the clean branch rather than assumed active.

The older `assets/css/styles.css`, `assets/js/main.js`, and `assets/js/translations.js` belong to the previous/mixed multi-page architecture unless dependency review proves they are needed by the clean V02/native product build.

## Satellites that must remain intact

- `wave1/`
- `conflictlab/releases/calibration-v0.1/`
- their required server / private support files

Wave1 and Calibration are 2Pair research satellites. They are not part of the Leadership 360 migration and must not be refactored as part of this task.

## Leadership 360 source of truth

Leadership 360 product development is frozen after a clean C1 end-to-end PASS in `olemoz1977/gla360-personal-full`.

The frozen product repository is the source of truth for:
- product flow and contracts
- LT/EN behavior
- Guardian role boundaries
- pseudonymous identity / response separation
- Collector backend
- Resend invitation flow
- 90-day plan and companion handoff
- C1 / C2 cycle logic

The OMESG360 integration must not reopen or redesign this frozen product logic unless a real integration defect requires it.

Detailed future Leadership 360 product work is tracked in `olemoz1977/gla360-personal-full/FUTURE_ROADMAP.md` and should not be silently implemented during the OMESG360 integration.

## Product positioning

- `2rasi.com` remains the discovery / hook layer.
- `omesg360.eu` becomes the professional home of Leadership 360.
- The intended public path is `https://omesg360.eu/leadership-360/`.
- The technical GitHub Pages URL should eventually stop being the primary public entry point.
- After the native OMESG360 page is live and tested, the 2rasi Leadership 360 primary Start link should be changed to the OMESG360 native path.

## V02 homepage integration direction

The current OMESG360 V02 narrative is:

`Stabilize -> Standardize -> Improve`

Leadership 360 must not be presented as a fourth process-improvement stage.

Preferred placement on the homepage:
- after the principle / methodology section
- before the About section

The homepage should contain one focused Leadership 360 product card / entry point using the existing OMESG360 visual language. The full product explanation and entry flow belongs on `/leadership-360/`.

Preferred framing while only one full professional product exists: `LEADERSHIP DEVELOPMENT`, not a generic multi-product catalogue section.

## Recovery sequence

1. Inventory the recovered Hostinger snapshot and classify all root files as KEEP / ARCHIVE / REVIEW.
2. Rebuild `recovery/v02-clean-baseline` so it represents the recovered V02 structure rather than the mixed Git state.
3. Preserve Wave1 and Calibration without modification.
4. Preserve the four agreed `assets/img` files.
5. Add a native Leadership 360 homepage entry card to the clean V02 homepage.
6. Build a new `/leadership-360/` product page using OMESG360 visual language while preserving the frozen Leadership 360 contracts and backend.
7. Smoke-test navigation, LT/EN behavior, privacy links, product entry, Wave1 and Calibration.
8. Only after verification decide how the clean branch is promoted to `main` and how Hostinger deployment will be re-enabled safely.

## Deferred until after clean integration

- automatic Hostinger deployment
- deletion of archived pre-V02 content
- changing the frozen Leadership 360 backend architecture
- changing Wave1 or Calibration
- broader OMESG360 site expansion
- 2Pair feature expansion before validation data

## Durable project handover

See `PROJECT_ROADMAP.md` in this branch for the cross-project continuation state, deferred ideas, deployment gate and next-session starting point.

## Continuity rule

Any accepted but not-yet-implemented OMESG360 idea or integration decision must be written into the repository before the conversation moves on. Do not leave project-critical plans only in chat history.
