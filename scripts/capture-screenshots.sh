#!/usr/bin/env bash
set -e

export PATH="/opt/homebrew/opt/ruby/bin:$PATH:$HOME/.maestro/bin"

APP_PATH=$(find ios/simulator-build/Build/Products/Release-iphonesimulator -name "*.app" -maxdepth 1 2>/dev/null | head -1)

if [ -z "$APP_PATH" ]; then
  echo ""
  echo "Error: No simulator build found."
  echo "Run 'yarn screenshots:1:build' first."
  echo ""
  exit 1
fi

wait_for_boot() {
  local device="$1"
  local retries=20
  while [ $retries -gt 0 ]; do
    if xcrun simctl list devices | grep "$device" | grep -q '(Booted)'; then
      return 0
    fi
    sleep 1
    retries=$((retries - 1))
  done
  echo "Error: Simulator '$device' did not boot in time."
  exit 1
}

capture() {
  local device="$1"
  local output="$2"
  echo ""
  echo "== Capturing: $device =="
  xcrun simctl boot "$device" 2>/dev/null || true
  wait_for_boot "$device"
  local udid
  udid=$(xcrun simctl list devices | grep -F "$device" | grep '(Booted)' | grep -oE '[A-F0-9-]{36}' | head -1)
  if [ -z "$udid" ]; then
    echo "Error: Could not find booted UDID for '$device'."
    exit 1
  fi
  xcrun simctl install "$udid" "$APP_PATH"
  if ! maestro test .maestro/screenshots.yaml --device "$udid" --test-output-dir "$output"; then
    echo "Error: Maestro failed for '$device'."
    xcrun simctl shutdown "$udid" 2>/dev/null || true
    exit 1
  fi
  xcrun simctl shutdown "$udid" 2>/dev/null || true
  echo "== Done: $output =="
}

capture "iPhone Air"            "./screenshots/ios/6.9-inch"
capture "iPhone 17 Pro Max"     "./screenshots/ios/6.9-inch-promax"
capture "iPad Pro 13-inch (M5)" "./screenshots/ios/13-inch"

# Reorganize into locale folder for Fastlane deliver
EN_US="./screenshots/ios/en-US"
rm -rf "$EN_US"
mkdir -p "$EN_US"

copied=0
for f in ./screenshots/ios/6.9-inch/screenshots/*.png; do
  [ -f "$f" ] && cp "$f" "$EN_US/iPhone_Air-$(basename "$f")" && copied=$((copied + 1))
done
for f in ./screenshots/ios/6.9-inch-promax/screenshots/*.png; do
  [ -f "$f" ] && cp "$f" "$EN_US/iPhone_17_Pro_Max-$(basename "$f")" && copied=$((copied + 1))
done
for f in ./screenshots/ios/13-inch/screenshots/*.png; do
  [ -f "$f" ] && cp "$f" "$EN_US/iPad_Pro_13inch-$(basename "$f")" && copied=$((copied + 1))
done

if [ "$copied" -eq 0 ]; then
  echo ""
  echo "Error: No screenshots were generated. Check Maestro output above."
  exit 1
fi

echo ""
echo "All screenshots saved to ./screenshots/ios/ ($copied files in en-US/)"
