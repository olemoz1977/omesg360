# OMESG360 recovery and Leadership 360 integration plan

Status: ACTIVE — first controlled deploy ready
Date: 2026-08-23
Working branch: `recovery/v02-clean-baseline`

## Source of truth

This file and `PROJECT_ROADMAP.md` are the source of truth. Do not resume `agent/leadership-360-home`. Recovery release stays on `recovery/v02-clean-baseline` until production validation is complete.

## Incident rule

On 2026-08-22 an unverified Git tree was deployed as if GitHub owned the complete Hostinger `public_html`, overwriting production. Hostinger was manually recovered afterward.

Non-negotiable rule:
**GitHub must never again imply ownership of the complete Hostinger server tree.**

## Accepted live baseline

Hostinger recovered V02 is accepted as healthy live baseline until the first controlled recovery deploy.

User-verified:
- OMESG360 V02 homepage accepted;
- Wave1 public/core PASS;
- Wave1 admin PASS, `wave1-v0.4`;
- Calibration public/core PASS;
- Calibration admin PASS, `calibration-v0.1`, `6000 ms timing gate`, `SERVER MODE: CALIBRATION`.

## Protected paths

Outside the frontend deploy contract:
- `wave1/`
- `conflictlab/releases/calibration-v0.1/`
- runtime/admin PHP outside generated package
- `config.php`
- databases
- private/server support
- unrelated Hostinger files/directories

Frontend deployment MUST NOT copy, delete, rename or replace these paths.

Exact Wave1/Calibration GitHub mirrors remain a separate later requirement before satellite deployment automation.

## Recovered V02 + Leadership state

Implemented on recovery branch:
- V02 `index.html`;
- V02 `privacy.html`;
- active robots/sitemaps;
- exactly four shared `assets/img` files;
- old multi-page root architecture removed from active recovery surface;
- Leadership homepage card after methodology and before About;
- native `/leadership-360/`;
- LT/EN behavior;
- Start CTA into frozen `gla360-personal-full/setup-v2.html?lang=lt|en`.

Leadership product logic stays frozen in `olemoz1977/gla360-personal-full`; OMESG360 owns presentation/routing only.

Live `omesg360.eu` still does not show the new Leadership entry because no real recovery deploy has run yet.

## Final deployment implementation

Model: **frontend-only plain FTP**.

Full recovery workflow:
`.github/workflows/deploy-hostinger.yml`

Connection contract:
- FTP host `46.202.142.134` stored openly in workflow;
- port 21 / plain FTP;
- repository secrets only: `HOSTINGER_FTP_USER`, `HOSTINGER_FTP_PASSWORD`;
- verified remote root `/domains/omesg360.eu/public_html`.

Generated package only:
- `index.html`
- `privacy.html`
- `robots.txt`
- `sitemap.xml`
- `sitemap_location.xml`
- verification files if present
- four approved `assets/img` files
- `leadership-360/index.html`

Safety behavior:
1. Validate V02/Leadership contract.
2. Verify FTP secrets.
3. Build explicit frontend package.
4. Read-only verify exact remote root plus Wave1 and Calibration.
5. PR runs are dry-run only.
6. Real writes require manual `workflow_dispatch` with `dry_run=false`.
7. No `rsync`, no `--delete`, no broad tree sync.
8. Back up managed frontend before real write.
9. Upload only generated package.
10. Run post-deploy HTTP smoke.
11. Restore managed frontend on upload/smoke failure.

Functional workflow commit: `e82c800654f6a70df8003350a6eba9ce4d5d69e0`.
Validator commit: `6491f57c0e1b2a66721e777f396e52b03e01ff8d`.
Temporary FTP diagnostic has been removed.

## Dry-run proof — PASS

Clean preview run `32602460929`:
- `validate-and-preview`: SUCCESS;
- real `deploy`: SKIPPED;
- Hostinger write: NONE.

Proved:
- credentials accepted;
- exact remote root reachable;
- Wave1 and Calibration detected before preview;
- target paths directly under real `public_html`;
- only managed frontend files in plan;
- no protected/runtime paths.

An earlier preview exposed a wrong `.deploy-package` remote target. It was caught before any write and fixed before release.

## Default-branch dispatcher bootstrap — COMPLETE

GitHub requires a `workflow_dispatch` workflow file on the default branch to expose manual Run workflow controls.

Completed:
- bootstrap branch `bootstrap/frontend-deploy-workflow` created from legacy `main`;
- PR #3 changed exactly one file: `.github/workflows/deploy-hostinger.yml`;
- PR #3 merged into `main` as `2cfd4c0df04859374d0d22b7ba618c686461dc45`;
- `main` workflow is a fail-safe stub: running it on legacy `main` exits and writes nothing;
- no website/frontend/runtime file in `main` was changed by bootstrap;
- recovery keeps the full deployment workflow;
- bootstrap commit integrated into recovery history as `a159cd10d335f8df8c17c37360b26dee59594ce2`, so draft PR #2 remains mergeable.

## Immediate next step — ONE MANUAL UI ACTION

The connected GitHub tool cannot itself call `workflow_dispatch`, so the first real deploy requires one user click sequence:

1. Open repo `Actions`.
2. Select `Deploy OMESG360 frontend to Hostinger`.
3. Click `Run workflow`.
4. Branch: **`recovery/v02-clean-baseline`**.
5. Set `dry_run` to **false**.
6. Run workflow.

Do NOT select `main`; its stub intentionally fails and cannot deploy the legacy site.

After launch, inspect:
- backup PASS;
- upload PASS;
- HTTP smoke PASS for LT/EN homepage, privacy, Leadership native page, frozen product entry, Wave1, Calibration, robots/sitemap.

Then human-check desktop/mobile, LT/EN, Leadership card/page and both satellite public/admin surfaces.

Keep recovery PR #2 draft until all production checks pass. Only then decide final recovery -> `main` promotion and update 2rasi Leadership Start to `https://omesg360.eu/leadership-360/`.

## Safety rules

1. Never deploy `agent/leadership-360-home`.
2. Never deploy legacy `main` site content.
3. Keep recovery PR #2 draft until real deploy + smoke + human checks pass.
4. Never commit FTP password or runtime secrets.
5. Never add satellites/runtime/DB to frontend package.
6. Never add delete-based whole-root synchronization.
7. Future satellite automation requires exact mirrors and separate validation contract.

## Final operating model

GitHub work -> validation -> frontend-only Hostinger deployment -> post-deploy smoke -> managed frontend rollback if needed.

GitHub owns only OMESG360 professional presentation layer, not the full server tree.

## Deferred

- exact Wave1 mirror and satellite deploy automation;
- exact Calibration mirror and satellite deploy automation;
- broader OMESG360 multi-page expansion;
- frozen Leadership backend redesign;
- Organization Campaign / SaaS expansion;
- cosmetic work unrelated to recovery/safe deployment.

## Continuity rule

Project-critical decisions must be written here or in `PROJECT_ROADMAP.md`, not left only in chat history.
