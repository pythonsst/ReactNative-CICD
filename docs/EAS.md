╭─────────────────────────────────────────────────────────────────────────────╮
│  EAS — Build · Submit · Update (OTA)                                        │
│  ReactNativeIgniteKit  ·  Complete reference guide                          │
╰─────────────────────────────────────────────────────────────────────────────╯

  Quick help in terminal:  yarn eas:help

  Full matrix (EAS → Android flavor → Play track):  docs/RELEASE_AND_PLAY_MAPPING.md


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ONE-TIME SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Step 1 — Install EAS CLI
  ────────────────────────
  npm install -g eas-cli
  eas --version          # verify: must be >= 16.32.0

  Step 2 — Login to Expo
  ──────────────────────
  eas login
  eas whoami             # confirm you're authenticated

  Step 3 — Link the project
  ─────────────────────────
  eas init               # auto-populates owner + projectId in app.config.js

  Step 4 — Update placeholders in app.config.js
  ─────────────────────────────────────────────
  After `eas init` the following are filled in automatically:
    owner      →  your Expo account username
    projectId  →  your EAS project UUID
    updates.url

  Step 5 — Update eas.json with your App Store App ID
  ────────────────────────────────────────────────────
  Find your numeric App Store App ID in App Store Connect → App Information.
  Replace every "YOUR_APP_STORE_APP_ID" in eas.json with that number.
  (Android tracks are pre-configured; no changes needed there.)

  Step 6 — Configure local signing (for local/Fastlane builds only)
  ─────────────────────────────────────────────────────────────────
  cp .env.signing.example .env.signing
  # Fill in your keystore path and passwords.
  # EAS Build manages signing automatically — this file is only needed for
  # local Gradle / Fastlane builds.

  Step 7 — Add GitHub Secret
  ──────────────────────────
  Go to: GitHub repo → Settings → Secrets and variables → Actions → New secret

  ┌─────────────────┬────────────────────────────────────────────────────────┐
  │ Secret name     │ Where to get it                                        │
  ├─────────────────┼────────────────────────────────────────────────────────┤
  │ EXPO_TOKEN      │ expo.dev → Account Settings → Access Tokens → Create  │
  └─────────────────┴────────────────────────────────────────────────────────┘

  Step 8 — Verify setup
  ─────────────────────
  yarn eas:version:get   # confirm versions are consistent
  eas build:list         # should return your project's build history (even if empty)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ENVIRONMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ┌──────────────┬──────────────────────┬────────────────────┬──────────────┐
  │              │  development         │  staging           │  production  │
  ├──────────────┼──────────────────────┼────────────────────┼──────────────┤
  │ Android      │  Internal testing    │  Open / beta       │  Production  │
  │ Play submit  │  track: internal     │  track: beta       │  track: prod. │
  │ Play Console │  Testing → Internal  │  Testing → Open    │  Release →   │
  │              │  testing             │  testing (Beta)    │  Production  │
  │ iOS          │  TestFlight internal │  TestFlight ext.   │  App Store   │
  │ OTA channel  │  development         │  staging           │  production  │
  │ iOS scheme   │  ReactNativeCICD     │  ReactNativeCICD   │  ReactNativeCICD │
  │              │  development         │  staging           │  production    │
  │ Android task │  bundleDevelopment…  │  bundleStaging…    │  bundleProduction… │
  │ Audience     │  Dev team            │  QA / stakeholders │  Everyone    │
  └──────────────┴──────────────────────┴────────────────────┴──────────────┘

  EAS build profile and EAS submit profile use the SAME name (development | staging | production).
  Example:  eas build --profile staging  →  eas submit --profile staging

  ⚠️  Android flavors
      Three product flavors: development, staging, production (same applicationId).

  Each environment bakes its OTA channel into the binary at build time.
  An update pushed to "staging" will NEVER reach development or production.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  OTA UPDATE OR NEW BUILD?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Rule: if Metro can bundle it, an OTA update is enough.

  JS / TypeScript code changes    →  OTA ✓
  Images, fonts, JSON assets      →  OTA ✓
  New JS-only dependency          →  OTA ✓
  New native (Kotlin/Swift) code  →  New build required
  New native dependency           →  New build required
  New / changed permissions       →  New build required
  runtimeVersion bump             →  New build required


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  LOCAL COMMANDS (yarn scripts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  VERSION CHECK
  ─────────────
  yarn eas:version:get          show versions: package.json · gradle · pbxproj
  yarn eas:version:check        exit 1 if any mismatch (used by safe-build)

  BUILD
  ─────
  yarn eas:build                all platforms, production
  yarn eas:build:development    all platforms, development
  yarn eas:build:staging        all platforms, staging
  yarn eas:build:production     all platforms, production

  yarn eas:build:android:staging   Android only, staging
  yarn eas:build:ios:staging       iOS only, staging

  Safe build (version check first — recommended):
  yarn eas:build:safe:staging

  SUBMIT  (run after build completes)
  ─────
  yarn eas:submit:development
  yarn eas:submit:staging
  yarn eas:submit:production

  Submit a specific build ID (if --latest picks the wrong one):
  eas build:list --platform android --profile staging --limit 3
  eas submit --id <build-id> --profile staging --platform android

  OTA UPDATE
  ──────────
  yarn eas:update:development   push update to dev channel
  yarn eas:update:staging       push update to staging channel
  yarn eas:update:production    push update to production channel

  Custom message:
  MESSAGE="Fix login crash" yarn eas:update:staging


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  GITHUB ACTIONS WORKFLOWS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  All four workflows are triggered manually from the Actions tab.

  ┌───────────────────────────┬──────────────────────────────────────────────┐
  │ Workflow file             │ What it does                                 │
  ├───────────────────────────┼──────────────────────────────────────────────┤
  │ eas-build-submit.yml      │ Build + submit in one run  (recommended)     │
  │ eas-build.yml             │ Build only                                   │
  │ eas-submit.yml            │ Submit the latest build                      │
  │ eas-update.yml            │ OTA update — no build required               │
  └───────────────────────────┴──────────────────────────────────────────────┘

  Required GitHub secret:
  ┌─────────────────┬────────────────────────────────────────────────────────┐
  │ EXPO_TOKEN      │ expo.dev → Account Settings → Access Tokens → Create  │
  └─────────────────┴────────────────────────────────────────────────────────┘

  Concurrency: duplicate runs for the same profile are cancelled automatically.
  For eas-build-submit.yml, a running release is never cancelled — it finishes.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  RELEASE FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ① development  ──►  build + submit  ──►  Internal testing   (dev team)
          │
          ▼  (QA sign-off)
  ② staging      ──►  build + submit  ──►  Open / beta        (QA, stakeholders)
          │
          ▼  (stakeholder sign-off)
  ③ production   ──►  build + submit  ──►  Play Store / App Store  (everyone)

  JS-only change at any stage?  Skip the build — just run eas:update:<env>.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  "Project not found" / "You must be logged in"
  ·  Run:  eas login && eas init
  ·  Confirm app.config.js has the correct owner and projectId

  "APKs are not allowed" on Play Store
  ·  Play Store requires .aab — all EAS profiles use distribution: "store"
     which produces AAB automatically.
  ·  If you submitted an old .apk, build a fresh one:
       yarn eas:build:android:staging
  ·  Then submit:  eas submit --id <new-id> --profile staging --platform android

  "Scheme not found" on iOS build
  ·  Confirm the scheme exists in Xcode: Product → Scheme → Manage Schemes
  ·  Scheme names must match eas.json exactly (quotes if spaces):
       "ReactNativeCICD development" / "ReactNativeCICD staging" / "ReactNativeCICD production"

  ".env.signing file is missing" on local build
  ·  Copy .env.signing.example → .env.signing and fill in your keystore values
  ·  EAS builds skip this check automatically (EAS manages signing)

  OTA update deployed but users not receiving it
  ·  Verify channel is linked to the correct branch:
       eas channel:edit staging --branch staging
  ·  Confirm runtimeVersion in the installed app matches the update
  ·  Check: eas update:list --branch staging

  EXPO_TOKEN expired in GitHub Actions
  ·  Regenerate at expo.dev → Account Settings → Access Tokens
  ·  Update the EXPO_TOKEN secret in GitHub repo → Settings → Secrets

  Version mismatch reported by yarn eas:version:get
  ·  Align all three sources before the next build:
       package.json  →  "version": "x.y.z"
       android/app/build.gradle  →  versionName "x.y.z"
       ios/ReactNativeIgniteKit.xcodeproj  →  MARKETING_VERSION = x.y.z


╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
  Last updated: March 2026
