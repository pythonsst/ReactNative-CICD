fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android test

```sh
[bundle exec] fastlane android test
```

🧪 Run unit tests

### android development_internal

```sh
[bundle exec] fastlane android development_internal
```

🚀 Deploy DEVELOPMENT flavor to Internal Testing

### android sit_beta

```sh
[bundle exec] fastlane android sit_beta
```

🧪 Deploy SIT flavor to Open Testing (Beta)

### android uat_closed

```sh
[bundle exec] fastlane android uat_closed
```

🔒 Deploy UAT flavor to Closed Testing

### android production_release

```sh
[bundle exec] fastlane android production_release
```

🏁 Deploy PRODUCTION flavor to Production

## Play Store service account (required for deploy)

Fastlane uploads need a Google Play service account JSON key. Create it once in Google Play Console:

1) Go to Play Console → Setup → API access  
2) Link a Google Cloud project (or create one)  
3) Create a Service Account and grant appropriate permissions  
4) Create a JSON key and download it  

Then set these env vars (example in `android/fastlane/.env.example`):

- `ANDROID_PLAY_STORE_JSON_KEY_PATH` (path to the JSON file)
- `ANDROID_PACKAGE_NAME` (your app id, e.g. `com.example.app`)

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
