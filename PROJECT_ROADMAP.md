# OMESG360 / 2rasi project roadmap and handover

Status: ACTIVE CONTINUITY DOCUMENT
Last updated: 2026-08-24 Europe/Vilnius
Primary OMESG360 branch: `main`
Primary 2rasi branch: `hero-webgl`

## Current production baseline
- Hostinger `public_html` restored manually from the known-good backup supplied on 2026-08-23.
- Hostinger Git auto-deployment from `main` to `public_html` is OFF and must stay OFF unless a new deployment contract is explicitly designed and tested.
- Controlled GitHub Actions -> FTP deployment is the active OMESG360 deployment path.
- OMESG360 V02 homepage is live.
- Leadership 360 presentation/routing is live.
- Responsive hero layout was corrected on desktop and mobile after production verification.
- Wave1 satellite was manually verified fully working in production.
- Calibration `calibration-v0.1` satellite was manually verified fully working in production.
- Runtime secrets remain Hostinger-only: `.private/`, `wave1/config.php`, `conflictlab/releases/calibration-v0.1/server/config.php`, databases and credentials.

## Root cause of second overwrite
Hostinger Git auto-deployment was still enabled. A harmless GitHub `main` bootstrap commit therefore caused Hostinger to redeploy the old mixed `main` tree into `public_html`. GitHub Actions did not perform that overwrite.

Hard rule: GitHub must not whole-root sync or delete the Hostinger `public_html` tree.

This does **not** prohibit future product development inside `public_html`.

New folders and necessary file changes are allowed when each change is evaluated for impact on the existing production system. Prefer isolated/backward-compatible additions and preserve all server-only runtime state.

## GitHub `main` — recovered source
`main` is now the active clean source line. It contains:
- recovered OMESG360 V02 frontend and privacy/SEO surface;
- native Leadership 360 presentation/routing and LT/EN behavior;
- frontend-only Hostinger deployment workflow;
- exact recovered Wave1 non-secret runtime mirror: 16 files;
- exact recovered Calibration `calibration-v0.1` non-secret runtime mirror: 67 files.

Satellite mirror recovery was completed through PR #4 and commit `54b46ade620ad6ed7af5263bd8520f7bf21c5dd8`. All 83 mirrored files were copied read-only from the restored Hostinger tree and matched against SHA256 values calculated from the uploaded known-good ZIP before being committed.

Not committed by design:
- `wave1/config.php`;
- `conflictlab/releases/calibration-v0.1/server/config.php`;
- `.private/`;
- databases/credentials;
- Hostinger `.git/` metadata;
- `Archive/` old-site historical files and `DO_NOT_UPLOAD_HERE`, which remain part of the server backup rather than the active source/deploy surface.

Never resume `agent/leadership-360-home`. `recovery/v02-clean-baseline` is historical recovery lineage; `main` is now the active source.

## Deployment model
Frontend-only plain FTP allowlist for the current normal deployment path. No `rsync`, no `--delete`, no whole-root sync.

Current managed frontend package:
- `index.html`
- `privacy.html`
- robots/sitemaps and verification files
- four approved `assets/img` files
- `leadership-360/index.html`

Wave1 and Calibration are mirrored in GitHub for recovery/source integrity, but remain outside the normal frontend deployment package. Their two live `config.php` files remain server-only.

Future modules may receive their own controlled deployment contract or an explicitly extended allowlist after impact review. Do not silently broaden the current deployment surface.

## Validation state
- Dry-run #48: PASS; exact FTP root verified; no production write.
- Controlled real frontend deployment: PASS.
- Managed production smoke checks: PASS.
- Responsive hero hotfix: deployed and user-verified corrected on desktop and mobile.
- Wave1 public/admin: manually verified fully working.
- Calibration public/admin: manually verified fully working.
- Satellite GitHub mirror: 83 files exactly; secret config paths absent from GitHub.
- Temporary recovery/hotfix workflows: removed.

## 2rasi Leadership integration — COMPLETE
Routing integration completed on `olemoz1977/2rasi-web`, branch `hero-webgl`, commit `76db8161cedb58cc3f3c53b15073fe6093187cbd`.

Leadership About/positioning cleanup completed on the same branch, commit `fc65c33f5fdec2c5416a2b8bdf6447a489577162`.

Current routing:
- `2rasi.com` Leadership Start -> `https://omesg360.eu/leadership-360/?lang=en`;
- `2rasi.lt` Leadership Start -> `https://omesg360.eu/leadership-360/?lang=lt`;
- 2rasi Leadership About is bilingual and links to the full professional overview on OMESG360;
- OMESG360 Leadership presentation -> frozen `gla360-personal-full` setup/product;
- no direct 2rasi Leadership CTA bypasses OMESG360.

Human/live end-to-end validation completed on 2026-08-23:
- EN path: PASS;
- LT path: PASS.

Leadership integration is frozen. Reopen only for a new explicit product requirement or production defect.

## Current research state

Wave1 and Calibration are active data-collection surfaces. They remain evidence-gated research inputs, not invitations to reopen 2Pair core feature work.

Current rule:
- collect data under the existing protocol boundaries;
- do not redesign live mechanics from weak interim evidence;
- when an evidence gate is reached, freeze the relevant dataset and analyse it before unrelated development.

Cross-portfolio WorkStyle v0.7 is also collecting pilot data on 2rasi. Leadership SJT is frozen as a possible later WorkStyle evolution stage.

## OMESG360 operational product direction — VISION ONLY

Two related operational concepts were captured on 2026-08-24. Neither is in active development.

### Competency Matrix / Capability
Source:
`COMPETENCY_MATRIX_VISION.md`

Status:
**VISION CAPTURED / NOT IN ACTIVE DEVELOPMENT**.

Direction:
- Team Lead operational capability tool;
- current standard / SOP connects to competence evaluation;
- current level, target/need, gap, Globėjas/trainer, training plan and reassessment;
- `N` / `-` means no need to know and is not the same as `0`;
- future analysis should consider coverage, single-point dependency and knowledge concentration;
- a strong system must not depend on one `superhero`.

### Darbo vietos knyga / Workplace Book
Source:
`WORKPLACE_BOOK_VISION.md`

Status:
**KEEP / MERGE INTO FUTURE OMESG360 CORE / NOT IN ACTIVE DEVELOPMENT**.

Direction:
- operator/shop-floor access to current relevant workplace knowledge;
- standard work / SOP / TWI / quality / safety / SMED / abnormal-condition guidance where relevant;
- SOP is part of standardization and is continuously improvable;
- avoid duplicate process knowledge between Workplace Book and Competency Matrix;
- potential long-term shared loop: `Process / Flow -> Stability -> Standardization -> People Capability -> Improvement`.

## Knowledge / training source material — NOT PRODUCTS YET

Two source-material families have been identified:

1. Lean / Six Sigma / TOC teaching material
   - future OMESG360 knowledge-base source candidate;
   - keep as source material;
   - do not publish 1:1; audit accuracy, provenance and framing first.

2. Team Lead / `Vilko valanda` teaching material
   - feedback, engagement, collaboration, leadership, resilience, situational leadership, PAEI/organizational lifecycle, Karpman, growth mindset and related topics;
   - future Team Lead learning-source candidate;
   - keep as source material;
   - do not productize or publish 1:1 before audit/rebuild.

No Knowledge Base, Academy, Competency Matrix or Workplace Book development is active now.

## Current gate

OMESG360 production baseline is healthy and recovered. Leadership integration is complete. Wave1 and Calibration are collecting evidence.

Do not re-enable Hostinger Git auto-deployment.

Do not start new OMESG360 product implementation merely to create activity while evidence-gated streams are running.

## Next controlled work

Current safe work while research data accumulates:
1. keep source-of-truth documentation current;
2. protect production stability;
3. support Wave1 / Calibration analysis and data quality when needed;
4. perform portfolio / legacy-tool audit without redesigning tools during the audit.

Competency Matrix, Workplace Book, Knowledge Base and Team Lead learning concepts remain captured visions until explicitly reprioritized.

`PROJECT_ROADMAP.md` + `RECOVERY_AND_INTEGRATION_PLAN.md` remain the OMESG360 production/recovery source of truth. Cross-portfolio priority is maintained in `olemoz1977/2rasi-web/PORTFOLIO_ROADMAP.md`.
