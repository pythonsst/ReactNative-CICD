╭─────────────────────────────────────────────────────────────────────────────╮
│  Screenshots & Store Metadata                                               │
│  ReactNativeIgniteKit  ·  Automated capture + upload guide                  │
╰─────────────────────────────────────────────────────────────────────────────╯

  Quick help in terminal:  yarn screenshots:help


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ONE-TIME SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Run once after cloning the repo:

    yarn setup

  This installs:
    · npm dependencies          (yarn install)
    · Fastlane + CocoaPods      (bundle install  via Gemfile)
    · Maestro CLI               (brew install — mobile UI automation tool)

  Verify tools are ready:

    maestro --version           # should print 1.x or 2.x
    bundle exec fastlane --version

  Create your ASC API key file (not committed — keep it secret):

    cp /dev/null asc-api-key.json   # create empty file, then fill in:

    {
      "key_id":     "XXXXXXXXXX",
      "issuer_id":  "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "key":        "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
      "duration":   1200,
      "in_house":   false
    }

  Where to get these values:
    · App Store Connect → Users & Access → Integrations → App Store Connect API
    · Generate a key with App Manager role
    · Copy Key ID and Issuer ID from the page
    · Paste the .p8 file contents as the "key" value (replace newlines with \n)

  ⚠️  asc-api-key.json and AuthKey_*.p8 are gitignored. Never commit them.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  HOW IT WORKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Three steps, each a separate command:

  ┌─────────────────────────┬────────────────────────────────────────────────┐
  │ Command                 │ What it does                                   │
  ├─────────────────────────┼────────────────────────────────────────────────┤
  │ screenshots:1:build     │ Compiles the staging app for iOS Simulator.    │
  │                         │ Saves binary to ios/simulator-build/.          │
  │                         │ Run once, or after any code change.            │
  ├─────────────────────────┼────────────────────────────────────────────────┤
  │ screenshots:2:capture   │ Boots each simulator, installs the app,        │
  │                         │ runs the Maestro flow (.maestro/screenshots    │
  │                         │ .yaml), captures screenshots, reorganizes      │
  │                         │ output into screenshots/ios/en-US/ for upload. │
  ├─────────────────────────┼────────────────────────────────────────────────┤
  │ screenshots:3:upload    │ Uploads screenshots/ios/en-US/ to              │
  │   :ios                  │ App Store Connect via Fastlane deliver.        │
  │                         │ Requires asc-api-key.json (see setup above).   │
  │   :android              │ Uploads screenshots/android/ to Google Play    │
  │                         │ via Fastlane supply.                           │
  └─────────────────────────┴────────────────────────────────────────────────┘

  Or run all three steps at once:

    yarn screenshots:all


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STEP BY STEP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Step 1 — Build app for simulator
  ──────────────────────────────────
  yarn screenshots:1:build

  · Builds the "IgniteKit staging" scheme in Release mode for iphonesimulator
  · No device signing required
  · No Metro / JS bundler needed (JS is bundled into the binary)
  · Output saved to ios/simulator-build/ (gitignored)

  Step 2 — Capture screenshots
  ─────────────────────────────
  yarn screenshots:2:capture

  Runs automatically on three devices:

  ┌──────────────────────────┬──────────────────────┬──────────────────────┐
  │ Simulator                │ Output folder         │ en-US prefix         │
  ├──────────────────────────┼──────────────────────┼──────────────────────┤
  │ iPhone Air               │ ios/6.9-inch/         │ iPhone_Air-          │
  │ iPhone 17 Pro Max        │ ios/6.9-inch-promax/  │ iPhone_17_Pro_Max-   │
  │ iPad Pro 13-inch (M5)    │ ios/13-inch/          │ iPad_Pro_13inch-     │
  └──────────────────────────┴──────────────────────┴──────────────────────┘

  After capture, screenshots are automatically reorganized into:
    screenshots/ios/en-US/   ← Fastlane deliver reads from here

  Note on App Store display slots:
  · Current iOS 26 simulators output 1206×2688 → maps to 6.3" display slot
  · To fill the 6.9" slot (1320×2868) or 13" iPad slot (2064×2752),
    download iOS 18 runtime via Xcode → Settings → Platforms
    and update device names in scripts/capture-screenshots.sh

  Step 3 — Upload to App Store
  ─────────────────────────────
  yarn screenshots:3:upload:ios       → App Store Connect (requires asc-api-key.json)
  yarn screenshots:3:upload:android   → Google Play Console


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  STORE METADATA (App Store text)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  App title, subtitle, description, keywords, URLs, and release notes are
  managed via store.config.json (EAS Metadata — iOS only).

  yarn metadata:pull          pull current live metadata into store.config.json
  yarn metadata:lint          validate store.config.json without pushing
  yarn metadata:push          push edited store.config.json to App Store Connect

  Workflow:
  ① yarn metadata:pull        (first time — bootstraps store.config.json)
  ② Edit store.config.json
  ③ yarn metadata:lint        (catch errors before pushing)
  ④ yarn metadata:push        (requires Apple ID login — EAS uses session cookie)

  Fields managed in store.config.json:
  ┌─────────────────────┬─────────────────────────────────────────────────┐
  │ Field               │ Notes                                           │
  ├─────────────────────┼─────────────────────────────────────────────────┤
  │ title               │ App name (max 30 chars)                         │
  │ description         │ Full description (max 4000 chars)               │
  │ keywords            │ Array of strings (max 100 chars total)          │
  │ releaseNotes        │ What's New text for this version                │
  │ supportUrl          │ Must be a reachable URL                         │
  │ privacyPolicyUrl    │ Must be a reachable URL                         │
  │ marketingUrl        │ Optional landing page URL                       │
  │ copyright           │ Update year manually each year                  │
  └─────────────────────┴─────────────────────────────────────────────────┘

  Note: Screenshots are NOT supported by EAS Metadata — use
  yarn screenshots:3:upload:ios instead.

  Note: Google Play metadata must be updated manually in Play Console.
        EAS Metadata does not support Android.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ADDING NEW SCREENS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  All screenshot flows live in .maestro/screenshots.yaml.
  Add a new screenshot by appending tap + takeScreenshot steps:

    - tapOn: "Button Label"
    - waitForAnimationToEnd
    - takeScreenshot: "03_my_new_screen"

  Full Maestro command reference:  https://docs.maestro.dev

  After editing the flow, re-run:

    yarn screenshots:2:capture        # no rebuild needed — only flow changed
    yarn screenshots:3:upload:ios


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SCREENSHOT REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Apple App Store
  ───────────────
  ┌────────────────┬───────────────┬──────────────────────────────────────────┐
  │ Display        │ Resolution    │ Notes                                    │
  ├────────────────┼───────────────┼──────────────────────────────────────────┤
  │ 6.9" iPhone    │ 1320×2868 px  │ Required. Covers iPhone 16 Pro Max+      │
  │ 6.3" iPhone    │ 1206×2622 px  │ Current iOS 26 simulators output this    │
  │ 13" iPad       │ 2064×2752 px  │ Required if app supports iPad            │
  └────────────────┴───────────────┴──────────────────────────────────────────┘
  · Format: PNG or JPEG, max 10 screenshots per slot
  · Apple auto-scales to all smaller device sizes

  Google Play Store
  ─────────────────
  ┌────────────────┬───────────────┬──────────────────────────────────────────┐
  │ Device         │ Min size      │ Notes                                    │
  ├────────────────┼───────────────┼──────────────────────────────────────────┤
  │ Phone          │ 1080×1920 px  │ At least 2 required                      │
  │ Tablet         │ 1080 short    │ At least 4 required                      │
  │                │ edge min      │                                          │
  └────────────────┴───────────────┴──────────────────────────────────────────┘
  · Format: PNG or JPEG (no alpha), max 8 MB, max 8 screenshots per type


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  "maestro: command not found"
  ·  Fix: source ~/.zshrc  (or open a new terminal tab)
  ·  Verify: maestro --version

  "No simulator build found. Run screenshots:1:build first."
  ·  ios/simulator-build/ is missing — run yarn screenshots:1:build

  "asc-api-key.json not found"
  ·  Create the file as described in ONE-TIME SETUP above
  ·  The key must have App Manager role (Developer role cannot upload screenshots)

  "App Store Connect API key JSON is missing field(s): key"
  ·  The "key" field must contain the .p8 file contents as a string
  ·  Replace real newlines with \n when pasting into the JSON

  "The API key in use does not allow this request"
  ·  Your API key has Developer role — regenerate with App Manager role

  "Could not find gem 'fastlane'" or version mismatch
  ·  Run: bundle install

  Maestro runs on wrong simulator (multiple simulators booted)
  ·  The capture script targets each device by UDID — ensure device names
     in scripts/capture-screenshots.sh match exactly what Xcode reports:
       xcrun simctl list devices available

  Screenshots land in wrong App Store display slot
  ·  App Store slot is determined by image dimensions, not filename
  ·  iOS 26 simulators output 1206×2622 → 6.3" slot
  ·  For 6.9" slot: use iOS 18 + iPhone 16 Pro Max simulator (1320×2868)
  ·  Download iOS 18 runtime: Xcode → Settings → Platforms → +


╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
  Last updated: March 2026
