# OMESG360 / 2rasi project roadmap and handover

Status: ACTIVE CONTINUITY DOCUMENT
Last updated: 2026-08-22 22:24 Europe/Vilnius
Working branch: `recovery/v02-clean-baseline`

This file exists so project-critical plans do not live only in chat history. Accepted but not-yet-implemented ideas and decisions must be appended here before a work session ends.

## Current source-of-truth boundaries

### OMESG360 production
- Current visual/production baseline is the recovered `omesg360.eu` V02 state restored after the 2026-08-22 Git -> Hostinger overwrite incident.
- The recovery target corresponds to progress around 2026-08-20 07:12.
- Hostinger cleanup was completed manually by the site owner after the incident.
- GitHub cleanup/reconstruction is handled in `olemoz1977/omesg360` on `recovery/v02-clean-baseline`.
- Do not treat current `main` or `agent/leadership-360-home` as a verified production mirror.

### Automation objective
- The 2026-08-22 incident does **not** cancel the Git -> Hostinger automation objective.
- The reason automation was being built is to let future OMESG360 development be handled independently through GitHub, including controlled deployment to Hostinger without routine manual file uploads by the site owner.
- The automation must be rebuilt around a verified production source branch, explicit deploy root, exclusions/protection for satellites and server/private areas, and a smoke/recovery gate.
- Automatic deployment is therefore temporarily disabled/deferred only until the clean V02 baseline and Leadership 360 native integration are proven safe.
- Final desired operating model: work in GitHub -> review/validation gate -> controlled automatic deployment to Hostinger -> post-deploy smoke check, with rollback/recovery available.

### Leadership 360
- Product is FROZEN after a clean C1 E2E PASS on 2026-08-22.
- Source of truth: `olemoz1977/gla360-personal-full`.
- Detailed future product backlog already lives in that repo as `FUTURE_ROADMAP.md`; do not duplicate or silently re-open those items here.
- Native OMESG360 integration may adapt presentation, routing and visual shell, but must preserve the frozen product contracts, privacy boundaries and backend behavior unless a real integration defect is found.

### 2rasi
- `2rasi.com` remains the discovery / hook layer.
- Leadership 360 may be described there briefly, but the professional product home should move to OMESG360.
- After the native OMESG360 path is live and tested, update the 2rasi Leadership 360 `Start`/primary product entry so it points to `https://omesg360.eu/leadership-360/` instead of the technical GitHub Pages URL.

### 2Pair satellites
- `wave1/` and `conflictlab/releases/calibration-v0.1/` are active/research satellite surfaces and must remain isolated from Leadership 360 integration work.
- Do not refactor, rename or redeploy them as part of the OMESG360 homepage/product work.
- 2Pair product development remains paused pending real validation/recruitment data; do not resume design expansion merely because OMESG360 work is active.

## GitHub safety state

Branches:
- `main` — untouched during recovery; currently contains mixed/pre-recovery work.
- `agent/leadership-360-home` — historical/agent work; NEVER use as Hostinger deployment source.
- `omesg360bot-worker` — Telegram bot worker branch; unrelated to site recovery.
- `archive/pre-recovery-2026-08-22` — immutable checkpoint of the pre-recovery GitHub state.
- `recovery/v02-clean-baseline` — only branch for current cleanup and native integration.

Do not re-enable automatic Hostinger deployment until the recovery branch is reconciled, smoke-tested, and explicitly promoted. This is a temporary safety gate, not a decision to abandon automation.

## V02 visual/product baseline

Current OMESG360 homepage identity:
- dark professional visual system,
- OMESG360 header with LT/EN and LinkedIn,
- primary narrative: `Stabilize. Standardize. Improve.`,
- principle/methodology blocks,
- About and contact sections.

Leadership 360 must not appear as a fourth process-improvement stage.

### Homepage Leadership 360 entry

Planned placement:
- after the principle/methodology block,
- before the About section.

Planned role:
- one focused professional product card/entry point,
- native OMESG360 visual language,
- concise explanation only,
- CTA to `/leadership-360/`.

Suggested semantic framing:
- `LEADERSHIP DEVELOPMENT` rather than a generic `PRODUCTS` section while only one full professional product is present.

## Native Leadership 360 page — not yet implemented

Target public path:
`https://omesg360.eu/leadership-360/`

The page should be rebuilt as a native OMESG360 surface, not copied visually from 2rasi or from the old pre-freeze OMESG360 page.

It should explain at professional-product level:
- what problem Leadership 360 solves,
- who it is for,
- C1 -> feedback -> report -> 90-day plan -> C2 cycle,
- 75 statements / 15 competencies,
- Guardian role and boundaries,
- pseudonymous/privacy model,
- what the leader receives,
- what happens between C1 and C2,
- selected development actions / companion handoff,
- development/reflection positioning (not diagnosis or automated personnel decisions),
- clear start/entry CTA into the frozen Leadership 360 flow.

Do not expose technical repository/Worker architecture in the marketing/product copy unless needed for privacy transparency.

## Asset decision recorded 2026-08-22

For V02 keep these image assets:
- `assets/img/favicon.svg`
- `assets/img/logo.svg`
- `assets/img/og-cover.png`
- `assets/img/og-cover.svg`

The older root `assets/css/styles.css`, `assets/js/main.js`, and `assets/js/translations.js` belong to the previous/mixed multi-page architecture unless proven needed by the clean V02/native product build. Treat them as legacy/review items, not as authoritative V02 dependencies.

Do not invent a `public/assets` layer; the current hosting/repo structure uses root `assets/`.

## Cleanup direction — pending in GitHub recovery branch

Goal: reconstruct a clean GitHub representation of the V02 production site without touching satellite behavior.

Expected active surface after reconciliation:
- `index.html`
- `privacy.html`
- required SEO/verification files
- `assets/img/` required visual/SEO assets
- `wave1/`
- `conflictlab/releases/calibration-v0.1/`
- required private/server support files that are safe/appropriate for the existing repository model
- new native `leadership-360/` once built

Older standalone root pages such as `about.html`, `approach.html`, `services.html`, `blog.html`, `esg.html`, `atsiliepimai.html`, `contact.html` and the old pre-freeze `leadership-360/index.html` are not assumed active V02 pages. Archive/remove them from the clean branch only after dependency review.

Never copy secrets or live credentials from Hostinger into GitHub.

## Deployment automation — temporary safety gate, final target retained

Not yet implemented / must be rebuilt safely:
1. Establish one verified production source branch.
2. Verify exact Hostinger deploy root and exclusion rules.
3. Ensure deploy cannot erase Wave1, Calibration, private/server support, or unrelated directories.
4. Add a pre-deploy checklist / smoke gate.
5. Test deployment against a safe target or reversible workflow before reconnecting production.
6. Add a post-deploy smoke check and a practical rollback/recovery path.
7. Only then re-enable automatic GitHub -> Hostinger deployment.

The intended end state is **not** permanent manual Hostinger maintenance. The intended end state is that OMESG360 site changes can be implemented in GitHub and deployed independently and safely, with the site owner needed only for exceptional hosting/account actions or approvals that cannot be performed through the available tooling.

The 2026-08-22 incident must not be repeated by pointing Hostinger at an unverified feature/agent branch or deploying an unverified repository tree as if it were the whole production `public_html`.

## Smoke test gate before promotion

Before recovery branch can become production source, verify at minimum:
- OMESG360 homepage desktop/mobile,
- LT/EN switch behavior,
- privacy page and links,
- Leadership 360 homepage card,
- `/leadership-360/` page,
- Leadership 360 start/entry flow,
- Wave1 URL and core flow,
- Calibration URL and core flow,
- SEO/robots/sitemap routes,
- no broken references to old root HTML pages,
- no secrets exposed in public Git history.

## After native Leadership 360 goes live

Pending follow-up:
- update 2rasi Leadership 360 primary `Start` link to OMESG360 native path,
- optionally keep 2rasi `About` page as the discovery/hook explanation,
- stop presenting the raw GitHub Pages URL as the primary public product destination,
- verify canonical/OG metadata for the new OMESG360 product page,
- decide whether the old GitHub Pages frontend remains as technical fallback/testing surface or becomes non-primary/archive-only.

## Deferred / do not expand scope now

- broader OMESG360 multi-page site expansion,
- redesigning the frozen Leadership 360 backend,
- Organization Campaign mode / SaaS expansion (tracked in Leadership 360 `FUTURE_ROADMAP.md`),
- C2 roster refinements and other frozen Leadership backlog items,
- Wave1/Calibration redesign,
- 2Pair feature expansion before validation data,
- cosmetic cleanup that is not required for recovery or native Leadership integration.

## Next-session starting point

1. Read `RECOVERY_AND_INTEGRATION_PLAN.md` and this file.
2. Work only on `recovery/v02-clean-baseline`.
3. Reconcile/clean GitHub structure against the recovered V02 model.
4. Preserve Wave1, Calibration and the four `assets/img` files.
5. Build the homepage Leadership 360 entry and native `/leadership-360/` page.
6. Smoke-test the clean integration.
7. Then finish the safe GitHub -> Hostinger automation so future site work can be deployed independently rather than relying on manual Hostinger file operations.

## Continuity rule

When a new idea is explicitly accepted as `later`, `after integration`, `backlog`, or `not now`, append it to the appropriate repository roadmap before ending the session. When implemented, mark it completed or move it to a changelog/implementation record rather than deleting the history.
