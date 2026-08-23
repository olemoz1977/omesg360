# OMESG360 / 2rasi project roadmap and handover

Status: ACTIVE CONTINUITY DOCUMENT
Last updated: 2026-08-23 03:10 Europe/Vilnius

## Current production baseline
- Hostinger `public_html` restored manually from the known-good backup.
- Hostinger Git auto-deployment from `main` to `public_html` is OFF.
- Backup is the current server reference for V02 + Wave1 + Calibration runtime.
- Runtime secrets remain Hostinger-only: `.private/`, `wave1/config.php`, `conflictlab/releases/calibration-v0.1/server/config.php`, databases and credentials.

## Root cause
The second overwrite came from Hostinger Git auto-deployment still being enabled. A safe GitHub `main` bootstrap change caused Hostinger to redeploy the old mixed `main` tree. GitHub Actions did not perform that overwrite.

## Clean GitHub source
`recovery/v02-clean-baseline` is the clean source line. It contains recovered V02, privacy/SEO, native Leadership 360 routing/presentation, LT/EN behavior, and the frontend-only deployment workflow. Never resume `agent/leadership-360-home`.

## Deployment model
Frontend-only plain FTP allowlist. GitHub never mirrors the complete Hostinger server tree.

Managed package: `index.html`, `privacy.html`, robots/sitemaps, verification files, four approved `assets/img` files, `leadership-360/index.html`.

Protected/unmanaged: `wave1/`, `conflictlab/releases/calibration-v0.1/`, runtime/admin PHP outside package, `config.php`, databases and private/server support.

No `rsync`, no `--delete`, no whole-root sync.

## Validation
- V02/Leadership structure validation: PASS after restore.
- Clean preview run `32606939263` (#29): PASS, no writes.
- Later read-only FTP check after restore timed out with `max-retries exceeded`; no writes. Re-check FTP before next intentional deployment.

## Immediate action
With Hostinger auto-deployment OFF, fast-forward `main` to the clean recovery history as a GitHub-only correction. Keep live Hostinger unchanged on the restored backup.

## Later
- Re-check FTP connectivity.
- Controlled frontend-only deployment.
- Human-check Wave1/Calibration public + admin.
- Build sanitized/hash-verified satellite mirrors separately.
- After Leadership is live/tested, change 2rasi Leadership Start to `https://omesg360.eu/leadership-360/`.

`PROJECT_ROADMAP.md` + `RECOVERY_AND_INTEGRATION_PLAN.md` remain source of truth.
