# OMESG360 recovery and Leadership 360 integration plan

Status: ACTIVE — first controlled deploy preparation
Date: 2026-08-23
Working branch: `recovery/v02-clean-baseline`

## Source of truth

This file and `PROJECT_ROADMAP.md` are the source of truth. Do not resume `agent/leadership-360-home`. The recovered release remains on `recovery/v02-clean-baseline` until production validation is complete.

## Incident rule

On 2026-08-22 an unverified Git tree was deployed as if GitHub owned the whole Hostinger `public_html`, overwriting production. Hostinger was manually recovered afterward.

Non-negotiable rule established by the incident:
**GitHub must never again imply ownership of the complete Hostinger `public_html` tree.**

## Accepted live baseline

Hostinger recovered V02 is accepted as the healthy live baseline until the first controlled recovery deploy.

User-verified:
- OMESG360 V02 homepage: accepted baseline;
- Wave1 public/core: PASS;
- Wave1 admin: PASS, `wave1-v0.4`;
- Calibration public/core: PASS;
- Calibration admin: PASS, `calibration-v0.1`, `6000 ms timing gate`, `SERVER MODE: CALIBRATION`.

Do not manually redesign/refactor satellites during this release.

## Protected paths

Outside the OMESG360 frontend deployment contract:
- `wave1/`
- `conflictlab/releases/calibration-v0.1/`
- runtime/admin PHP outside the generated package
- `config.php`
- databases
- private/server support
- unrelated Hostinger files/directories

The frontend workflow MUST NOT copy, delete, rename or replace those paths.

Exact Wave1 and Calibration GitHub mirrors remain a later prerequisite for automating satellite deployment itself, not for this frontend release.

## Recovered V02 + Leadership GitHub state

Implemented on `recovery/v02-clean-baseline`:
- recovered V02 `index.html`;
- recovered V02 `privacy.html`;
- active robots/sitemaps;
- exactly four shared `assets/img` files;
- old multi-page root architecture removed from active recovery surface;
- Leadership homepage entry after methodology and before About;
- native `/leadership-360/`;
- LT/EN behavior;
- Start CTA into frozen `gla360-personal-full/setup-v2.html?lang=lt|en`.

Leadership product logic remains frozen in `olemoz1977/gla360-personal-full`; OMESG360 owns presentation/routing only.

Live `omesg360.eu` does not yet show the new Leadership entry because no real recovery deploy has executed.

## Finalized deployment implementation

Accepted model: **frontend-only plain FTP deployment**.

Workflow:
`.github/workflows/deploy-hostinger.yml`

Connection contract:
- FTP host `46.202.142.134` stored openly in workflow;
- FTP port 21 / plain FTP;
- GitHub repository secrets only:
  - `HOSTINGER_FTP_USER`
  - `HOSTINGER_FTP_PASSWORD`
- verified remote root:
  `/domains/omesg360.eu/public_html`

Generated deployment package only:
- `index.html`
- `privacy.html`
- `robots.txt`
- `sitemap.xml`
- `sitemap_location.xml`
- supported verification files if present
- `assets/img/favicon.svg`
- `assets/img/logo.svg`
- `assets/img/og-cover.png`
- `assets/img/og-cover.svg`
- `leadership-360/index.html`

Safety behavior:
1. Validate V02/Leadership contract.
2. Verify FTP secrets.
3. Build explicit frontend package.
4. Read-only verify exact OMESG360 remote root plus Wave1 and Calibration paths.
5. PR runs perform dry-run preview only.
6. Real write job requires explicit manual `workflow_dispatch` with `dry_run=false`.
7. No `rsync`, no `--delete`, no broad remote mirror.
8. Backup managed frontend before real write.
9. Upload only generated frontend package.
10. Run post-deploy HTTP smoke.
11. Restore managed frontend if upload/smoke fails.

Current functional workflow commit:
`e82c800654f6a70df8003350a6eba9ce4d5d69e0`

Current validator commit:
`6491f57c0e1b2a66721e777f396e52b03e01ff8d`

Temporary read-only FTP diagnostic was removed after it established the exact remote path.

## Dry-run proof — PASS

Clean preview run:
- workflow `Deploy OMESG360 frontend to Hostinger`
- run `32602460929`
- `validate-and-preview`: SUCCESS
- real `deploy`: SKIPPED
- Hostinger write: NONE

The preview proved:
- repository secrets work;
- FTP login works;
- exact remote root is `/domains/omesg360.eu/public_html`;
- Wave1 and Calibration are visible and checked before preview;
- planned targets are directly under the real site root:
  - root frontend files;
  - `leadership-360/index.html`;
  - four `assets/img` files;
- protected/runtime paths are absent from the upload plan.

An earlier dry-run exposed that the local `.deploy-package` directory name would have been reproduced remotely. No write occurred. The workflow was corrected before release. This confirms the dry-run gate is functioning as intended.

## Manual dispatch bootstrap requirement

GitHub `workflow_dispatch` only receives manual events when the workflow file exists on the repository default branch.

Therefore do not merge the entire recovery release just to expose the Run workflow button.

Approved bootstrap sequence:
1. Create a tiny branch from current `main`.
2. Add only `.github/workflows/deploy-hostinger.yml`.
3. Merge only that workflow file into `main`.
4. This changes no site content and does not itself deploy anything.
5. From Actions, manually run `Deploy OMESG360 frontend to Hostinger` against ref `recovery/v02-clean-baseline` with `dry_run=false`.
6. Keep recovery PR #2 draft/unmerged until production smoke and human verification pass.

## First real deploy gate

After the workflow-only bootstrap is on `main`:
1. Explicitly dispatch against `recovery/v02-clean-baseline`, `dry_run=false`.
2. Confirm backup step succeeds.
3. Confirm upload step succeeds.
4. Confirm HTTP smoke PASS for:
   - LT/EN homepage;
   - privacy;
   - Leadership native page;
   - frozen Leadership Start flow;
   - Wave1 LT/EN;
   - Calibration;
   - robots/sitemap.
5. Human-check desktop/mobile and both languages.
6. Re-check Wave1 public/admin and Calibration public/admin.
7. If all PASS, complete the recovery->main production-source promotion decision.
8. Then update 2rasi primary Leadership Start to `https://omesg360.eu/leadership-360/`.

## Safety rules

1. Never deploy `agent/leadership-360-home`.
2. Keep whole recovery PR #2 draft until real deploy + smoke + human checks pass.
3. Never commit FTP password or runtime secrets.
4. Never add satellites/runtime/DB to the frontend package.
5. Never add delete-based whole-root synchronization.
6. Any future satellite automation requires its own exact mirror and validation contract.

## Final operating model

GitHub work -> validation -> frontend-only Hostinger deployment -> post-deploy smoke -> managed frontend rollback if needed.

GitHub owns only the OMESG360 professional presentation layer, not the entire server tree.

## Deferred

- exact Wave1 mirror and satellite deploy automation;
- exact Calibration mirror and satellite deploy automation;
- broader OMESG360 multi-page expansion;
- frozen Leadership backend redesign;
- Organization Campaign / SaaS expansion;
- cosmetic work unrelated to recovery/safe deployment.

## Continuity rule

Project-critical decisions must be written into this file or `PROJECT_ROADMAP.md`, not left only in chat history.
