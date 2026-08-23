# OMESG360 recovery and Leadership 360 integration plan

Status: ACTIVE — Hostinger restored, Git auto-deploy disabled, main correction ready
Date: 2026-08-23
Working branch: `recovery/v02-clean-baseline`

## Source of truth

This file and `PROJECT_ROADMAP.md` are the source of truth. Do not resume `agent/leadership-360-home`.

## Incident rule

On 2026-08-22 an unverified Git tree was deployed as if GitHub owned the complete Hostinger `public_html`, overwriting production.

On 2026-08-23 the same class of failure reappeared for a different reason: Hostinger Git auto-deployment was still enabled on `olemoz1977/omesg360` branch `main` with target `public_html`. The safe dispatcher bootstrap merge changed `main`; Hostinger then automatically redeployed the old mixed `main` tree even though the GitHub Actions FTP workflow itself had not written production.

Non-negotiable rule:
**GitHub must never again imply ownership of the complete Hostinger server tree.**

## Current accepted live baseline

The user manually restored the known-good `public_html` backup on Hostinger after the second overwrite.

The backup is accepted as the current server recovery reference. It contains:
- recovered OMESG360 V02 frontend;
- Wave1 runtime tree;
- Calibration v0.1 runtime tree;
- server-only runtime configuration.

Hostinger Git auto-deployment has now been disabled by the user.

Server-only files must remain outside public GitHub, especially:
- `.private/`;
- `wave1/config.php`;
- `conflictlab/releases/calibration-v0.1/server/config.php`;
- databases and other runtime secrets.

## Protected paths

Outside the frontend deploy contract:
- `wave1/`
- `conflictlab/releases/calibration-v0.1/`
- runtime/admin PHP outside generated package
- `config.php`
- databases
- private/server support
- unrelated Hostinger files/directories

Frontend deployment MUST NOT copy, delete, rename or replace these paths.

## Recovered V02 + Leadership state

Implemented on recovery branch:
- V02 `index.html`;
- V02 `privacy.html`;
- active robots/sitemaps;
- exactly four shared `assets/img` files;
- old multi-page root architecture removed from active recovery surface;
- Leadership homepage card after methodology and before About;
- native `/leadership-360/`;
- LT/EN behavior;
- Start CTA into frozen `gla360-personal-full/setup-v2.html?lang=lt|en`.

Leadership product logic stays frozen in `olemoz1977/gla360-personal-full`; OMESG360 owns presentation/routing only.

The manually restored Hostinger backup is the live baseline. The new Leadership entry/page will be published only through the controlled frontend-only deployment after repository cleanup.

## Final deployment implementation

Model: **frontend-only plain FTP**.

Connection contract:
- FTP host `46.202.142.134` stored openly in workflow;
- port 21 / plain FTP;
- repository secrets only: `HOSTINGER_FTP_USER`, `HOSTINGER_FTP_PASSWORD`;
- verified remote root `/domains/omesg360.eu/public_html`.

Generated package only:
- `index.html`
- `privacy.html`
- `robots.txt`
- `sitemap.xml`
- `sitemap_location.xml`
- verification files if present
- four approved `assets/img` files
- `leadership-360/index.html`

Safety behavior:
1. Validate V02/Leadership contract.
2. Verify FTP secrets.
3. Build explicit frontend package.
4. Read-only verify the exact OMESG360 FTP root.
5. PR runs are dry-run only.
6. Real writes require manual `workflow_dispatch` with `dry_run=false`.
7. No `rsync`, no `--delete`, no broad tree sync.
8. Back up managed frontend before real write.
9. Upload only generated package.
10. Run managed-frontend HTTP smoke.
11. Restore managed frontend on upload/smoke failure.
12. Human-smoke Wave1 and Calibration after deployment; they are protected/unmanaged.

## Validation state

Code/structure validator passed after the restore.

A subsequent FTP preview reached package build but the read-only FTP root check timed out with `max-retries exceeded` after the Hostinger backup restore. It performed no writes. This is a connectivity gate to re-check before the next intentional frontend deployment, not a reason to block GitHub `main` cleanup.

Earlier clean preview run `32606939263` (#29) was SUCCESS and also performed no writes.

## Main correction — CURRENT GATE

Hostinger Git auto-deployment is OFF. Therefore repository correction no longer causes an automatic production redeploy.

Required now:
1. fast-forward the clean recovery history into `main`;
2. remove the old/mixed active root architecture from `main`;
3. retain runtime-secret ignore rules;
4. keep live Hostinger unchanged on the restored backup;
5. re-check FTP connectivity before the next intentional frontend-only deployment.

The uploaded backup is a server recovery reference, not permission to commit the entire server tree. Satellite source snapshots can be mirrored separately only after sanitization and hash verification.

## Safety rules

1. Never deploy `agent/leadership-360-home`.
2. Never re-enable Hostinger whole-repo auto-deployment to `public_html` as the primary production path.
3. Never commit FTP password or runtime secrets.
4. Never add satellites/runtime/DB to the frontend package.
5. Never add delete-based whole-root synchronization.
6. Future satellite automation requires sanitized exact mirrors and a separate validation contract.

## Final operating model

GitHub `main` = clean professional frontend source + deployment/continuity files.

Hostinger `public_html` = frontend plus protected server/runtime satellites.

Deployment = explicit frontend-only FTP allowlist, not whole-repo Git checkout.

## Deferred

- sanitized Wave1/Calibration mirror verification and satellite deploy automation;
- broader OMESG360 multi-page expansion;
- frozen Leadership backend redesign;
- Organization Campaign / SaaS expansion;
- cosmetic work unrelated to recovery/safe deployment.

## Continuity rule

Project-critical decisions must be written here or in `PROJECT_ROADMAP.md`, not left only in chat history.
