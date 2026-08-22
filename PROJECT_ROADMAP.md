# OMESG360 / 2rasi project roadmap and handover

Status: ACTIVE CONTINUITY DOCUMENT
Last updated: 2026-08-23 00:46 Europe/Vilnius
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
- Its web repository is essentially a static presentation layer, which is why its operating model is simpler.
- After native OMESG360 Leadership is live and tested, change the primary 2rasi Leadership Start link to `https://omesg360.eu/leadership-360/`.

### 2Pair satellites
- Wave1 and Calibration are active research satellites, not part of Leadership 360 product logic.
- Live state is user-verified PASS on public and admin surfaces.
- They are protected/unmanaged by the V02 / Leadership frontend deploy.
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

## Simplified deployment decision — 2026-08-23

The earlier SSH + GitHub Environment model was deliberately conservative after the overwrite incident, but it created unnecessary account setup complexity for routine frontend work.

Hostinger built-in Git Auto Deployment was reviewed as the 2rasi-like alternative, but Hostinger requires the initial Git install directory to be empty. The current OMESG360 `public_html` cannot satisfy that safely because Wave1 and Calibration already live there.

Accepted replacement: **frontend-only FTP/FTPS deploy**.

Principle:
- GitHub controls only the OMESG360 presentation files;
- Wave1, Calibration, admin/runtime PHP, `config.php`, DB and unrelated Hostinger files are never part of the deploy package;
- no remote delete operation is used;
- the workflow first verifies that the target web root contains the known Wave1 and Calibration paths before it is allowed to preview/write.

Workflow: `.github/workflows/deploy-hostinger.yml`.
Current frontend-only workflow commit: `e2e456f9ea6f8dfcc9eee455975872831445cd67`.

Managed package only:
- root `index.html`, `privacy.html`, `robots.txt`, sitemap and supported verification files;
- exact four `assets/img` files;
- `leadership-360/index.html`.

Protected/unmanaged:
- `wave1/`;
- `conflictlab/releases/calibration-v0.1/`;
- runtime/admin PHP outside the package;
- `config.php`;
- databases;
- private/server support;
- every unrelated Hostinger path.

Workflow behavior:
- PR runs perform validation + FTP **dry-run preview only**;
- real writes require explicit manual `workflow_dispatch` with `dry_run=false`;
- FTPS is forced;
- the web root is detected fail-closed and must expose both protected satellite paths;
- deployment uses a generated frontend-only package;
- there is no `--delete`, root wipe or broad rsync;
- managed frontend files are backed up to the runner before a real write;
- post-deploy HTTP smoke runs;
- managed frontend is restored if upload/smoke fails.

## Validator — PASS

`scripts/validate-v02.sh` validates the V02 / Leadership frontend release contract.

It checks:
- required V02 files;
- no legacy route references;
- Leadership placement and frozen-flow routing;
- exact four-file image allowlist;
- SEO surface;
- no forbidden runtime secrets/config files;
- frontend-only FTP deployment contract;
- no SSH/rsync or delete-based deployment behavior;
- Wave1 and Calibration remain outside the generated package.

Current validator commit: `e55baab10dc35b38bd580cda82a283b369943e19`.

Latest GitHub Actions validation:
- `Validate OMESG360 V02` run `32600511455`: **SUCCESS**.
- `Deploy OMESG360 frontend to Hostinger` run `32600511468`: release validation PASS, then expected FAIL at `Verify FTP secrets`; deploy job skipped; no Hostinger connection/write occurred.

## Only remaining one-time account setup

No GitHub Environment is required anymore. Cancel/ignore the previously started `production` Environment variable setup.

Create three GitHub **Repository secrets** under:
`Settings -> Secrets and variables -> Actions -> Repository secrets`.

Required secrets:
- `HOSTINGER_FTP_HOST`
- `HOSTINGER_FTP_USER`
- `HOSTINGER_FTP_PASSWORD`

Use a Hostinger FTP account that can access the OMESG360 `public_html`. The workflow detects whether `public_html` is the FTP root or a visible child directory, then verifies `wave1/` and `conflictlab/releases/calibration-v0.1/` before proceeding.

Do not commit or paste FTP credentials into repository files.

After these three secrets exist, re-run the failed PR preview job. It must remain dry-run only and show the frontend files that would be uploaded.

## Satellite mirror backlog — does not block frontend release

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

Do **not** restart V02 reconstruction, Leadership design, satellite smoke testing or SSH Environment setup.

Continue in this order:
1. Work only on `recovery/v02-clean-baseline`; keep PR #2 draft/unmerged.
2. Add the three Hostinger FTP repository secrets.
3. Re-run `Deploy OMESG360 frontend to Hostinger` PR job; it must perform dry-run only.
4. Review the preview. It must contain only the generated V02 / Leadership frontend package and must not contain Wave1, Calibration or runtime files.
5. If dry-run is clean, perform the first explicit manual real deploy after the workflow is available from the production source branch.
6. Confirm automatic HTTP smoke PASS.
7. Human-check desktop/mobile, LT/EN, privacy, homepage Leadership entry, `/leadership-360/`, frozen Leadership Start flow, Wave1 public/admin and Calibration public/admin.
8. If all pass, complete the recovered production-source promotion/merge decision.
9. Update 2rasi Leadership Start to the native OMESG360 path.
10. Separately finish exact Wave1 and Calibration GitHub mirrors before any satellite deployment automation.

## Final operating model

Target steady state:

GitHub work -> validation gate -> frontend-only Hostinger deployment -> post-deploy smoke -> managed frontend rollback if needed.

Routine OMESG360 presentation changes should not require manual Hostinger file uploads and must never infer that GitHub owns the entire `public_html` tree.

## Deferred / do not expand scope now

- broader OMESG360 multi-page expansion;
- frozen Leadership 360 backend redesign;
- Organization Campaign / SaaS expansion;
- Wave1/Calibration redesign;
- 2Pair feature expansion before validation data;
- cosmetic work unrelated to recovery/safe deployment.

## Continuity rule

When a new idea is explicitly accepted as later/backlog/not-now, record it in the appropriate repository roadmap before ending the session. When implemented, mark it complete or move it to an implementation record rather than erasing the history.
