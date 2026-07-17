# SnapBiodata — React Native + EAS CI/CD Starter

A production-ready [React Native](https://reactnative.dev) app (bare workflow, RN 0.81 / React 19) wired up with **three build flavors** and a full **EAS (Expo Application Services)** pipeline for building, submitting to the stores, and shipping over-the-air (OTA) updates.

This README explains **how the flavors and EAS are set up** so you can build and ship any environment with a single command.

> 📖 For the complete, step-by-step reference (one-time setup, troubleshooting, release flow) see **[`docs/EAS.md`](docs/EAS.md)** or run `yarn eas:help`.

---

## Table of contents

- [The three environments (flavors)](#the-three-environments-flavors)
- [How a flavor is defined on each platform](#how-a-flavor-is-defined-on-each-platform)
- [Environment config (`.env` files)](#environment-config-env-files)
- [Running locally](#running-locally)
- [EAS: build, submit, update](#eas-build-submit-update)
- [OTA update vs. new build](#ota-update-vs-new-build)
- [CI/CD (GitHub Actions)](#cicd-github-actions)
- [One-time setup](#one-time-setup)

---

## The three environments (flavors)

Every build belongs to one of three environments. Each one is fully isolated — its own app ID, its own OTA channel, its own store track — so `development`, `staging`, and `production` can all be installed **side-by-side on the same device** without clashing.

| | **development** | **staging** | **production** |
|---|---|---|---|
| Android applicationId | `com.snapbiodata.app.development` | `com.snapbiodata.app.staging` | `com.snapbiodata.app` |
| iOS bundle identifier | `com.snapbiodata.app.development` | `com.snapbiodata.app.staging` | `com.snapbiodata.app` |
| API URL | `dev.snapbiodata.com` | `staging.snapbiodata.com` | `snapbiodata.com` |
| OTA channel | `development` | `staging` | `production` |
| iOS scheme | `development` | `staging` | `production` |
| Android task | `bundleDevelopmentRelease` | `bundleStagingRelease` | `bundleProductionRelease` |
| Play Store track | `internal` | `alpha` | `production` |
| iOS distribution | TestFlight (internal) | TestFlight (external) | App Store |
| Audience | Dev team | QA / stakeholders | Everyone |

> An OTA update pushed to `staging` will **never** reach `development` or `production` — each binary bakes its channel in at build time.

---

## How a flavor is defined on each platform

The same three environments are expressed in **four coordinated places**. The magic is that they all line up by name:

```
                  ┌─────────────────────────────────────────────┐
                  │              development / staging / production
                  └─────────────────────────────────────────────┘
                        │            │            │            │
            ┌───────────┘            │            │            └───────────┐
            ▼                        ▼            ▼                        ▼
   Android productFlavor      iOS scheme    EAS profile           .env.<environment>
   (android/app/build.gradle) (Xcode)       (eas.json)            (react-native-config)
```

- **Android** — three `productFlavors` in `android/app/build.gradle`. `production` keeps the real ID; `development` and `staging` add an `applicationIdSuffix` so they install alongside it.
- **iOS** — three shared schemes (`development`, `staging`, `production`) under `ios/*.xcodeproj/xcshareddata/xcschemes/`.
- **EAS** — three build/submit profiles in `eas.json`. Each profile points at the matching Android `gradleCommand` and iOS `scheme`, and carries the OTA `channel`.
- **Runtime config** — one `.env.<environment>` file per environment, read by [`react-native-config`](https://github.com/lugg/react-native-config).

Because the names match everywhere, choosing an environment is always just picking the profile name.

---

## Environment config (`.env` files)

Each environment has an env file at the repo root:

- `.env.development` → `ENV=development`, `API_URL=https://dev.snapbiodata.com`
- `.env.staging` → `ENV=staging`, `API_URL=https://staging.snapbiodata.com`
- `.env.production` → `ENV=production`, `API_URL=https://snapbiodata.com`

> ⚠️ **These values are PUBLIC.** `react-native-config` bakes them into the app binary, where anyone can extract them by reverse-engineering the app. Put **only non-secret** config here.
>
> Secrets live elsewhere:
> - Android signing keystore → `.env.signing` (gitignored, copy from `.env.signing.example`) or GitHub/EAS secrets
> - Play service account JSON → GitHub Actions secret
> - Expo / App Store tokens → EAS / GitHub secrets

---

## Running locally

Start Metro in one terminal:

```bash
yarn start
```

Then run any environment (each script sets `ENVFILE` and picks the right flavor/scheme automatically):

**Android**

```bash
yarn android:dev        # development debug
yarn android:staging    # staging debug
yarn android:prod       # production debug

yarn android:dev-release        # release variants
yarn android:staging-release
yarn android:prod-release
```

**iOS**

```bash
yarn ios:dev            # development scheme
yarn ios:staging        # staging scheme
yarn ios:prod           # production scheme

yarn ios:dev-release    # release configuration
yarn ios:staging-release
yarn ios:prod-release
```

---

## EAS: build, submit, update

All EAS commands are wrapped as `yarn` scripts. Every build first runs a version check (`yarn eas:version:check`) that fails fast if `package.json`, `build.gradle`, and the iOS project disagree on the version number.

**Build** (produces store-ready AAB / IPA on Expo's servers):

```bash
yarn eas:build:development       # all platforms, dev
yarn eas:build:staging           # all platforms, staging
yarn eas:build:production         # all platforms, production

yarn eas:build:android:staging   # single platform
yarn eas:build:ios:staging
```

**Submit** (uploads the latest build to the store, on the right track):

```bash
yarn eas:submit:development
yarn eas:submit:staging
yarn eas:submit:production
```

**OTA update** (push JS/asset changes instantly — no store review):

```bash
yarn eas:update:development
yarn eas:update:staging
yarn eas:update:production

# with a custom changelog message
MESSAGE="Fix login crash" yarn eas:update:staging
```

**Version helpers:**

```bash
yarn eas:version:get     # show version across package.json / gradle / pbxproj
yarn eas:version:check   # exit 1 if any of them mismatch
```

---

## OTA update vs. new build

> **Rule of thumb:** if Metro can bundle the change, an OTA update is enough.

| Change | Needs |
|---|---|
| JS / TypeScript code | ✅ OTA update |
| Images, fonts, JSON assets | ✅ OTA update |
| New JS-only dependency | ✅ OTA update |
| New native (Kotlin/Swift) code | 🔁 New build |
| New native dependency | 🔁 New build |
| New / changed permissions | 🔁 New build |
| `runtimeVersion` bump | 🔁 New build |

---

## CI/CD (GitHub Actions)

Workflows live in `.github/workflows/` and are triggered manually from the **Actions** tab (pick the environment/profile as an input):

| Workflow | What it does |
|---|---|
| `eas-build-submit.yml` | Build **and** submit in one run (recommended) |
| `eas-build.yml` | Build only |
| `eas-submit.yml` | Submit the latest build |
| `eas-update.yml` | Push an OTA update (no build) |
| `ci.yml` | Lint / typecheck / tests on push & PR |

**Required secret:** `EXPO_TOKEN` (create at expo.dev → Account Settings → Access Tokens, then add under repo Settings → Secrets → Actions).

Duplicate runs for the same profile are cancelled automatically; an in-flight release build is always allowed to finish.

---

## Release flow

```
① development  ──►  build + submit  ──►  Internal testing   (dev team)
        │
        ▼  (QA sign-off)
② staging      ──►  build + submit  ──►  Closed / alpha     (QA, stakeholders)
        │
        ▼  (stakeholder sign-off)
③ production   ──►  build + submit  ──►  Play Store / App Store  (everyone)
```

JS-only change at any stage? Skip the build — just run `yarn eas:update:<environment>`.

---

## One-time setup

Short version (full details in [`docs/EAS.md`](docs/EAS.md)):

1. `npm install -g eas-cli`
2. `eas login`
3. `eas init` — fills in `owner` + `projectId` in `app.config.js`
4. Put your numeric App Store App ID in `eas.json` (`ascAppId`)
5. Add the `EXPO_TOKEN` secret in GitHub
6. (Local signed builds only) `cp .env.signing.example .env.signing` and fill it in
7. Verify: `yarn eas:version:get` and `eas build:list`

---

## Learn more

- [`docs/EAS.md`](docs/EAS.md) — complete EAS reference & troubleshooting (`yarn eas:help`)
- [React Native docs](https://reactnative.dev)
- [EAS Build](https://docs.expo.dev/build/introduction/) · [EAS Submit](https://docs.expo.dev/submit/introduction/) · [EAS Update](https://docs.expo.dev/eas-update/introduction/)
