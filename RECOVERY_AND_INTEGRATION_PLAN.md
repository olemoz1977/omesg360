# OMESG360 recovery and Leadership 360 integration plan

Status: ACTIVE — live baseline restored; GitHub recovery source consolidated
Date: 2026-08-23
Primary branch: `main`

## Source of truth
`PROJECT_ROADMAP.md` and this file are the source of truth. Never resume `agent/leadership-360-home`.

## Live baseline
- Hostinger `public_html` restored from the known-good backup.
- Hostinger Git auto-deployment from `main` to `public_html` is OFF.
- Restored backup is the current live server reference.
- Server-only secrets: `.private/`, `wave1/config.php`, `conflictlab/releases/calibration-v0.1/server/config.php`, databases and credentials.

## Incident root cause
The second overwrite was caused by Hostinger Git auto-deployment still being enabled. A GitHub `main` bootstrap change triggered Hostinger to redeploy the old mixed `main` tree. GitHub Actions did not perform that overwrite.

Rule: **GitHub never whole-root syncs or deletes the Hostinger server tree.**

## Recovered GitHub source
`main` now contains the clean recovered V02 + Leadership source and the sanitized recovery mirrors of the two active satellites.

Satellite mirror completion:
- Wave1: 16 non-secret files mirrored exactly from the restored server backup.
- Calibration `calibration-v0.1`: 67 non-secret files mirrored exactly from the restored server backup.
- Total: 83 files.
- PR #4 merged as `54b46ade620ad6ed7af5263bd8520f7bf21c5dd8`.
- Before commit, all 83 downloaded files were checked against SHA256 hashes derived from the uploaded known-good ZIP.
- `wave1/config.php` and Calibration `server/config.php` were removed before verification/commit and remain Hostinger-only.
- Temporary mirror workflow and checksum manifest were removed after recovery.

`Archive/`, `DO_NOT_UPLOAD_HERE`, `.git/` and `.private/` from the Hostinger backup are not part of active GitHub source. `Archive/` remains historical old-site material in the server backup, not a deployment dependency.

## Frontend deployment contract
Normal deployments remain frontend-only plain FTP allowlist.

Managed only:
- root V02 frontend/SEO/verification files;
- four approved shared images;
- `leadership-360/index.html`.

Wave1 and Calibration now exist in GitHub as recovery mirrors, but are not modified by the normal frontend deployment workflow. Their live secret configs remain server-only.

No whole-root synchronization. No `--delete`.

## Validation
- V02/Leadership structural validation PASS.
- GitHub satellite mirror PR contains exactly 83 runtime files and no secret config files.
- Wave1 and Calibration entry files are present on `main`.
- temporary mirror automation is absent from `main`.
- Hostinger mirror operation was read-only; no production files were written.
- FTP connectivity remains intermittently flaky (`max-retries exceeded` observed), so connectivity must be re-checked before the next intentional frontend write.

## Next controlled step
1. Keep Hostinger Git auto-deployment OFF.
2. Perform read-only FTP connectivity check.
3. If PASS, deploy only the explicit V02/Leadership frontend package.
4. Verify LT/EN homepage, privacy, Leadership route/Start, Wave1 public/admin and Calibration public/admin.
5. Only after production PASS continue with the 2rasi Leadership Start integration.
