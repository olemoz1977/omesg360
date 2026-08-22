#!/usr/bin/env bash
set -euo pipefail

fail() { echo "ERROR: $*" >&2; exit 1; }
info() { echo "OK: $*"; }

required=(
  index.html
  privacy.html
  leadership-360/index.html
  robots.txt
  sitemap.xml
  sitemap_location.xml
  assets/img/favicon.svg
  assets/img/logo.svg
  assets/img/og-cover.png
  assets/img/og-cover.svg
)

for path in "${required[@]}"; do
  [[ -f "$path" ]] || fail "missing required V02 file: $path"
done
info "required V02 files present"

# The recovered V02 must stay a single-page professional shell, not return to the old multi-page site.
legacy_pattern='services\.html|approach\.html|esg\.html|about\.html|contact\.html|blog\.html|atsiliepimai\.html|/omesg360/'
if grep -EIRn --exclude-dir=.git --exclude='PROJECT_ROADMAP.md' --exclude='RECOVERY_AND_INTEGRATION_PLAN.md' --exclude='validate-v02.sh' "$legacy_pattern" index.html privacy.html leadership-360 sitemap.xml sitemap_location.xml; then
  fail "legacy OMESG360 URL/reference detected in active V02 surface"
fi
info "no legacy root-page references in active surface"

# Leadership 360 belongs after methodology and before About, and must route into the frozen V2 flow.
grep -q 'id="leadership"' index.html || fail "homepage Leadership 360 section missing"
grep -q '/leadership-360/?lang=' index.html || fail "homepage Leadership 360 language-aware route missing"
grep -q 'gla360-personal-full/setup-v2.html?lang=lt' leadership-360/index.html || fail "LT Leadership start CTA does not target frozen setup-v2"
grep -q 'gla360-personal-full/setup-v2.html?lang=en' leadership-360/index.html || fail "EN Leadership start CTA does not target frozen setup-v2"
grep -q 'gla360-personal-full/PRIVACY-v2.html?lang=lt' leadership-360/index.html || fail "Leadership privacy CTA missing"
python3 - <<'PY'
from pathlib import Path
s=Path('index.html').read_text(encoding='utf-8')
positions={k:s.find(k) for k in ['methods.quote','id="leadership"','id="apie"']}
if min(positions.values()) < 0 or not (positions['methods.quote'] < positions['id="leadership"'] < positions['id="apie"']):
    raise SystemExit('ERROR: Leadership section is not after methodology and before About')
print('OK: Leadership section placement')
PY

# Only the four roadmap-approved shared image assets may live in assets/img.
mapfile -t actual_assets < <(find assets/img -maxdepth 1 -type f -printf '%f\n' | sort)
expected_assets=(favicon.svg logo.svg og-cover.png og-cover.svg)
mapfile -t expected_sorted < <(printf '%s\n' "${expected_assets[@]}" | sort)
[[ "$(printf '%s\n' "${actual_assets[@]}")" == "$(printf '%s\n' "${expected_sorted[@]}")" ]] || {
  printf 'Actual assets/img files:\n%s\n' "$(printf '%s\n' "${actual_assets[@]}")" >&2
  fail "assets/img differs from the four approved V02 image assets"
}
info "assets/img allowlist matches roadmap"

# SEO surface must not advertise removed pages.
grep -q '<loc>https://omesg360.eu/</loc>' sitemap.xml || fail "homepage missing from sitemap"
grep -q '<loc>https://omesg360.eu/leadership-360/</loc>' sitemap.xml || fail "Leadership 360 missing from sitemap"
grep -q '<loc>https://omesg360.eu/privacy.html</loc>' sitemap.xml || fail "privacy page missing from sitemap"
info "SEO surface aligned"

# Source-controlled secrets are forbidden. Runtime config.php files stay unmanaged on Hostinger.
if find . -type f \( -name 'config.php' -o -name '.env' -o -name '*.pem' -o -name '*.key' \) -not -path './.git/*' | grep -q .; then
  find . -type f \( -name 'config.php' -o -name '.env' -o -name '*.pem' -o -name '*.key' \) -not -path './.git/*' >&2
  fail "secret/runtime configuration file present in repository"
fi
info "no forbidden runtime secret files"

# Recovery blocker: frozen satellites must be mirrored before production deployment is enabled.
if [[ ! -d wave1 ]]; then
  echo "BLOCKER: wave1/ frozen live mirror is not yet present in GitHub" >&2
  exit 20
fi
if [[ ! -d conflictlab/releases/calibration-v0.1 ]]; then
  echo "BLOCKER: conflictlab/releases/calibration-v0.1/ frozen live mirror is not yet present in GitHub" >&2
  exit 21
fi

# Wave 1 v0.4 code plus the unchanged frozen v0.3 stimulus set must all be present.
wave1_required=(
  wave1/index.html
  wave1/api.php
  wave1/admin.php
  wave1/assets/more-reveal.webp
  wave1/assets/less-reveal.jpg
  wave1/assets/more-evidence.png
  wave1/assets/less-evidence.png
  wave1/assets/more-reference.png
  wave1/assets/less-reference.png
  wave1/assets/no-predefined-zones.png
  wave1/assets/predefined-zones.png
  wave1/assets/fixed-slots.png
  wave1/assets/continuous-capacity.png
  wave1/assets/partitioned-space.png
  wave1/assets/open-space.png
)
for path in "${wave1_required[@]}"; do
  [[ -f "$path" ]] || fail "Wave 1 frozen mirror incomplete: missing $path"
done
grep -q "PROTOCOL_VER = 'wave1-v0.4'" wave1/index.html || fail "Wave 1 UI is not frozen v0.4"
grep -q "'wave1-v0.4'" wave1/api.php || fail "Wave 1 API is not frozen v0.4"
grep -q "'wave1-v0.4'" wave1/admin.php || fail "Wave 1 admin is not v0.4-aware"
info "Wave 1 v0.4 code and 12 frozen stimulus assets present"

# Calibration filenames are intentionally validated minimally until the exact live package is reconciled.
[[ -f conflictlab/releases/calibration-v0.1/admin.php ]] || fail "Calibration admin.php missing"
[[ -f conflictlab/releases/calibration-v0.1/retention_cleanup.php ]] || fail "Calibration retention_cleanup.php missing"
grep -q 'calibration-v0.1' conflictlab/releases/calibration-v0.1/admin.php || fail "Calibration release identity missing"
info "Calibration mirror present"

echo "PASS: OMESG360 V02 recovery validation gate"
