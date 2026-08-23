# OMESG360 recovery and Leadership 360 integration plan

Status: ACTIVE — restored baseline protected; main correction authorized
Date: 2026-08-23

## Source of truth

This file and `PROJECT_ROADMAP.md` are the source of truth. Do not resume `agent/leadership-360-home`.

## Current live state

- Hostinger `public_html` was manually restored from the known-good backup after the second overwrite.
- Hostinger Git auto-deployment from `main` to `public_html` is OFF.
- Backup is the current server recovery reference for V02 + Wave1 + Calibration runtime.
- Runtime secrets remain Hostinger-only: `.private/`, `wave1/config.php`, `conflictlab/releases/calibration-v0.1/server/config.php`, database credentials and other server configuration.

## Root cause

The second overwrite was caused by Hostinger Git auto-deployment still being enabled. The bootstrap merge changed `main`, and Hostinger automatically redeployed the old mixed `main` tree. GitHub Actions manual run #22 stopped before deploy; preview runs did not write production.

Non-negotiable rule: **GitHub must never own or mirror the complete Hostinger server tree.**

## Correct GitHub state

The clean source line is `recovery/v02-clean-baseline`:
- V02 `index.html` and `privacy.html`;
- robots/sitemaps;
- exactly four approved shared images;
- old active root multi-page architecture removed;
- Leadership 360 homepage entry and native `/leadership-360/` page;
- LT/EN behavior;
- frontend-only FTP deployment workflow;
- runtime secret paths ignored.

Leadership product logic remains frozen in `olemoz1977/gla360-personal-full`.

## Deployment contract

Deployment is explicit frontend-only plain FTP.

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

No `rsync`, no `--delete`, no broad tree sync.

## Validation

- V02/Leadership validator PASS after restore.
- Clean preview run `32606939263` (#29) PASS, no writes.
- A later read-only FTP root check after backup restore timed out with `max-retries exceeded`; no writes occurred. FTP connectivity must be re-checked before the next intentional deploy.

## Current action

Because Hostinger Git auto-deployment is OFF, `main` may now be corrected without changing live production:
1. fast-forward `main` to the clean recovery history;
2. verify old active root pages are gone from `main`;
3. leave Hostinger on restored backup;
4. re-check FTP before controlled frontend deployment.

## Satellite backlog

The uploaded backup supplies a concrete Wave1 and Calibration server snapshot. Any GitHub satellite mirror must be sanitized, hash-verified and deployed separately from the frontend workflow.

## Continuity rule

Project-critical decisions must be recorded here or in `PROJECT_ROADMAP.md`.
