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
  .github/workflows/deploy-hostinger.yml
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

# Deployment boundary is the recovery safety contract.
# Wave1 and Calibration are verified live on Hostinger but remain protected/unmanaged in this V02 deploy.
python3 - <<'PY'
from pathlib import Path
import re
w = Path('.github/workflows/deploy-hostinger.yml').read_text(encoding='utf-8')
required = [
    'workflow_dispatch:',
    'dry_run:',
    'environment:',
    'name: production',
    'StrictHostKeyChecking yes',
    'Create rollback snapshot',
    '.deploy-package/assets/img/',
    '${REMOTE_ROOT}/assets/img/',
    '.deploy-package/leadership-360/',
    '${REMOTE_ROOT}/leadership-360/',
    'UNTOUCHED: wave1/, conflictlab/releases/calibration-v0.1/',
]
for needle in required:
    if needle not in w:
        raise SystemExit(f'ERROR: deploy safety contract missing: {needle}')

# Never sync a package root into public_html with --delete.
root_delete = re.compile(r'rsync[\s\S]{0,350}?--delete[\s\S]{0,350}?"omesg360-hostinger:\$\{REMOTE_ROOT\}/"')
if root_delete.search(w):
    raise SystemExit('ERROR: dangerous root-level rsync --delete detected')

# Protected satellites and runtime DB/config paths must never be deletion targets.
for bad in [
    'rm -rf wave1',
    'rm -rf conflictlab',
    '.deploy-package/wave1',
    '.deploy-package/conflictlab',
]:
    if bad in w:
        raise SystemExit(f'ERROR: protected satellite path appears in managed deploy operation: {bad}')

print('OK: deployment is allowlist-scoped; Wave1 and Calibration remain protected/unmanaged')
PY

# The V02/Leadership package is allowed to proceed without pretending satellite mirroring is complete.
# Exact Wave1 and Calibration mirrors remain a separate recovery task before satellite deployment is ever automated.
info "satellite live surfaces are protected from this deployment; exact mirrors deferred to separate satellite recovery"

echo "PASS: OMESG360 V02 + Leadership recovery validation gate"
