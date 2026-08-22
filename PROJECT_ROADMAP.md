# OMESG360 / 2rasi project roadmap and handover

Status: ACTIVE CONTINUITY DOCUMENT
Last updated: 2026-08-23 01:34 Europe/Vilnius
Working branch: `recovery/v02-clean-baseline`

This file is the durable cross-session handover. `RECOVERY_AND_INTEGRATION_PLAN.md` is the detailed recovery contract. Do not resume incident-era work from chat memory alone.

## Source-of-truth boundaries

### OMESG360 production
- Hostinger recovered V02 is the accepted healthy live baseline until the first controlled recovery deploy.
- GitHub recovery/integration work happens on `recovery/v02-clean-baseline`.
- `main` still contains the old/mixed site content and is NOT yet the production site source.
- Exception: `main` now contains only one intentionally safe deployment-dispatcher stub under `.github/workflows/deploy-hostinger.yml`; this does not promote old `main` site content and cannot deploy `main`.
- `agent/leadership-360-home` is historical incident-era work and must never be deployed.
- `archive/pre-recovery-2026-08-22` remains the historical checkpoint.

### Leadership 360
- Product logic is FROZEN in `olemoz1977/gla360-personal-full` after clean C1 E2E PASS.
- OMESG360 owns presentation/routing only.
- Recovery branch contains:
  - homepage `LEADERSHIP DEVELOPMENT / Leadership 360°` entry after methodology and before About;
  - native `/leadership-360/` page;
  - LT/EN behavior;
  - Start CTA to frozen `gla360-personal-full/setup-v2.html?lang=lt|en`.
- Live `omesg360.eu` does not yet show this new entry/page because no real recovery deploy has run.

### 2rasi
- `2rasi.com` remains discovery/hook layer.
- Its static web repo is operationally simpler than OMESG360.
- After OMESG360 Leadership is production-live and tested, change 2rasi primary Leadership Start to `https://omesg360.eu/leadership-360/`.

### 2Pair satellites
- Wave1 and Calibration are active research satellites outside the frontend package.
- User-verified live PASS:
  - Wave1 public/core PASS;
  - Wave1 admin PASS, screenshot confirms read-only `wave1-v0.4`;
  - Calibration public/core PASS;
  - Calibration admin PASS, screenshot confirms `calibration-v0.1`, `6000 ms timing gate`, `SERVER MODE: CALIBRATION`.
- Exact GitHub mirrors remain separate backlog before satellite deployment itself is automated.

## Recovered V02 GitHub surface

Implemented on `recovery/v02-clean-baseline`:
- recovered V02 `index.html` and `privacy.html`;
- active `robots.txt`, `sitemap.xml`, `sitemap_location.xml`;
- old root multi-page architecture removed from active recovery surface;
- approved shared images exactly:
  - `assets/img/favicon.svg`
  - `assets/img/logo.svg`
  - `assets/img/og-cover.png`
  - `assets/img/og-cover.svg`

Historical commits:
- homepage baseline `4b9fe9858d8f510f41e849d15ad44097da57ab11`
- privacy baseline `fa5f62988686c60ef742b94501a28963a68f188d`
- native Leadership page `387ba362d0d04292d0e5310cc56ffd86eb029ee7`
- homepage Leadership integration `d0b581c3677de475ef3bd097601d6eeccfef23b3`

Draft PR #2 `Recovery V02 + Leadership 360 release candidate` stays draft/unmerged until real production deploy, automatic smoke and human checks pass.

## Deployment model — FINALIZED

Accepted model: **frontend-only plain FTP deployment**, never whole-server mirroring.

Verified connection facts:
- FTP host `46.202.142.134` is public and stored in workflow;
- FTP port 21 / plain FTP;
- only repository secrets required: `HOSTINGER_FTP_USER`, `HOSTINGER_FTP_PASSWORD`;
- verified remote root: `/domains/omesg360.eu/public_html`.

Managed package only:
- `index.html`
- `privacy.html`
- `robots.txt`
- `sitemap.xml`
- `sitemap_location.xml`
- verification files if present
- four approved `assets/img` files
- `leadership-360/index.html`

Protected/unmanaged:
- `wave1/`
- `conflictlab/releases/calibration-v0.1/`
- runtime/admin PHP outside package
- `config.php`
- databases
- private/server support
- every unrelated Hostinger path

Safety contract:
- PR execution is preview-only;
- real writes require explicit manual `workflow_dispatch` with `dry_run=false`;
- no `rsync`, no `--delete`, no broad remote sync;
- exact OMESG360 root + both satellites are read-only verified before preview/write;
- managed frontend is backed up before real write;
- post-deploy HTTP smoke runs;
- managed frontend rollback runs on upload/smoke failure.

Functional workflow commit: `e82c800654f6a70df8003350a6eba9ce4d5d69e0`.
Validator commit: `6491f57c0e1b2a66721e777f396e52b03e01ff8d`.
Temporary FTP diagnostic removed in `ab480516e08509ebcaafd0c09f28afea1f5b0b87`.

## Dry-run gate — PASS

Clean preview:
- workflow `Deploy OMESG360 frontend to Hostinger`
- run `32602460929`
- `validate-and-preview`: SUCCESS
- real `deploy`: SKIPPED
- Hostinger writes: NONE

Proved:
- validator PASS;
- FTP credentials accepted;
- exact remote root reachable;
- Wave1 + Calibration detected and protected;
- targets are directly under real `public_html`, not `.deploy-package`;
- preview contains only managed frontend files;
- no protected/runtime paths appear.

An earlier dry-run exposed a `.deploy-package` target-path bug. It was caught before any write and fixed. This is why dry-run remains mandatory.

## Manual-dispatch bootstrap — COMPLETE

GitHub requires a `workflow_dispatch` workflow file on the default branch before the Run workflow control is available.

Completed safely:
- bootstrap branch `bootstrap/frontend-deploy-workflow` created from old `main`;
- PR #3 contained exactly one file: `.github/workflows/deploy-hostinger.yml`;
- PR #3 merged as commit `2cfd4c0df04859374d0d22b7ba618c686461dc45`;
- the `main` version is a fail-safe dispatcher stub only: if run on legacy `main`, it exits with failure and writes nothing;
- recovery retains the full validated deployment workflow;
- bootstrap commit was integrated into recovery history in merge commit `a159cd10d335f8df8c17c37360b26dee59594ce2`, preserving the recovery workflow and keeping PR #2 mergeable.

## Immediate next gate — FIRST REAL DEPLOY

One manual GitHub UI action is required because the connected GitHub tool cannot issue `workflow_dispatch` itself:
1. Repo -> Actions -> `Deploy OMESG360 frontend to Hostinger`.
2. Click `Run workflow`.
3. Branch: **`recovery/v02-clean-baseline`**.
4. Set `dry_run` to **false**.
5. Run workflow once.

Then verify:
- backup step PASS;
- upload PASS;
- automatic HTTP smoke PASS;
- homepage desktop/mobile;
- LT/EN;
- privacy;
- Leadership homepage card;
- `/leadership-360/`;
- frozen Leadership Start flow;
- Wave1 public/admin;
- Calibration public/admin.

Only after all PASS decide final recovery -> `main` promotion/merge and update the 2rasi Leadership Start link.

## Satellite mirror backlog

### Wave1
Known real v0.4 package provenance:
- `index.html` 18,823 bytes, SHA256 `66aa836730d0e866e64a2301d211dac0c55d9d9284a9fc4ef1f7316a7d9e0730`
- `api.php` 5,362 bytes, SHA256 `ef886f21e6cf2059693e47fe398a6c57a44a4c56d924126742cf3edac6d7ff00`
- `admin.php` 15,532 bytes, SHA256 `21dc5c3dcb879b6a8fd83e63d5c567f15be66c19b61a65b5738c32a44c44af0e`
- `migrate_v04_language.sql` 532 bytes, SHA256 `d8a22dec773236f2b1c7081c87d0391b718238eb14a8bc223f1a55e1d9bb57ae`
- `README_DEPLOY.txt` 1,778 bytes, SHA256 `8869e2c5c38444f4773871a77ce9e3a0d360c0721c947265f82effde220781e1`

Wave1 v0.4 reuses 12 frozen v0.3 stimulus assets. Exact binary mirror remains pending.

### Calibration
Live `calibration-v0.1` is verified public/admin, but authoritative complete runtime source inventory remains to be mirrored.

Do not fabricate satellite mirrors. Satellite automation stays separate from frontend workflow.

## Final operating model

GitHub work -> validation -> frontend-only Hostinger deployment -> post-deploy smoke -> managed frontend rollback if needed.

GitHub owns only the OMESG360 professional presentation layer, never the complete Hostinger server tree.

## Deferred

- broader OMESG360 multi-page expansion;
- frozen Leadership backend redesign;
- Organization Campaign / SaaS expansion;
- Wave1/Calibration redesign or deploy automation before exact mirrors;
- 2Pair feature expansion before validation data;
- cosmetic work unrelated to recovery/safe deployment.

## Continuity rule

Accepted later/backlog decisions must be recorded here or in the appropriate repository roadmap before ending a work session.
