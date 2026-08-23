# calibration-v0.1 canonical blob inventory

These files are copied into the deploy release **without content changes**. Git tree entries reuse the source blob SHA.

## Config

| Source path | Git blob SHA |
|---|---|
| `config/future-session/stimulus-set-v1.json` | `80831b1a836f4a9f87512b74ab5ad0c2d5ad6bc9` |
| `config/future-session/rapid-presentation-v1.json` | `07215d938767d1fa28639afdf3b219d2894ab993` |
| `config/future-session/reason-map-v1.json` | `8763946036c782150f373693fd66816a36e3eef8` |
| `config/future-session/training-set-v1.json` | `08d630c63791547152549c4b6b90b3a922ab191b` |
| `config/future-session/timing-calibration-v1.json` | `95fa4128723d3577a94f5e612074e1b953dee394` |

## JS

| Source path | Git blob SHA |
|---|---|
| `src/future_session/presentation_plan.mjs` | `d3c492a60ea71985db6e43b2f743f63358caab89` |
| `src/future_session/training_plan.mjs` | `bee7024dc7eff8370421201647749835aa25cc98` |
| `src/future_session/asset_preloader.mjs` | `84950174657bb93b67d2ed9869514068c02b07f7` |
| `src/future_session/session_orchestrator.mjs` | `32b9b496889aa35eda7588983b248e180271db59` |
| `src/future_session/rapid_block_core.mjs` | `e4422c04e6106f9b64685ece386596a2218e4ff3` |
| `src/future_session/reflection_model.mjs` | `acade71b3067f9e7ee0f0a3705bebdf14b1fbee8` |
| `src/future_session/reflection_ui.mjs` | `1776c83864ee065549f6aa5372ed462b243f223c` |

## Training assets

P0-001/P0-002/P0-003 are deployment copies only; frozen source paths remain untouched.

## Research assets

All 12 assets referenced by `stimulus-set-v1` are copied byte-for-byte from `docs/experiments/stimulus-validation/assets/`.