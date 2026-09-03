# PrioLens Open14 v0.3 next runtime

Status: FEATURE-BRANCH DRAFT / FAIL-CLOSED / NOT DEPLOYED / LIVE v0.2 UNCHANGED

Branch: `feature/priolens-open14-v03`

## Purpose

This directory is the isolated next-runtime integration target for the frozen 42-stimulus Open14 v0.3 bank.

It must not be treated as the live formative runtime until all deployment gates pass.

## Frozen identities

- bank: `2rasi.priolens.open14.bank-v0.3`
- family plan schema: `2rasi.priolens.p3.open14.plan-v0.2`
- family planner: `cyclic-14x3-diff-1-4-slot-role-v0.2`
- exemplar assigner schema: `2rasi.priolens.open14.exemplars-v0.3`
- exemplar assigner: `balanced-3x1-no-repeat-slot-v0.3`
- session: `2rasi.priolens.open14.session-v0.3`
- sufficiency layer remains: `2rasi.priolens.sufficiency-v0.2`

The unchanged family planner intentionally retains v0.2 identity. The no-repeat exemplar assignment is separately versioned v0.3.

## Fail-closed gate

`bank.json` currently has:

```json
"runtimeReady": false
```

The generated index must refuse to enable Start while this remains false.

Do not flip it to true until:
1. the 15 approved v0.3 WebPs are uploaded to `/priolens-research-assets/Open14-v03/`;
2. all 15 return successful HTTP responses;
3. downloaded bytes match the exact SHA-256 values in `bank.json` / the canonical geometry manifest;
4. retained live paths are also reachable;
5. the full 42-bank audit passes.

## Build

`build_from_v02.mjs` derives `index.html` from the current v0.2 participant surface using guarded exact replacements.

The builder changes only version-dependent runtime behavior:
- imports the v0.3 no-repeat assigner;
- uses separate v0.3 final/progress endpoint paths;
- uses a v0.3 local draft key and session schema;
- requires `bank.runtimeReady === true` before enabling Start;
- stores v0.3 exemplar-assignment metadata;
- detects family repetition from distinct canonical exemplar IDs rather than legacy `-A/-B` suffixes;
- removes result copy that assumes exactly two exemplars.

The build fails if expected v0.2 source markers are missing or duplicated unexpectedly.

## API source

`server/api.php` and `server/progress.php` are v0.3-only validator sources intended for a separate Hostinger endpoint directory such as:

`/priolens-open14-v03-api/`

They do not replace live `/priolens-open14-api/`.

The v0.3 final validator requires:
- exact v0.3 session/bank/assigner identities;
- the unchanged v0.2 family-plan schema;
- 14 trials;
- 42 unique presented canonical exemplar IDs;
- each family exactly `01`, `02`, `03` once;
- no exact exemplar repeat;
- the existing v0.2 sufficiency item contract.

No database schema change is required by this source because existing rows already record session/bank/planner/assigner schema plus raw payload.

## Research boundaries

Unchanged:
- Channel A is low-deliberation comparative visual choice, not subconscious truth;
- visual pull is not an unmet need;
- RT is not psychological strength;
- there is no single Maslow score;
- CARE visual giving and `CARE_SUPPORT_PRESENT` received/present support are not equivalent constructs.

## Deployment boundary

Canonical research image binaries remain in persistent Hostinger research-assets storage, not Git.

This feature branch contains runtime code and provenance only.

External recruitment remains CLOSED.
