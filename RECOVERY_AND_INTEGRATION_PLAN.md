# OMESG360 recovery and Leadership 360 integration plan

Status: ACTIVE — restored baseline protected; GitHub main correction ready
Date: 2026-08-23

## Source of truth
`PROJECT_ROADMAP.md` and this file are the source of truth. Never resume `agent/leadership-360-home`.

## Live baseline
- Hostinger `public_html` restored from known-good backup.
- Hostinger Git auto-deployment from `main` to `public_html` is OFF.
- Backup is current server reference for V02 + Wave1 + Calibration runtime.
- Runtime secrets remain Hostinger-only: `.private/`, `wave1/config.php`, `conflictlab/releases/calibration-v0.1/server/config.php`, databases and credentials.

## Root cause
The second overwrite was caused by Hostinger Git auto-deployment still being enabled. A `main` bootstrap change triggered Hostinger to redeploy the old mixed `main` tree. GitHub Actions did not write that overwrite.

Rule: **GitHub never owns the complete Hostinger server tree.**

## Clean source
`recovery/v02-clean-baseline` contains recovered V02, privacy/SEO, Leadership 360 presentation/routing, LT/EN behavior and frontend-only FTP deployment.

## Deployment contract
Managed only: root frontend/SEO/verification files, four approved images, `leadership-360/index.html`.

Protected/unmanaged: Wave1, Calibration, runtime/admin PHP outside package, configs, DB/private/server support.

No whole-root synchronization, no `--delete`.

## Validation
- V02/Leadership structure validation PASS after restore.
- Earlier clean preview #29 PASS with no writes.
- Latest read-only FTP check timed out after restore; no writes. Re-check connectivity before the next intentional frontend deploy.

## Current action
Hostinger auto-deployment is OFF, so fast-forward clean recovery history into `main` as a GitHub-only correction. Live Hostinger stays on restored backup.

## Later
Re-check FTP, then run controlled frontend-only deployment and human-check both satellites. Satellite mirrors remain a separate sanitized/hash-verified task.
