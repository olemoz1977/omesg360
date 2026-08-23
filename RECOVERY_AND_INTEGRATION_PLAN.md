# OMESG360 recovery and Leadership 360 integration plan

Status: ACTIVE — recovery complete; 2rasi Leadership routing integrated
Date: 2026-08-23
Primary OMESG360 branch: `main`
Primary 2rasi branch: `hero-webgl`

## Source of truth
`PROJECT_ROADMAP.md` and this file are the source of truth. Never resume `agent/leadership-360-home`.

## Live baseline
- Hostinger `public_html` restored from the known-good backup.
- Hostinger Git auto-deployment from `main` to `public_html` is OFF.
- Controlled GitHub Actions -> FTP is the active OMESG360 deployment path.
- OMESG360 V02 homepage is live.
- Leadership 360 presentation/routing is live.
- Responsive hero layout was corrected and user-verified on desktop and mobile.
- Wave1 public/admin was manually verified fully working.
- Calibration `calibration-v0.1` public/admin was manually verified fully working.
- Server-only secrets: `.private/`, `wave1/config.php`, `conflictlab/releases/calibration-v0.1/server/config.php`, databases and credentials.

## Incident root cause
The second overwrite was caused by Hostinger Git auto-deployment still being enabled. A GitHub `main` bootstrap change triggered Hostinger to redeploy the old mixed `main` tree. GitHub Actions did not perform that overwrite.

Rule: **GitHub never whole-root syncs or deletes the Hostinger server tree.**

## Recovered GitHub source
`main` contains the clean recovered V02 + Leadership source and sanitized recovery mirrors of the two active satellites.

Satellite mirror completion:
- Wave1: 16 non-secret files mirrored exactly from the restored server backup.
- Calibration `calibration-v0.1`: 67 non-secret files mirrored exactly from the restored server backup.
- Total: 83 files.
- PR #4 merged as `54b46ade620ad6ed7af5263bd8520f7bf21c5dd8`.
- Before commit, all 83 downloaded files were checked against SHA256 hashes derived from the uploaded known-good ZIP.
- `wave1/config.php` and Calibration `server/config.php` remain Hostinger-only.
- Temporary mirror and hotfix workflows were removed after use.

`Archive/`, `DO_NOT_UPLOAD_HERE`, `.git/` and `.private/` from the Hostinger backup are not part of active GitHub source. `Archive/` remains historical old-site material in the server backup, not a deployment dependency.

## Frontend deployment contract
Normal deployments remain frontend-only plain FTP allowlist.

Managed only:
- root V02 frontend/SEO/verification files;
- four approved shared images;
- `leadership-360/index.html`.

Wave1 and Calibration exist in GitHub as recovery mirrors, but are not modified by the normal frontend deployment workflow. Their live secret configs remain server-only.

No whole-root synchronization. No `--delete`.

## Validation
- Dry-run #48 PASS with exact FTP root verification and no writes.
- Controlled frontend deployment PASS.
- Managed production HTTP smoke PASS.
- Responsive hero hotfix deployed and visually verified on PC and mobile.
- Wave1 public/admin manually verified fully working.
- Calibration public/admin manually verified fully working.
- GitHub satellite mirror contains exactly 83 runtime files and no secret config files.

## 2rasi Leadership integration
Completed in `olemoz1977/2rasi-web` on `hero-webgl` as clean commit `76db8161cedb58cc3f3c53b15073fe6093187cbd`.

Changes:
- homepage Leadership Start now routes through OMESG360 rather than directly into the frozen product;
- 2rasi language logic rewrites that route to `https://omesg360.eu/leadership-360/?lang=en` or `?lang=lt`;
- both CTAs on `tools/leadership-360/` route to `https://omesg360.eu/leadership-360/`;
- the frozen `gla360-personal-full` repository/product is unchanged.

Expected user path:
2rasi -> OMESG360 Leadership presentation -> frozen Leadership setup/product.

## Current state
Recovery phase is complete. OMESG360 production baseline is healthy. Keep Hostinger Git auto-deployment OFF.

2rasi source integration is complete. Remaining gate is a human/live click check on both `2rasi.com` and `2rasi.lt` after GitHub Pages propagation. Do not reopen recovery unless production evidence requires it.
