# OMESG360 / 2rasi project roadmap and handover

Status: ACTIVE CONTINUITY DOCUMENT
Last updated: 2026-08-23 05:04 Europe/Vilnius
Primary GitHub branch: `main`

## Current production baseline
- Hostinger `public_html` restored manually from the known-good backup supplied on 2026-08-23.
- Hostinger Git auto-deployment from `main` to `public_html` is OFF and must stay OFF unless a new deployment contract is explicitly designed and tested.
- Controlled GitHub Actions -> FTP deployment is the active deployment path.
- OMESG360 V02 homepage is live.
- Leadership 360 presentation/routing is live.
- Responsive hero layout was corrected on desktop and mobile after production verification.
- Wave1 satellite was manually verified fully working in production.
- Calibration `calibration-v0.1` satellite was manually verified fully working in production.
- Runtime secrets remain Hostinger-only: `.private/`, `wave1/config.php`, `conflictlab/releases/calibration-v0.1/server/config.php`, databases and credentials.

## Root cause of second overwrite
Hostinger Git auto-deployment was still enabled. A harmless GitHub `main` bootstrap commit therefore caused Hostinger to redeploy the old mixed `main` tree into `public_html`. GitHub Actions did not perform that overwrite.

Non-negotiable rule: GitHub must not whole-root sync or delete the Hostinger `public_html` tree.

## GitHub `main` — recovered source
`main` is now the active clean source line. It contains:
- recovered OMESG360 V02 frontend and privacy/SEO surface;
- native Leadership 360 presentation/routing and LT/EN behavior;
- frontend-only Hostinger deployment workflow;
- exact recovered Wave1 non-secret runtime mirror: 16 files;
- exact recovered Calibration `calibration-v0.1` non-secret runtime mirror: 67 files.

Satellite mirror recovery was completed through PR #4 and commit `54b46ade620ad6ed7af5263bd8520f7bf21c5dd8`. All 83 mirrored files were copied read-only from the restored Hostinger tree and matched against SHA256 values calculated from the uploaded known-good ZIP before being committed.

Not committed by design:
- `wave1/config.php`;
- `conflictlab/releases/calibration-v0.1/server/config.php`;
- `.private/`;
- databases/credentials;
- Hostinger `.git/` metadata;
- `Archive/` old-site historical files and `DO_NOT_UPLOAD_HERE`, which remain part of the server backup rather than the active source/deploy surface.

Never resume `agent/leadership-360-home`. `recovery/v02-clean-baseline` is historical recovery lineage; `main` is now the active source.

## Deployment model
Frontend-only plain FTP allowlist. No `rsync`, no `--delete`, no whole-root sync.

Managed frontend package:
- `index.html`
- `privacy.html`
- robots/sitemaps and verification files
- four approved `assets/img` files
- `leadership-360/index.html`

Wave1 and Calibration are mirrored in GitHub for recovery/source integrity, but remain outside the normal frontend deployment package. Their two live `config.php` files remain server-only.

## Validation state
- Dry-run #48: PASS; exact FTP root verified; no production write.
- Controlled real frontend deployment: PASS.
- Managed production smoke checks: PASS.
- Responsive hero hotfix: deployed and user-verified corrected on desktop and mobile.
- Wave1 public/admin: manually verified fully working.
- Calibration public/admin: manually verified fully working.
- Satellite GitHub mirror: 83 files exactly; secret config paths absent from GitHub.
- Temporary recovery/hotfix workflows: removed.

## Current gate
OMESG360 production baseline is healthy and recovered. Do not re-enable Hostinger Git auto-deployment.

## Next product step
After this stable baseline, the next planned integration is to change the 2rasi Leadership Start route to `https://omesg360.eu/leadership-360/` and validate that route end-to-end.

`PROJECT_ROADMAP.md` + `RECOVERY_AND_INTEGRATION_PLAN.md` remain source of truth.
