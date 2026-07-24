#!/usr/bin/env bash
#
# upload-screenshots.sh — push the App Store screenshots to App Store Connect.
#
# Usage:
#   ./scripts/upload-screenshots.sh
#
# It uploads every image in ios/fastlane/screenshots/en-US/ to the current
# editable App Store version (no binary, no metadata; overwrites existing
# screenshots). To change the images, drop new PNGs in that folder first —
# see ios/fastlane/SCREENSHOTS.md for sizes/naming.
#
# ── One-time setup ───────────────────────────────────────────────────────────
#   1. App Store Connect → Users and Access → Integrations → App Store Connect
#      API → generate a key with "App Manager" role, download the .p8.
#   2. Save it as        ios/fastlane/asc_api_key.p8         (gitignored)
#   3. Put the ids in    ios/fastlane/.asc.env               (gitignored):
#        export ASC_KEY_ID=XXXXXXXXXX
#        export ASC_ISSUER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

cd "$(dirname "$0")/.."

ENV_FILE="ios/fastlane/.asc.env"
KEY_FILE="ios/fastlane/asc_api_key.p8"

bold() { printf "\033[1m%s\033[0m\n" "$1"; }

# Load the (non-secret) key ids if the env file exists.
if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1090
  set -a && source "$ENV_FILE" && set +a
fi

# Preflight: make sure everything is in place with helpful errors.
[ -f "$KEY_FILE" ] || { echo "❌ Missing $KEY_FILE — download your ASC API key (.p8) and save it there."; exit 1; }
: "${ASC_KEY_ID:?❌ ASC_KEY_ID is not set — add it to $ENV_FILE}"
: "${ASC_ISSUER_ID:?❌ ASC_ISSUER_ID is not set — add it to $ENV_FILE}"

count=$(find ios/fastlane/screenshots -type f -name "*.png" | wc -l | tr -d ' ')
[ "$count" -gt 0 ] || { echo "❌ No PNG screenshots found in ios/fastlane/screenshots/"; exit 1; }

bold "Uploading $count screenshot(s) to App Store Connect (key $ASC_KEY_ID)…"

# Prefer the project's bundled fastlane; fall back to a global install.
if command -v bundle >/dev/null 2>&1 && (cd ios && bundle exec fastlane --version >/dev/null 2>&1); then
  (cd ios && bundle exec fastlane screenshots)
else
  (cd ios && fastlane screenshots)
fi

bold "✅ Done. Check App Store Connect → your app → the editable version → Screenshots."
