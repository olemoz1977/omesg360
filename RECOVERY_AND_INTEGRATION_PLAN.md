# OMESG360 recovery and Leadership 360 integration plan

Status: ACTIVE — V02 / Leadership release preparation
Date: 2026-08-23
Working branch: `recovery/v02-clean-baseline`

## Source of truth

This file and `PROJECT_ROADMAP.md` are the source of truth for OMESG360 recovery. Work only on `recovery/v02-clean-baseline`. Do not resume `agent/leadership-360-home` and do not use current `main` as a production source until the recovered release is promoted.

## Incident context

On 2026-08-22 Git -> Hostinger automation was pointed at `agent/leadership-360-home` and an unverified repository tree was deployed as if it represented the whole production `public_html`. Production was overwritten and then manually recovered by the site owner.

The incident did not invalidate automation. It established one non-negotiable rule: **GitHub must never again imply ownership of the entire Hostinger `public_html` tree.**

## Accepted Hostinger baseline

The recovered Hostinger state is accepted as the current healthy production baseline for V02 / Leadership release preparation.

User-verified live smoke:
- OMESG360 recovered V02 homepage: accepted baseline.
- Wave1 public/core flow: PASS.
- Wave1 admin: PASS; screenshot confirms read-only `wave1-v0.4`.
- Calibration public/core flow: PASS.
- Calibration admin: PASS; screenshot confirms `calibration-v0.1`, `6000 ms timing gate`, `SERVER MODE: CALIBRATION` and rendered admin statistics.

Do not make routine manual Hostinger edits while the release pipeline is being established.

## Protected satellite decision

`wave1/` and `conflictlab/releases/calibration-v0.1/` remain active 2Pair research satellites and are outside the OMESG360 V02 / Leadership managed deployment surface.

For this release:
- deployment MUST NOT copy, delete, rename or replace either satellite;
- runtime/admin PHP outside the managed package, `config.php`, databases, private/server support and unrelated paths are protected;
- no remote delete operation is allowed;
- exact Wave1 and Calibration GitHub mirrors remain a separate backlog item required only before satellite deployment itself is automated.

## Safety rules

1. Never deploy `agent/leadership-360-home`.
2. Do not use current `main` as production source until recovery promotion is complete.
3. Preserve `archive/pre-recovery-2026-08-22`.
4. Work only on `recovery/v02-clean-baseline` during recovery.
5. Do not commit secrets, server credentials, `.env`, private keys or live `config.php` files.
6. Deployment must be generated from an explicit frontend allowlist.
7. The workflow must detect the correct Hostinger web root and verify both protected satellite paths before preview/write.
8. PR execution is preview-only; real writes require explicit manual dispatch.
9. No remote delete operation is allowed.
10. Before a real write, back up the managed frontend surface; after write, run HTTP smoke and restore the managed frontend on failure.
11. Satellite automation is a later, separate project after exact mirrors exist.

## V02 recovered GitHub state

Implemented in `recovery/v02-clean-baseline`:
- recovered V02 `index.html` based on the restored Hostinger design rather than the old multi-page architecture;
- recovered V02 `privacy.html`;
- root `/assets/img/` with exactly `favicon.svg`, `logo.svg`, `og-cover.png`, `og-cover.svg`;
- reconciled `robots.txt`, `sitemap.xml`, `sitemap_location.xml` and verification files;
- no dependency on legacy `assets/css/styles.css`, `assets/js/main.js` or `assets/js/translations.js`;
- old root multi-page routes are not part of the active V02 surface.

## Leadership 360 integration

Leadership 360 product logic is FROZEN after the clean C1 E2E PASS in `olemoz1977/gla360-personal-full`.

OMESG360 integration owns only presentation and routing. It must not redesign scoring, Collector, Guardian, invitations, pseudonymous boundaries, C1/C2 logic or the 90-day-plan contracts.

Implemented in GitHub:
- homepage `LEADERSHIP DEVELOPMENT` / `Leadership 360°` entry after methodology/principle and before About;
- native `/leadership-360/` OMESG360 page;
- LT/EN behavior;
- Start CTA into frozen `setup-v2.html?lang=lt|en`.

The live `omesg360.eu` does not yet show the Leadership entry because these GitHub changes have not yet been deployed.

## Deployment implementation — simplified 2026-08-23

The earlier SSH + GitHub Environment model was intentionally conservative but created excessive one-time setup complexity.

Hostinger built-in Git Auto Deployment was evaluated as the simpler alternative. It is not safe for the current root because Hostinger requires the initial install directory to be empty, while OMESG360 `public_html` already contains protected Wave1 and Calibration surfaces.

Accepted model: **frontend-only FTP/FTPS deployment**.

Workflow: `.github/workflows/deploy-hostinger.yml`.

Generated managed package only:
- `index.html`
- `privacy.html`
- `robots.txt`
- `sitemap.xml`
- `sitemap_location.xml`
- supported verification files if present
- four approved `assets/img` files
- `leadership-360/index.html`

Protected/unmanaged:
- `wave1/`
- `conflictlab/releases/calibration-v0.1/`
- runtime/admin PHP outside the generated package
- `config.php`
- databases
- private/server support
- all unrelated Hostinger paths

Workflow behavior:
- `pull_request` against `main`: validation + FTPS dry-run preview only;
- `workflow_dispatch`: `dry_run=true` by default;
- real deploy job runs only on explicit manual dispatch with `dry_run=false`;
- FTPS is forced;
- remote root is detected as either FTP `/` or `/public_html`;
- both protected satellite paths must exist in that same root or the workflow fails closed;
- deployment uses `lftp mirror --reverse` without any delete option;
- managed frontend is backed up to the runner before real write;
- post-deploy HTTP smoke covers LT/EN homepage, privacy, Leadership page, frozen Leadership entry, Wave1, Calibration, robots and sitemap;
- managed frontend is restored if upload/smoke fails.

## Validation contract

`scripts/validate-v02.sh` verifies:
- required V02 files;
- no legacy multi-page references in active surfaces;
- Leadership section placement and frozen-flow links;
- exact four-file shared image allowlist;
- active SEO surface;
- no forbidden secret/runtime config files;
- frontend-only FTPS deployment contract;
- no SSH/rsync or delete-based deployment behavior;
- Wave1 and Calibration never enter the generated deployment package;
- real writes remain manual-only.

Current validation commit: `e55baab10dc35b38bd580cda82a283b369943e19`.
Latest validation run `32600511455`: **SUCCESS**.

The PR deployment-preview workflow run `32600511468` also passed the release validator, then stopped at `Verify FTP secrets`, which is expected because the three secrets are not configured yet. Deploy job was skipped and no Hostinger connection/write occurred.

## Required one-time GitHub setup

No GitHub `production` Environment and no SSH key setup are required anymore.

Create three repository secrets:
`Settings -> Secrets and variables -> Actions -> Repository secrets`

- `HOSTINGER_FTP_HOST`
- `HOSTINGER_FTP_USER`
- `HOSTINGER_FTP_PASSWORD`

Use a Hostinger FTP account that can access OMESG360 `public_html`. The workflow will detect whether `public_html` is the account root or a child directory.

Never commit these values into repository files.

## Release sequence from this checkpoint

1. Keep Hostinger unchanged as accepted live baseline.
2. Keep draft PR #2 unmerged.
3. Add the three Hostinger FTP repository secrets.
4. Re-run the failed `Deploy OMESG360 frontend to Hostinger` PR job.
5. Confirm it passes the FTPS connection/root guard and produces a **dry-run only** frontend preview.
6. Review the preview: only V02 / Leadership package files may appear; no Wave1, Calibration or runtime file may be included.
7. If preview is clean, perform the first explicit real frontend deploy from the approved production-source branch/workflow.
8. Confirm automatic HTTP smoke PASS.
9. Human-check desktop/mobile, LT/EN, privacy, Leadership homepage entry, `/leadership-360/`, frozen Leadership Start flow, Wave1 public/admin and Calibration public/admin.
10. If all pass, complete the production-source promotion/merge decision.
11. Update the 2rasi Leadership 360 primary Start link to `https://omesg360.eu/leadership-360/`.
12. Separately recover exact Wave1 and Calibration mirrors before any future satellite deployment automation.

## Final automation objective

Steady state:

GitHub work -> validation gate -> frontend-only Hostinger deployment -> post-deploy smoke -> managed frontend rollback if needed.

The site owner should not need routine Hostinger file uploads. GitHub owns the professional presentation layer only, not the complete server tree.

## Deferred / do not expand scope now

- broader OMESG360 multi-page expansion;
- frozen Leadership 360 backend redesign;
- Organization Campaign / SaaS expansion;
- Wave1/Calibration redesign;
- 2Pair feature expansion before validation data;
- cosmetic work unrelated to recovery/safe deployment.

## Continuity rule

Any accepted but not-yet-implemented OMESG360 idea or recovery decision must be written into this file or `PROJECT_ROADMAP.md`. Do not leave project-critical decisions only in chat history.
