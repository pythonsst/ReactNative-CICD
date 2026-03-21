This is a [**React Native**](https://reactnative.dev) project bootstrapped with [`@react-native-community/cli`](https://github.com/react-native-community/cli). It includes a production-ready CI/CD pipeline with **EAS Build**, **EAS Submit**, and **EAS Update** (OTA) support.

---

# CI/CD — EAS Build · Submit · OTA

This project ships with full [Expo Application Services (EAS)](https://expo.dev/eas) support for building, submitting, and delivering over-the-air updates to three environments: **development**, **staging**, and **production**.

## Quick start

```bash
# 1. Install EAS CLI (one-time global install)
npm install -g eas-cli

# 2. Log in and link the project to your Expo account
eas login
eas init

# 3. Add EXPO_TOKEN to your GitHub repo secrets
#    expo.dev → Account Settings → Access Tokens → Create Token
#    GitHub → repo Settings → Secrets and variables → Actions → New secret

# 4. You're ready — trigger a build from the Actions tab or locally:
yarn eas:build:staging        # build both platforms, staging
yarn eas:build:safe:staging   # same, but checks version consistency first
yarn eas:update:staging       # OTA update (JS changes only, no new build)
```

For the complete guide including setup checklist, environment table, release flow, Android flavor mapping, and troubleshooting, run:

```bash
yarn eas:help
# or open: docs/EAS.md
```

## GitHub Actions workflows

| Workflow | Trigger | What it does |
|---|---|---|
| `eas-build-submit.yml` | Manual | Build + submit in one run (recommended for releases) |
| `eas-build.yml` | Manual | Build only |
| `eas-submit.yml` | Manual | Submit the latest build |
| `eas-update.yml` | Manual | Push an OTA update (no build needed) |
| `ci.yml` | Pull request | Run tests + lint on every PR |

## Environment → Android flavor mapping

| EAS profile | Android Gradle task | iOS Xcode scheme |
|---|---|---|
| `development` | `bundleDevelopmentRelease` | `ReactNativeCICD development` |
| `staging` | `bundleStagingRelease` | `ReactNativeCICD staging` |
| `production` | `bundleProductionRelease` | `ReactNativeCICD production` |

**Naming:** The three environments are always **`development`**, **`staging`**, **`production`** (EAS profile = Android flavor = env file). iOS schemes are prefixed **`ReactNativeCICD `** so they read clearly in Xcode; Android flavors stay short for Gradle. Same `applicationId` on Android across flavors.

---

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
