# OMESG360 / 2rasi project roadmap and handover

Status: ACTIVE CONTINUITY DOCUMENT
Last updated: 2026-08-23 01:28 Europe/Vilnius
Working branch: `recovery/v02-clean-baseline`

This file is the durable cross-session handover. `RECOVERY_AND_INTEGRATION_PLAN.md` is the detailed recovery contract. Do not resume incident-era work from chat memory alone.

## Source-of-truth boundaries

### OMESG360 production
- Hostinger recovered V02 is the accepted healthy live baseline until the first controlled recovery deploy.
- GitHub recovery/integration work happens only in `olemoz1977/omesg360` on `recovery/v02-clean-baseline`.
- `main` is still the old/mixed site state and is NOT yet the production site source.
- `agent/leadership-360-home` is historical incident-era work and must never be deployed.
- `archive/pre-recovery-2026-08-22` remains the historical checkpoint.

### Leadership 360
- Product logic is FROZEN in `olemoz1977/gla360-personal-full` after the clean C1 E2E PASS.
- OMESG360 owns presentation/routing only.
- The recovery branch already contains:
  - homepage `LEADERSHIP DEVELOPMENT / Leadership 360°` entry after methodology and before About;
  - native `/leadership-360/` page;
  - LT/EN behavior;
  - Start CTA to frozen `gla360-personal-full/setup-v2.html?lang=lt|en`.
- Live `omesg360.eu` does not yet show the new Leadership entry/page because no real recovery deploy has run.

### 2rasi
- `2rasi.com` remains discovery/hook layer.
- Its static web repo is operationally simpler than OMESG360.
- After OMESG360 Leadership is production-live and tested, change 2rasi primary Leadership Start to `https://omesg360.eu/leadership-360/`.

### 2Pair satellites
- Wave1 and Calibration are active research satellites, not part of the Leadership deployment package.
- User-verified live PASS:
  - Wave1 public/core PASS;
  - Wave1 admin PASS, screenshot confirms read-only `wave1-v0.4`;
  - Calibration public/core PASS;
  - Calibration admin PASS, screenshot confirms `calibration-v0.1`, `6000 ms timing gate`, `SERVER MODE: CALIBRATION`.
- Exact GitHub mirrors remain a separate backlog item before satellite deployment itself is automated.

## Recovered V02 GitHub surface

Implemented on `recovery/v02-clean-baseline`:
- V02 `index.html` reconstructed from recovered production design;
- V02 `privacy.html`;
- active `robots.txt`, `sitemap.xml`, `sitemap_location.xml`;
- no active dependency on old `assets/css/styles.css`, `assets/js/main.js`, `assets/js/translations.js`;
- old root multi-page pages removed from the recovery surface;
- approved shared images exactly:
  - `assets/img/favicon.svg`
  - `assets/img/logo.svg`
  - `assets/img/og-cover.png`
  - `assets/img/og-cover.svg`

Historical recovery commits:
- V02 homepage baseline `4b9fe9858d8f510f41e849d15ad44097da57ab11`
- privacy baseline `fa5f62988686c60ef742b94501a28963a68f188d`
- native Leadership page `387ba362d0d04292d0e5310cc56ffd86eb029ee7`
- homepage Leadership integration `d0b581c3677de475ef3bd097601d6eeccfef23b3`

Draft PR #2 `Recovery V02 + Leadership 360 release candidate` remains open from recovery to `main`. Do not merge the whole release until production deployment/smoke/human checks are complete.

## Deployment model — FINALIZED FOR FIRST RELEASE

Accepted model: **frontend-only plain FTP deployment**, not whole-server mirroring.

Why:
- whole `public_html` Git ownership caused the 2026-08-22 incident;
- Hostinger Git Auto Deployment is not suitable for this existing non-empty `public_html`;
- SSH/Environment design was unnecessarily complex for this narrow frontend layer;
- Hostinger FTP account is sufficient if the workflow is strict allowlist/no-delete.

Workflow: `.github/workflows/deploy-hostinger.yml`.

Verified connection facts:
- public FTP host: `46.202.142.134` (not secret; stored in workflow);
- FTP user/password are GitHub repository secrets only;
- Hostinger-supported connection used here: plain FTP, port 21;
- verified OMESG360 FTP web root: `/domains/omesg360.eu/public_html`.

Only GitHub secrets required:
- `HOSTINGER_FTP_USER`
- `HOSTINGER_FTP_PASSWORD`

Managed package only:
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

Explicitly protected/unmanaged:
- `wave1/`
- `conflictlab/releases/calibration-v0.1/`
- runtime/admin PHP outside the package
- `config.php`
- databases
- private/server support
- every unrelated Hostinger path

Safety contract:
- PR executions are preview-only;
- real write job requires explicit `workflow_dispatch` with `dry_run=false`;
- no `rsync`, no `--delete`, no broad remote tree sync;
- workflow verifies the exact OMESG360 root and both satellite paths before preview/write;
- managed frontend is backed up before a real write;
- post-deploy HTTP smoke runs;
- managed frontend rollback runs if upload/smoke fails.

Current workflow commit: `e82c800654f6a70df8003350a6eba9ce4d5d69e0`.
Current validator commit: `6491f57c0e1b2a66721e777f396e52b03e01ff8d`.
Temporary FTP diagnostic workflow was removed in commit `ab480516e08509ebcaafd0c09f28afea1f5b0b87`.

## Dry-run gate — PASS

Latest clean frontend preview:
- GitHub Actions workflow: `Deploy OMESG360 frontend to Hostinger`
- run id: `32602460929`
- job `validate-and-preview`: **SUCCESS**
- real `deploy` job: **SKIPPED** because this was PR preview
- Hostinger writes: **NONE**

The run proved:
- validator PASS;
- FTP user/password accepted;
- exact root `/domains/omesg360.eu/public_html` reachable;
- live Wave1 and Calibration paths detected before preview;
- package targets are directly under `public_html`, not under a `.deploy-package` subfolder;
- preview contains only the managed frontend files listed above;
- Wave1, Calibration, runtime PHP/config, DB and unrelated paths are absent from the plan.

A prior dry-run exposed a `.deploy-package` target-path bug; it was caught before any write and fixed in `e82c800...`. This is exactly why the dry-run gate exists.

## GitHub manual-dispatch bootstrap

GitHub documentation states that `workflow_dispatch` receives events only when the workflow file exists on the repository default branch.

Therefore the next safe step is **NOT** to merge the entire recovery PR. Instead:
1. create a tiny bootstrap branch from current `main`;
2. add only `.github/workflows/deploy-hostinger.yml` to that branch;
3. review/merge only that workflow file into `main`;
4. this changes no production website file and triggers no deployment by itself;
5. then use the Actions UI to manually dispatch the workflow against `recovery/v02-clean-baseline` with `dry_run=false` for the first controlled real deploy.

The whole recovery PR #2 stays draft/unmerged until production smoke and human review pass.

## First real deploy gate

After workflow bootstrap is on `main`:
1. Actions -> `Deploy OMESG360 frontend to Hostinger` -> Run workflow.
2. Select ref `recovery/v02-clean-baseline`.
3. Set `dry_run=false`.
4. Run once.
5. Verify automatic smoke PASS.
6. Human-check:
   - homepage desktop/mobile;
   - LT/EN;
   - privacy;
   - Leadership homepage card;
   - `/leadership-360/`;
   - frozen Leadership Start flow;
   - Wave1 public/admin;
   - Calibration public/admin.
7. Only after all PASS decide final recovery->main promotion/merge.
8. Then update the 2rasi Leadership Start link.

## Satellite mirror backlog

### Wave1
Known real v0.4 package provenance:
- `index.html` 18,823 bytes, SHA256 `66aa836730d0e866e64a2301d211dac0c55d9d9284a9fc4ef1f7316a7d9e0730`
- `api.php` 5,362 bytes, SHA256 `ef886f21e6cf2059693e47fe398a6c57a44a4c56d924126742cf3edac6d7ff00`
- `admin.php` 15,532 bytes, SHA256 `21dc5c3dcb879b6a8fd83e63d5c567f15be66c19b61a65b5738c32a44c44af0e`
- `migrate_v04_language.sql` 532 bytes, SHA256 `d8a22dec773236f2b1c7081c87d0391b718238eb14a8bc223f1a55e1d9bb57ae`
- `README_DEPLOY.txt` 1,778 bytes, SHA256 `8869e2c5c38444f4771a77ce9e3a0d360c0721c947265f82effde220781e1`

Wave1 v0.4 reuses the same 12 frozen v0.3 stimulus assets. Exact binary mirror remains pending.

### Calibration
Live `calibration-v0.1` is verified on public/admin surfaces, but authoritative complete runtime source inventory remains to be mirrored.

Do not fabricate either satellite mirror. Satellite automation remains separate from the frontend workflow.

## Final operating model

Target steady state:

GitHub work -> validation -> frontend-only Hostinger deployment -> post-deploy smoke -> managed frontend rollback if needed.

GitHub owns the OMESG360 professional presentation layer only, never the complete Hostinger server tree.

## Deferred / do not expand scope now

- broader OMESG360 multi-page expansion;
- frozen Leadership 360 backend redesign;
- Organization Campaign / SaaS expansion;
- Wave1/Calibration redesign;
- 2Pair feature expansion before validation data;
- cosmetic work unrelated to recovery/safe deployment.

## Continuity rule

Accepted later/backlog decisions must be recorded here or in the appropriate repository roadmap before ending a work session.
