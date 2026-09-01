# PrioLens Open14 watermark audit v0.1

Date: 2026-09-01
Scope: current 28-runtime-asset Open14 bank
Method: full-image + four-corner OCR over live Hostinger assets, plus owner-smoke visual confirmation where available.

## Confirmed watermark findings

- REST-B — KlingAI watermark detected. Current decision already REPLACE_REQUIRED_WATERMARK, so no cleanup effort should be spent on this asset.
- ORDER-B — KlingAI 3.0 watermark detected. Current decision already REPLACE_REQUIRED_SEMANTIC_MISMATCH, so no cleanup effort should be spent on this asset.
- CONNECTION-A — KlingAI watermark detected. Stimulus otherwise remains a current PASS candidate. Action: CLEAN_REQUIRED_BEFORE_EXTERNAL_PILOT.
- CONNECTION-B — watermark visually confirmed during owner smoke. Stimulus otherwise remains a current PASS candidate. Action: CLEAN_REQUIRED_BEFORE_EXTERNAL_PILOT.

## No clear OCR watermark detected among current PASS candidates

RESOURCE-A, RESOURCE-B, SAFETY-A, SAFETY-B, BELONGING-A, CARE-A, CARE-B, AUTONOMY-B, CONTROL-B, RECOGNITION-A, RECOGNITION-B, MASTERY-A, MASTERY-B, EXPLORATION-A, EXPLORATION-B, OPPORTUNITY-B.

This is not proof of absence for logo-only or very low-contrast marks; OCR is a screening layer, not a visual-certification method.

## Gallery duplicate check

- CONNECTION-A: no near-identical clean duplicate found in Gallery; nearest perceptual matches are materially different images.
- CONNECTION-B: no near-identical clean duplicate found; closest candidate is still materially different.
- SAFETY-B: Gallery/S13.webp has perceptual hash distance 0 from the current SAFETY-B scene and is therefore a likely alternate copy worth preferring if visual review confirms it is watermark-free.

## Operational rule

Do not spend cleanup effort on assets already marked REPLACE/HOLD.
For PASS assets, any visible watermark/logo/text mark must be removed or replaced with a clean equivalent before external pilot use.
