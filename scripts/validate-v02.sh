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

legacy_pattern='services\.html|approach\.html|esg\.html|about\.html|contact\.html|blog\.html|atsiliepimai\.html|/omesg360/'
if grep -EIRn --exclude-dir=.git --exclude='PROJECT_ROADMAP.md' --exclude='RECOVERY_AND_INTEGRATION_PLAN.md' --exclude='validate-v02.sh' "$legacy_pattern" index.html privacy.html leadership-360 sitemap.xml sitemap_location.xml; then
  fail "legacy OMESG360 URL/reference detected in active V02 surface"
fi
info "no legacy root-page references in active surface"

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

mapfile -t actual_assets < <(find assets/img -maxdepth 1 -type f -printf '%f\n' | sort)
expected_assets=(favicon.svg logo.svg og-cover.png og-cover.svg)
mapfile -t expected_sorted < <(printf '%s\n' "${expected_assets[@]}" | sort)
[[ "$(printf '%s\n' "${actual_assets[@]}")" == "$(printf '%s\n' "${expected_sorted[@]}")" ]] || {
  printf 'Actual assets/img files:\n%s\n' "$(printf '%s\n' "${actual_assets[@]}")" >&2
  fail "assets/img differs from the four approved V02 image assets"
}
info "assets/img allowlist matches roadmap"

grep -q '<loc>https://omesg360.eu/</loc>' sitemap.xml || fail "homepage missing from sitemap"
grep -q '<loc>https://omesg360.eu/leadership-360/</loc>' sitemap.xml || fail "Leadership 360 missing from sitemap"
grep -q '<loc>https://omesg360.eu/privacy.html</loc>' sitemap.xml || fail "privacy page missing from sitemap"
info "SEO surface aligned"

if find . -type f \( -name 'config.php' -o -name '.env' -o -name '*.pem' -o -name '*.key' \) -not -path './.git/*' | grep -q .; then
  find . -type f \( -name 'config.php' -o -name '.env' -o -name '*.pem' -o -name '*.key' \) -not -path './.git/*' >&2
  fail "secret/runtime configuration file present in repository"
fi
info "no forbidden runtime secret files"

python3 - <<'PY'
from pathlib import Path
w = Path('.github/workflows/deploy-hostinger.yml').read_text(encoding='utf-8')
required = [
    'workflow_dispatch:',
    'pull_request:',
    'dry_run:',
    'FTP_HOST: 46.202.142.134',
    'HOSTINGER_FTP_USER',
    'HOSTINGER_FTP_PASSWORD',
    'Build frontend-only package',
    'mirror --reverse --dry-run',
    '.deploy-package/assets/img',
    '.deploy-package/leadership-360',
    'wave1',
    'conflictlab/releases/calibration-v0.1',
    'No remote delete operation was used',
    'Post-deploy HTTP smoke',
    'Restore previous frontend if upload or smoke fails',
]
for needle in required:
    if needle not in w:
        raise SystemExit(f'ERROR: deploy safety contract missing: {needle}')

for forbidden in ['rsync ', 'StrictHostKeyChecking', '--delete', 'rm -rf wave1', 'rm -rf conflictlab']:
    if forbidden in w:
        raise SystemExit(f'ERROR: forbidden deployment operation detected: {forbidden}')

for bad in ['.deploy-package/wave1', '.deploy-package/conflictlab', 'cp wave1', 'cp conflictlab']:
    if bad in w:
        raise SystemExit(f'ERROR: protected satellite path appears in frontend package: {bad}')

if "github.event_name == 'workflow_dispatch' && !inputs.dry_run" not in w:
    raise SystemExit('ERROR: real deploy is not constrained to explicit manual non-dry-run dispatch')

print('OK: frontend-only FTPS deployment contract; satellites remain protected/unmanaged')
PY

info "satellite live surfaces are protected from this deployment; exact mirrors remain a separate backlog item"
echo "PASS: OMESG360 V02 + Leadership recovery validation gate"
