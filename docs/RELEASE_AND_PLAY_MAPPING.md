# Release flow: EAS profiles → Android → Google Play

This document is the **source of truth** for how we map **development**, **staging**, and **production** from the repo to Expo EAS and the Play Store.

## Rule

Use the **same EAS profile name** for build and submit so each binary goes to the intended store destination:

```bash
eas build  --platform android --profile <profile>
eas submit --platform android --latest --profile <profile>
```

Profile is always one of: `development` | `staging` | `production`.

## Android: EAS → Gradle → Play

| EAS profile | Android product flavor | Gradle bundle task (release) | Play API track (`eas.json` submit) | `releaseStatus` (Android submit) | Where it appears in Play Console |
|-------------|--------------------------|--------------------------------|-------------------------------------|-------------------------------------|----------------------------------|
| **development** | `development` | `:app:bundleDevelopmentRelease` | `internal` | `draft` | **Testing → Internal testing** |
| **staging** | `staging` | `:app:bundleStagingRelease` | `beta` | `draft` | **Testing → Open testing** (Beta track) |
| **production** | `production` | `:app:bundleProductionRelease` | `production` | `completed` | **Release → Production** |

- **`releaseStatus`**: `draft` avoids Play blocking uploads while store listing or policy steps are incomplete; switch to `completed` for production when the listing is fully ready (see `eas.json`).

## Yarn shortcuts

| Action | Development | Staging | Production |
|--------|-------------|---------|------------|
| Android build | `yarn eas:build:android:development` | `yarn eas:build:android:staging` | `yarn eas:build:android:production` |
| Android submit (latest build) | `yarn eas:submit:android:development` | `yarn eas:submit:android:staging` | `yarn eas:submit:android:production` |

## iOS (same three environments)

Scheme files live under `ios/ReactNativeIgniteKit.xcodeproj/xcshareddata/xcschemes/`:

| File | Scheme name (used by EAS & CLI) |
|------|--------------------------------|
| `ReactNativeCICD development.xcscheme` | `ReactNativeCICD development` |
| `ReactNativeCICD staging.xcscheme` | `ReactNativeCICD staging` |
| `ReactNativeCICD production.xcscheme` | `ReactNativeCICD production` |

| EAS profile | `eas.json` `ios.scheme` | Typical destination |
|-------------|-------------------------|---------------------|
| development | `ReactNativeCICD development` | TestFlight internal |
| staging | `ReactNativeCICD staging` | TestFlight external / beta |
| production | `ReactNativeCICD production` | App Store |

Xcode **targets** are `ReactNativeIgniteKit development` / `staging` / `production`, matching the Android flavor names. The **scheme** names use the `ReactNativeCICD` prefix for clarity in open-source docs; the middle word matches Android: **development** / **staging** / **production**.

Set real `ascAppId` values in `eas.json` under each submit profile when ready.

## GitHub Actions

Workflows that take a **profile** input (`development` | `staging` | `production`) use the same names so **build + submit** stay aligned with this table.

## Credentials

- **Signing (AAB/APK):** EAS **Android upload keystore** (Expo project credentials).
- **Upload to Play:** **Google service account** JSON configured in Expo for **EAS Submit** (not the FCM key).
- **Play Console:** That service account must be a user on the app with permission to create releases.

## Related files

- `eas.json` — `build.*` and `submit.*` profiles (Gradle commands, tracks, `releaseStatus`).
- `android/app/build.gradle` — product flavors and `applicationId`.
- `docs/EAS.md` — broader EAS CLI and OTA notes.
