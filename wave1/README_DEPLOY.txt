# ConflictLab Wave 1 — v0.4 deployment

## What changes from v0.3
- LT / EN participant interface
- language can also be selected with `?lang=lt` or `?lang=en`
- participant language is stored in DB as `language`
- privacy link is shown before the session starts and after completion
- admin dashboard can switch between v0.4 and historical v0.3 data

## What does NOT change
- same 6 candidate pairs
- same stimulus assets
- same randomized pair order
- same randomized Top / Bottom assignment
- same choice semantics
- same optional free text / intensity / hard_to_identify behavior
- same latency timing rule
- same duplicate protection concept

## Upload order — important

1. Back up current live files (`index.html`, `api.php`, `admin.php`).
2. Run `migrate_v04_language.sql` in phpMyAdmin.
3. Verify that the `language` column exists.
4. Upload `api.php`.
5. Upload `index.html`.
6. Upload `admin.php`.
7. Do one LT smoke test and one EN smoke test.
8. In admin verify:
   - `protocol_version = wave1-v0.4`
   - language is `lt` or `en`
   - 6/6 rows stored under one participant UUID
   - free text / intensity / hard_to_identify behave as expected
   - latency is populated
9. Exclude the technical smoke-test UUIDs from research analysis.
10. Only after PASS, mirror v0.4 into the GitHub repository and freeze the version.

## Direct language URLs

- LT: `https://omesg360.eu/wave1/?lang=lt`
- EN: `https://omesg360.eu/wave1/?lang=en`

Plain `/wave1/` uses `?lang=` when supplied, otherwise the browser language (English -> EN; all other languages -> LT).

## Privacy

The participant-facing page links to:
- `/privacy.html?lang=lt`
- `/privacy.html?lang=en`

No consent checkbox was added. The privacy notice remains informational and participation is voluntary.
