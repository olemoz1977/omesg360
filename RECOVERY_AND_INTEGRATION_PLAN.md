# OMESG360 recovery and Leadership 360 integration plan

Status: ACTIVE — V02 / Leadership release preparation
Date: 2026-08-22
Working branch: `recovery/v02-clean-baseline`

## Source of truth

This file and `PROJECT_ROADMAP.md` are the source of truth for OMESG360 recovery. Work only on `recovery/v02-clean-baseline`. Do not resume `agent/leadership-360-home` and do not use current `main` as a production source.

## Incident context

On 2026-08-22 Git -> Hostinger automation was pointed at `agent/leadership-360-home` and an unverified repository tree was deployed as if it represented the whole production `public_html`. Production was overwritten and then manually recovered by the site owner.

The incident did not invalidate the automation objective. It established the required safety model: one verified source branch, a narrow managed deployment surface, protected server paths, dry-run, backup, post-deploy smoke and rollback.

## Accepted Hostinger baseline — 2026-08-22 23:29 Europe/Vilnius

The recovered Hostinger state is accepted as the current healthy production baseline for the purposes of V02 / Leadership release preparation.

User-verified live smoke:
- OMESG360 recovered V02 homepage: accepted production baseline.
- Wave1 public/core flow: PASS.
- Wave1 admin: PASS; screenshot confirms `ConflictLab — Human Wave 1`, read-only admin and `wave1-v0.4`.
- Calibration public/core flow: PASS.
- Calibration admin: PASS; screenshot confirms `calibration-v0.1`, `6000 ms timing gate`, `SERVER MODE: CALIBRATION` and rendered admin statistics. `0 / 20 calibration eligible clean primary` is an empty data state, not an admin failure.

Do not make further routine manual Hostinger edits during this recovery. GitHub is now the work surface; Hostinger is the protected live baseline until controlled deployment.

## Protected satellite decision

`wave1/` and `conflictlab/releases/calibration-v0.1/` remain active 2Pair research satellites and are outside the OMESG360 V02 / Leadership managed deployment surface.

For the first recovered V02 / Leadership deployment:
- the deployment workflow MUST NOT copy, delete, rename or replace either satellite;
- runtime `config.php`, databases, private/server support and unrelated paths are also protected;
- no root-level `rsync --delete` is allowed;
- `--delete` may be used only inside explicitly managed directories such as `assets/img/` and `leadership-360/`.

Exact Wave1 and Calibration GitHub mirrors remain a separate recovery task. They are required before satellite deployment itself is automated, but they no longer block a narrowly allowlisted V02 / Leadership deployment that cannot touch those paths.

## Safety rules

1. Never deploy `agent/leadership-360-home`.
2. Do not use current `main` as the production source during recovery.
3. Preserve `archive/pre-recovery-2026-08-22` as the historical checkpoint.
4. Work only on `recovery/v02-clean-baseline` until the recovered release passes.
5. Do not commit secrets, server credentials, `.env`, private keys or live `config.php` files.
6. Deployment must be allowlist-based; unrelated Hostinger content is not inferred from the GitHub tree.
7. Dry-run must be reviewed before the first real deploy.
8. Real deploy must create a managed-path backup and run post-deploy smoke checks.
9. If deploy/smoke fails, restore only the managed paths from the backup.
10. Satellite automation may be designed later only after exact satellite mirrors and their own validation contract exist.

## V02 recovered GitHub state

Implemented in `recovery/v02-clean-baseline`:
- recovered V02 `index.html`, based on the restored Hostinger design rather than the old multi-page architecture;
- recovered V02 `privacy.html`;
- root `/assets/img/` with exactly:
  - `favicon.svg`
  - `logo.svg`
  - `og-cover.png`
  - `og-cover.svg`
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
- product explanation covering C1 -> report -> 90-day plan -> C2, 75 statements / 15 competencies, Guardian/process boundaries and privacy positioning;
- Start CTA into the frozen flow:
  - LT: `https://olemoz1977.github.io/gla360-personal-full/setup-v2.html?lang=lt`
  - EN: `https://olemoz1977.github.io/gla360-personal-full/setup-v2.html?lang=en`.

The live `omesg360.eu` does not yet show the Leadership entry because these GitHub changes have not yet been deployed.

## Deployment implementation

Workflow: `.github/workflows/deploy-hostinger.yml`.

Managed surface only:
- root `index.html`
- `privacy.html`
- `robots.txt`
- `sitemap.xml`
- `sitemap_location.xml`
- supported verification files if present
- `assets/img/`
- `leadership-360/`

Protected/unmanaged:
- `wave1/`
- `conflictlab/releases/calibration-v0.1/`
- runtime `config.php`
- databases
- private/server support
- all unrelated Hostinger paths

Workflow safety:
- manual `workflow_dispatch` during recovery;
- `dry_run=true` by default;
- validation before deploy;
- GitHub `production` Environment;
- pinned SSH known-host verification;
- no overlapping production deploys;
- rollback snapshot before writes;
- post-deploy HTTP smoke;
- managed-path rollback on failure.

## Validation contract

`scripts/validate-v02.sh` must verify:
- required V02 files;
- no legacy multi-page references in active surfaces;
- Leadership section placement and frozen-flow links;
- exact four-file shared image allowlist;
- active SEO surface;
- no forbidden secret/runtime config files;
- deployment workflow remains allowlist-scoped;
- no root-level destructive sync;
- Wave1 and Calibration remain protected/unmanaged by this deployment.

Exact satellite mirrors are tracked separately and must not be faked merely to make CI green.

## Required GitHub production Environment before dry-run

Variables:
- `HOSTINGER_HOST`
- `HOSTINGER_USER`
- `HOSTINGER_PORT`
- `HOSTINGER_PUBLIC_PATH`
- `HOSTINGER_BACKUP_PATH`

Secrets:
- `HOSTINGER_SSH_PRIVATE_KEY`
- `HOSTINGER_KNOWN_HOSTS`

Never commit these values into repository files.

## Release sequence from this checkpoint

1. Keep Hostinger unchanged as the accepted live baseline.
2. Make the V02 validator pass under the protected-satellite deployment contract.
3. Configure/verify the GitHub `production` Environment.
4. Run `Deploy OMESG360 to Hostinger` with `dry_run=true` only.
5. Review the itemized rsync plan. It must include only managed V02 / Leadership paths and must not touch Wave1, Calibration, runtime config or DB paths.
6. If dry-run is clean, run the first controlled real deployment with backup and post-deploy smoke.
7. Human-check desktop/mobile, LT/EN, privacy, Leadership homepage entry, `/leadership-360/`, frozen Leadership Start flow, Wave1 public/admin and Calibration public/admin.
8. If all pass, treat `recovery/v02-clean-baseline` as the verified recovered release candidate and decide the production branch promotion model.
9. Then update the 2rasi Leadership 360 primary Start link to `https://omesg360.eu/leadership-360/`.
10. Separately recover exact Wave1 and Calibration mirrors before any future satellite deployment automation.

## Final automation objective

The intended steady state remains:

GitHub work -> validation gate -> controlled automatic Hostinger deployment -> post-deploy smoke -> rollback/recovery if needed.

The site owner should not need routine manual Hostinger file operations. Manual involvement should be limited to exceptional hosting/account actions or explicit approvals that cannot be performed through available tooling.

## Deferred / do not expand scope now

- broader OMESG360 multi-page expansion;
- frozen Leadership 360 backend redesign;
- Organization Campaign / SaaS expansion;
- Wave1/Calibration redesign;
- 2Pair feature expansion before validation data;
- cosmetic work unrelated to recovery/safe deployment.

## Continuity rule

Any accepted but not-yet-implemented OMESG360 idea or recovery decision must be written into this file or `PROJECT_ROADMAP.md`. Do not leave project-critical decisions only in chat history.
