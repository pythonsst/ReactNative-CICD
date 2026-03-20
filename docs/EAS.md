╭─────────────────────────────────────────────────────────────────────────────╮
│  EAS — Build · Submit · OTA                                                 │
│  Complete guide for ReactNativeIgniteKit builds, submissions, and OTA       │
╰─────────────────────────────────────────────────────────────────────────────╯

  Quick terminal reference:  yarn eas:help


  SETUP (first time)
  ──────────────────
  1. Install EAS CLI:    npm install -g eas-cli
  2. Login:              eas login
  3. Link project:       eas init
     → This populates projectId in app.config.js and links to your Expo account

  4. Add GitHub secret:  EXPO_TOKEN  (from expo.dev → Access Tokens)
  5. Fill in eas.json:   Replace YOUR_APP_STORE_APP_ID with your App Store app ID


  ENVIRONMENTS
  ────────────
  development   →  Internal testing   (dev team, no review delay)
  staging       →  Closed/alpha       (QA, stakeholders, invite-only)
  production    →  Production         (public — Play Store / App Store)

  Each environment has its own OTA channel baked in at build time.
  Pushing an update to staging NEVER reaches development or production.

  ┌──────────────┬──────────────────────┬────────────────────┬──────────────┐
  │              │  development         │  staging           │  production  │
  ├──────────────┼──────────────────────┼────────────────────┼──────────────┤
  │ Android      │  Internal testing    │  Closed testing    │  Production  │
  │ iOS          │  TestFlight internal │  TestFlight ext.   │  App Store   │
  │ OTA channel  │  development         │  staging           │  production  │
  │ iOS scheme   │  ReactNativeIgniteKit dev  │  ReactNativeIgniteKit stag  │  ReactNativeIgniteKit prod  │
  │ Audience     │  Build team          │  Invite-only       │  Everyone    │
  └──────────────┴──────────────────────┴────────────────────┴──────────────┘


  OTA UPDATE OR NEW BUILD?
  ────────────────────────
  Rule of thumb: if Metro can bundle it, an OTA update is enough.

  JS / React Native code    →  OTA ✓
  Images, fonts, assets     →  OTA ✓
  Expo config (icons, etc.) →  OTA ✓
  New native dependency     →  New build
  New / changed permissions →  New build
  runtimeVersion bump       →  New build
  Java / Kotlin / Swift     →  New build


  OTA UPDATE  (no build, no store submission)
  ───────────────────────────────────────────
  yarn eas:update:development     dev team only
  yarn eas:update:staging         QA / stakeholders only
  yarn eas:update:production      public users only

  Custom message:
  MESSAGE="Fix login crash" yarn eas:update:staging

  Users receive the update automatically on next app open.


  BUILD
  ─────
  yarn eas:build:development      all platforms, development
  yarn eas:build:staging          all platforms, staging
  yarn eas:build:production       all platforms, production

  yarn eas:build:android:staging  Android only
  yarn eas:build:ios:staging      iOS only

  Safe build (checks version consistency first):
  yarn eas:build:safe:staging


  SUBMIT  (after build completes)
  ────────────────────────────────
  yarn eas:submit:development
  yarn eas:submit:staging
  yarn eas:submit:production

  Submit a specific build (when --latest picks the wrong one):
  eas build:list --platform android --profile staging --limit 1
  eas submit --id <build-id> --profile staging --platform android


  DEFAULTS  (all → production)
  ─────────────────────────────
  yarn eas:build    all platforms, production
  yarn eas:submit   all platforms, production
  yarn eas:update   production channel


  RELEASE FLOW
  ────────────

  ① development  ──►  build + submit  ──►  Internal testing   (dev team)
          │
          ▼
  ② staging      ──►  build + submit  ──►  Closed testing     (QA, stakeholders)
          │
          ▼
  ③ production   ──►  build + submit  ──►  Play Store / App Store  (public)

  JS-only change on any environment → skip the build, just run eas:update:<env>


  GITHUB ACTIONS
  ──────────────
  Three workflows are available under .github/workflows/:

  eas-build.yml   →  Trigger EAS Build (choose profile + platform)
  eas-submit.yml  →  Trigger EAS Submit (choose profile + platform)
  eas-update.yml  →  Trigger EAS Update / OTA (choose channel + message)

  Required GitHub secret:
  EXPO_TOKEN  →  Generate at expo.dev → Account Settings → Access Tokens


  VERSION CHECK
  ─────────────
  yarn eas:version:get    — show versions across package.json, Android gradle, iOS pbxproj
  yarn eas:version:check  — exit 1 if any mismatch (used by eas:build:safe)


  TROUBLESHOOTING
  ───────────────

  "APKs are not allowed" on Play Store
  ·  You submitted an .apk — Play Store requires .aab for all tracks.
  ·  Fix: build fresh with  yarn eas:build:android:staging
  ·  Confirm the artifact URL ends in .aab (not .apk)
  ·  Submit:  eas submit --id <new-build-id> --profile staging --platform android
  ·  All profiles use distribution: "store" and produce AAB.

  iOS OTA update not applying
  ·  Re-link channel:  eas channel:edit production --branch production
  ·  Verify runtimeVersion matches what was built

  "Project not found" or EAS login errors
  ·  Run  eas login  and  eas init  to link the project
  ·  Make sure EXPO_TOKEN secret is set in GitHub repo settings


╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
  Last updated: March 2026
