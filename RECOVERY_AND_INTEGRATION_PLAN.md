# OMESG360 recovery and Leadership 360 integration plan

Status: COMPLETE — recovery closed; Leadership integration validated EN/LT
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

## 2rasi Leadership integration — COMPLETE
Routing commit on `olemoz1977/2rasi-web`, branch `hero-webgl`:
- `76db8161cedb58cc3f3c53b15073fe6093187cbd`

Leadership About/positioning + real LT/EN page behavior:
- `fc65c33f5fdec2c5416a2b8bdf6447a489577162`

Final user paths:
- `2rasi.com` -> Leadership -> OMESG360 EN -> frozen Leadership setup/product;
- `2rasi.lt` -> Leadership -> OMESG360 LT -> frozen Leadership setup/product.

Both paths were manually validated live on 2026-08-23 and passed.

The 2rasi About page now acts as a concise 2rasi-framed introduction; the full professional description, cycle and privacy boundaries live on OMESG360. All old `prototype` positioning was removed from the 2rasi Leadership About page.

## Freeze rule
Recovery and Leadership integration are closed. Do not reopen either line unless:
- there is concrete production evidence of a defect; or
- a new explicit product requirement is approved.

Keep Hostinger Git auto-deployment OFF.

## Next controlled step
Return to 2Pair core work. Treat Wave1 and Calibration as research inputs to be consolidated into the main 2Pair direction rather than creating another recovery branch or reopening Leadership.
