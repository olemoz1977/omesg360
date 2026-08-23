# OMESG360 / 2rasi project roadmap and handover

Status: ACTIVE CONTINUITY DOCUMENT
Last updated: 2026-08-23 03:09 Europe/Vilnius
Working branch: `recovery/v02-clean-baseline`

This file is the durable cross-session handover. `RECOVERY_AND_INTEGRATION_PLAN.md` is the detailed recovery contract. Do not resume incident-era work from chat memory alone.

## Current production baseline

- Hostinger `public_html` was manually restored from the known-good backup after the second overwrite.
- Hostinger Git auto-deployment from `olemoz1977/omesg360` `main` to `public_html` is now disabled.
- The restored backup is the server reference for V02 + Wave1 + Calibration runtime.
- Runtime secrets remain Hostinger-only and must never be committed: `.private/`, `wave1/config.php`, `conflictlab/releases/calibration-v0.1/server/config.php`, databases and credentials.

## Root cause recorded

The second overwrite did not come from the new FTP workflow. Manual run #22 stopped before deploy and later PR runs were preview-only. The overwrite was caused by the still-enabled Hostinger Git auto-deployment reacting to the `main` bootstrap merge and redeploying the old mixed `main` tree into `public_html`.

## GitHub target state

- Clean line: `recovery/v02-clean-baseline`.
- Historical incident line `agent/leadership-360-home` must never be deployed.
- Old active root multi-page surface must not remain in corrected `main`.
- Recovery contains V02, privacy, SEO files, native Leadership 360 entry/page, LT/EN behavior and controlled frontend-only deployment workflow.
- Leadership product logic stays frozen in `olemoz1977/gla360-personal-full`.

## Deployment model

Final model: **frontend-only plain FTP allowlist**, never whole-server Git mirroring.

Managed frontend package:
- `index.html`
- `privacy.html`
- `robots.txt`
- `sitemap.xml`
- `sitemap_location.xml`
- verification files if present
- `assets/img/favicon.svg`
- `assets/img/logo.svg`
- `assets/img/og-cover.png`
- `assets/img/og-cover.svg`
- `leadership-360/index.html`

Protected/unmanaged:
- `wave1/`
- `conflictlab/releases/calibration-v0.1/`
- PHP runtime outside package
- `config.php`
- databases
- private/server support

No `rsync`, no `--delete`, no whole-root sync.

## Current validation

- V02/Leadership structure validator: PASS after Hostinger restore.
- Clean FTP preview previously passed in run `32606939263` (#29), no writes.
- A later preview after backup restore hit a read-only FTP connectivity timeout (`max-retries exceeded`), no writes. Re-check FTP connectivity before the next intentional deploy.

## Immediate repository action

Because Hostinger auto-deployment is now OFF, correct `main` as a GitHub-only operation:
1. fast-forward `main` to the clean recovery history;
2. verify old active root pages are absent;
3. keep Hostinger unchanged on the restored backup;
4. later re-check FTP and intentionally deploy only the managed frontend.

## Later

- Human-check Wave1 public/admin and Calibration public/admin after any frontend deployment.
- Create sanitized exact satellite mirrors from the backup before automating satellite deployment.
- After native OMESG360 Leadership is live/tested, change 2rasi Leadership Start to `https://omesg360.eu/leadership-360/`.

## Continuity rule

This file and `RECOVERY_AND_INTEGRATION_PLAN.md` remain source of truth.
