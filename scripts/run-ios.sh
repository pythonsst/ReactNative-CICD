#!/usr/bin/env bash
#
# run-ios.sh — build & launch the app on an iOS simulator, the easy way.
#
# Usage:
#   ./scripts/run-ios.sh [dev|staging|prod] [simulator name]
#
# Examples:
#   ./scripts/run-ios.sh staging
#   ./scripts/run-ios.sh dev "iPhone 16"
#   yarn ios:run:staging          # via the package.json alias
#
# It handles the things that usually trip people up:
#   • installs CocoaPods if they're missing / out of date
#   • frees port 8081 if a stale Metro is holding it, then starts a fresh one
#     rooted in THIS project (wrong-rooted Metro = silent wrong bundle)
#   • boots the simulator if nothing is booted
#   • builds the correct scheme with the correct .env file
#
set -euo pipefail

cd "$(dirname "$0")/.."

# ── args ─────────────────────────────────────────────────────────────────────
FLAVOR="${1:-staging}"
SIM_NAME="${2:-iPhone 17 Pro}"

case "$FLAVOR" in
  dev|development)
    SCHEME="development"; ENV_FILE=".env.development"; APP_ID="com.snapbiodata.app.development" ;;
  staging|stag)
    SCHEME="staging";     ENV_FILE=".env.staging";     APP_ID="com.snapbiodata.app.staging" ;;
  prod|production)
    SCHEME="production";  ENV_FILE=".env.production";   APP_ID="com.snapbiodata.app" ;;
  *)
    echo "❌ Unknown flavor '$FLAVOR' (use: dev | staging | prod)"; exit 1 ;;
esac

bold() { printf "\033[1m%s\033[0m\n" "$1"; }
step() { printf "\n\033[1;35m▶ %s\033[0m\n" "$1"; }

bold "SnapBiodata → iOS ($FLAVOR / scheme=$SCHEME / $ENV_FILE)"

# ── 1. CocoaPods ─────────────────────────────────────────────────────────────
step "Checking CocoaPods"
if [ ! -d ios/Pods ] || [ "ios/Podfile.lock" -ot "ios/Podfile" ]; then
  echo "Installing pods…"
  ( cd ios && ( bundle exec pod install || pod install ) )
else
  echo "Pods up to date."
fi

# ── 2. Simulator ─────────────────────────────────────────────────────────────
step "Preparing simulator"
UDID="$(xcrun simctl list devices available | grep -F "$SIM_NAME (" | head -1 | grep -oE '[0-9A-F-]{36}' || true)"
if [ -z "$UDID" ]; then
  echo "❌ Simulator '$SIM_NAME' not found. Available iPhones:"
  xcrun simctl list devices available | grep -i iphone
  exit 1
fi
if ! xcrun simctl list devices booted | grep -q "$UDID"; then
  echo "Booting $SIM_NAME…"; xcrun simctl boot "$UDID" || true
fi
open -a Simulator || true
echo "Using $SIM_NAME ($UDID)"

# ── 3. Metro (fresh, rooted here) ────────────────────────────────────────────
step "Starting Metro"
if lsof -tiTCP:8081 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Freeing port 8081 (stale packager)…"
  lsof -tiTCP:8081 -sTCP:LISTEN | xargs kill 2>/dev/null || true
  sleep 1
fi
ENVFILE="$ENV_FILE" nohup yarn start --reset-cache >/tmp/snapbiodata-metro.log 2>&1 &
echo "Metro starting (logs: /tmp/snapbiodata-metro.log)"
until curl -s http://localhost:8081/status | grep -q running; do sleep 1; done
echo "Metro ready."

# ── 4. Build & launch ────────────────────────────────────────────────────────
step "Building & launching (first cold build takes a few minutes)"
ENVFILE="$ENV_FILE" npx react-native run-ios \
  --scheme "$SCHEME" --udid "$UDID" --no-packager

step "Done"
echo "✅ Launched $APP_ID on $SIM_NAME."
echo "   Reload JS after edits:  press R in the sim, or re-run this script."
