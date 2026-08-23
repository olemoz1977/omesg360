# OMESG360 / 2rasi project roadmap and handover

Status: ACTIVE CONTINUITY DOCUMENT
Last updated: 2026-08-23 03:06 Europe/Vilnius
Working branch: `recovery/v02-clean-baseline`

This file is the durable cross-session handover. `RECOVERY_AND_INTEGRATION_PLAN.md` is the detailed recovery contract. Do not resume incident-era work from chat memory alone.

## Source-of-truth boundaries

### OMESG360 production
- Hostinger recovered V02 is the accepted healthy live baseline until the first controlled recovery deploy.
- GitHub recovery/integration work happens on `recovery/v02-clean-baseline`.
- `agent/leadership-360-home` is historical incident-era work and must never be deployed.
- `archive/pre-recovery-2026-08-22` remains the historical checkpoint.

### 2026-08-23 recovery correction
- Root cause of the second overwrite was identified: Hostinger Git auto-deployment was still enabled for `olemoz1977/omesg360` `main` with target `public_html`.
- Merging the dispatcher bootstrap commit to `main` therefore caused Hostinger to redeploy the old mixed `main` tree into `public_html` even though the GitHub Actions FTP deploy itself had not written production.
- User restored the known-good `public_html` backup manually.
- Hostinger Git auto-deployment has now been disabled by the user.
- The uploaded backup is accepted as the current server recovery reference, including live Wave1 and Calibration runtime trees. Runtime secrets (`.private/`, `wave1/config.php`, `conflictlab/releases/calibration-v0.1/server/config.php`) remain Hostinger-only and must never be committed.
- With auto-deployment disabled, `main` can now be corrected without Hostinger redeploying automatically.

### Leadership 360
- Product logic is FROZEN in `olemoz1977/gla360-personal-full` after clean C1 E2E PASS.
- OMESG360 owns presentation/routing only.
- Recovery branch contains:
  - homepage `LEADERSHIP DEVELOPMENT / Leadership 360°` entry after methodology and before About;
  - native `/leadership-360/` page;
  - LT/EN behavior;
  - Start CTA to frozen `gla360-personal-full/setup-v2.html?lang=lt|en`.
- Live `omesg360.eu` currently reflects the manually restored backup; the new Leadership entry is not yet deployed through the controlled frontend workflow.

### 2rasi
- `2rasi.com` remains discovery/hook layer.
- After OMESG360 Leadership is production-live and tested, change 2rasi primary Leadership Start to `https://omesg360.eu/leadership-360/`.

### 2Pair satellites
- Wave1 and Calibration are active research satellites outside the frontend package.
- User-verified live PASS before the overwrite:
  - Wave1 public/core PASS;
  - Wave1 admin PASS, `wave1-v0.4`;
  - Calibration public/core PASS;
  - Calibration admin PASS, `calibration-v0.1`, `6000 ms timing gate`, `SERVER MODE: CALIBRATION`.
- The restored backup now provides a concrete server snapshot for both satellite trees, but runtime secrets remain excluded from GitHub.

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
- exact OMESG360 FTP root is read-only verified before preview/write;
- managed frontend is backed up before real write;
- post-deploy HTTP smoke runs for managed frontend;
- managed frontend rollback runs on upload/smoke failure;
- Wave1 and Calibration remain outside the deployment package and are human-smoke-tested after frontend deployment because Hostinger/GitHub-runner access to those URLs produced false negatives.

## Dry-run gate — PASS

Latest clean preview after the Hostinger restore and guard correction:
- workflow `Deploy OMESG360 frontend to Hostinger`
- run `32606939263` (#29)
- `validate-and-preview`: SUCCESS
- exact Hostinger root verification: SUCCESS
- preview: SUCCESS
- Hostinger writes: NONE

Validator run `32606939260` (#71): SUCCESS.

## Main-branch correction gate

Hostinger auto-deployment is now disabled, so correcting `main` will no longer trigger an automatic Hostinger redeploy.

Current repository action:
1. promote the clean recovery line to `main`;
2. keep `.private/`, `wave1/config.php`, and `conflictlab/releases/calibration-v0.1/server/config.php` out of GitHub;
3. verify `main` no longer contains the old active root multi-page surface;
4. keep Hostinger on the manually restored backup until the controlled frontend-only FTP deploy is intentionally run.

## Satellite mirror backlog

The uploaded server backup now gives a concrete snapshot of Wave1 and Calibration source/runtime trees. Before any future satellite deployment automation:
- create sanitized mirrors that exclude runtime secrets;
- verify exact file hashes against the restored Hostinger backup;
- keep satellite deployment separate from the OMESG360 frontend workflow.

## Final operating model

GitHub work -> validation -> frontend-only Hostinger deployment -> post-deploy smoke -> managed frontend rollback if needed.

GitHub owns only the OMESG360 professional presentation layer, never the complete Hostinger server tree.

## Deferred

- satellite deploy automation until sanitized exact mirrors are verified;
- broader OMESG360 multi-page expansion;
- frozen Leadership backend redesign;
- Organization Campaign / SaaS expansion;
- 2Pair feature expansion before validation data;
- cosmetic work unrelated to recovery/safe deployment.

## Continuity rule

Accepted later/backlog decisions must be recorded here or in the appropriate repository roadmap before ending a work session.
