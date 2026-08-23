# ConflictLab calibration-v0.1 — versioned Hostinger LAB

**Lifecycle:** LAB  
**Public switch:** NOT AUTHORIZED  
**External CALIBRATION collection:** BLOCKED pending live activation checklist  
**Required live collection mode during all deployment/smoke work:** `TECHNICAL`

Versioned LAB path:

```text
/conflictlab/releases/calibration-v0.1/
```

This release does not replace or modify `/wave1/`.

## Current participant flow

```text
LT / EN
-> Stage 0 familiarization
-> explicit timing-research choice
   -> 18+ declaration
   -> voluntary opt-in + privacy link
   OR local-only continuation
-> rapid 3-pair block / shared 6000 ms candidate budget
-> consented timing-only upload OR no upload
-> local reason reflection
-> local intensity 1-5
-> local Calculation / Evidence
-> fail-closed NOT_ESTIMABLE result
-> if upload succeeded: one-time participant deletion code
```

Gate D and Gate E remain `NONE`. No directional or psychological participant result is authorized.

## Server research boundary

The calibration DB stores only data required for mechanical timing research and governance:

```text
random ingestion/session UUIDs
run type
release/protocol/stimulus/form versions
coarse device category
timing/missingness/retry/page-hidden telemetry
consent version + affirmative-consent evidence + 18+ declaration
SHA-256 hash of participant deletion code
```

It does not store:

```text
name / email / phone / employer
precise location
research-use IP or full user-agent
selected A/B identity for construct interpretation
reason_id or reflection free text
intensity
reason/intensity response times
participant directional result
persistent cross-study participant ID
plaintext deletion code
```

Local reflection data remain local-only.

## TECHNICAL vs CALIBRATION

`cl_calibration_runs.run_type` is assigned by the server, not by the browser.

During deployment and owner testing keep the secret Hostinger `server/config.php` at:

```php
'collection_mode' => 'TECHNICAL',
```

TECHNICAL runs never enter confirmatory N/20.

Do not switch to `CALIBRATION` until `docs/privacy/CALIBRATION_ACTIVATION_CHECKLIST_v0.2.md` is closed and an explicit activation record + owner authorization exist.

## IMPORTANT — DB migrations required before this build can be smoke-tested

This build changes the run table. Before overwriting the LAB application bytes, apply these migrations to the isolated calibration database in order:

```text
1. server/migration_002_consent_fields.sql
2. server/migration_003_deletion_token.sql
```

They add nullable fields for existing TECHNICAL rows and do not turn old owner runs into calibration evidence.

After the migrations, update the existing secret `server/config.php` manually with:

```php
'consent_version' => 'timing-research-consent-v0.1',
'retention_days' => 90,
```

Do not overwrite the real DB credentials/password hash and do not change `collection_mode` from `TECHNICAL`.

## New privacy-control endpoints

Authenticated data operations:

```text
/server/data_admin.php
```

Capabilities:
- lookup and transactional deletion by participant deletion code;
- timing-only CSV export;
- filters by run type, form, device and eligibility;
- export schema `timing-export-v0.1`;
- no persistent generated CSV file.

Participant self-service deletion:

```text
/server/delete_my_data.php
```

The participant enters the one-time 32-character code manually. The plaintext code is not placed in the URL or stored in the database.

Retention cleanup:

```text
/server/retention_cleanup.php
```

This script is CLI-only and must be scheduled/verified through Hostinger cron before external CALIBRATION activation.

## Retention

Configured target for pseudonymous timing-study records:

```text
90 days maximum
```

The cleanup script deletes child pair events, then attempts, then the run in one transaction. A declared retention period is not considered operationally verified until Hostinger cron has been configured and tested with disposable TECHNICAL records.

## Canonical and Hostinger-compatible modules

The `canonical/` subtree contains deployment copies of the required source/config/assets.

Because the Hostinger environment previously served `.mjs` with an unsuitable MIME type, Hostinger-compatible `.js` copies remain present and `index.php` rewrites module references at delivery time. Research image bytes are not resampled or rewritten.

## Safe LAB deployment order

```text
1. confirm current live collection_mode = TECHNICAL
2. back up the current versioned LAB directory and isolated calibration DB
3. apply migration_002_consent_fields.sql
4. apply migration_003_deletion_token.sql
5. update secret config.php with consent_version + retention_days
6. extract the exact-head successful-CI artifact over
   public_html/conflictlab/releases/calibration-v0.1/
7. preserve the existing secret server/config.php
8. verify collection_mode is still TECHNICAL
9. run LT/EN/mobile TECHNICAL smoke tests
10. test consented upload and local-only no-upload path
11. test participant deletion code + admin deletion
12. test self-service deletion
13. test timing CSV export
14. configure/test retention cron
15. keep CALIBRATION disabled until the activation checklist is closed
```

Do not create an extra nested release directory. Do not touch the OMESG360 root or `/wave1/` during this LAB overwrite.

## Required TECHNICAL smoke checks

1. LT and EN flows complete.
2. Training remains non-uploaded.
3. Consent screen appears after training with unchecked boxes.
4. Privacy link opens `/privacy.html` in the selected language.
5. Local-only continuation completes without creating a research DB run.
6. Consented TECHNICAL path stores timing data plus consent metadata/hash.
7. Deletion code is shown only after a successful upload.
8. `data_admin.php` finds/deletes a disposable run by code.
9. `delete_my_data.php` can delete a separate disposable run by code.
10. CSV export matches `timing-export-v0.1` and excludes deletion/session/message identifiers.
11. Existing timing dashboard still reports owner runs as TECHNICAL.
12. Calibration N/20 remains `0/20` throughout owner testing.

## Release metadata

`release-manifest.json` is the deployment metadata source for this release. The GitHub Actions run/artifact metadata provides the exact source `head_sha`; do not infer package provenance from an artifact filename alone.

## Promotion boundary

This LAB work does not authorize:

```text
merge to main
/wave1/ replacement
external CALIBRATION collection
Gate D mapping
Gate E aggregation
participant directional interpretation
```
