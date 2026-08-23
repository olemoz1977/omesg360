# OMESG360 / 2rasi project roadmap and handover

Status: ACTIVE CONTINUITY DOCUMENT
Last updated: 2026-08-23 03:30 Europe/Vilnius
Primary GitHub branch: `main`

## Current production baseline
- Hostinger `public_html` restored manually from the known-good backup supplied on 2026-08-23.
- Hostinger Git auto-deployment from `main` to `public_html` is OFF and must stay OFF unless a new deployment contract is explicitly designed and tested.
- The restored backup remains the live server reference.
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

Satellite mirror recovery was completed through PR #4 and squash commit `54b46ade620ad6ed7af5263bd8520f7bf21c5dd8`. All 83 mirrored files were copied read-only from the restored Hostinger tree and matched against SHA256 values calculated from the uploaded known-good ZIP before being committed.

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

Wave1 and Calibration are now mirrored in GitHub for recovery/source integrity, but remain outside the normal frontend deployment package. Their two live `config.php` files remain server-only.

## Validation state
- V02/Leadership structure validation: PASS.
- Satellite GitHub mirror: 83 changed files exactly; secret config paths absent from GitHub.
- `main/wave1/index.html`: present.
- `main/conflictlab/releases/calibration-v0.1/index.html`: present.
- temporary satellite mirror workflows/manifests: removed.
- Hostinger was not written by the GitHub mirror operation; it was read-only.
- FTP connectivity has shown intermittent `max-retries exceeded`; re-check before the next intentional frontend deployment.

## Next gate
1. Keep Hostinger Git auto-deployment OFF.
2. Re-check FTP connectivity without writes.
3. Run one controlled frontend-only deployment for the Leadership/V02 managed package.
4. Human-check homepage LT/EN, Leadership page/Start, Wave1 public/admin and Calibration public/admin.
5. After Leadership is production-live and verified, change 2rasi Leadership Start to `https://omesg360.eu/leadership-360/`.

`PROJECT_ROADMAP.md` + `RECOVERY_AND_INTEGRATION_PLAN.md` remain source of truth.
