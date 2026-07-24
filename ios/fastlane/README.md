fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios screenshots

```sh
[bundle exec] fastlane ios screenshots
```

Upload App Store screenshots from fastlane/screenshots (no binary, no metadata)

### ios metadata

```sh
[bundle exec] fastlane ios metadata
```

Upload App Store text metadata from fastlane/metadata (no binary, no screenshots)

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Build a release archive and push it to TestFlight (EAS is the usual path)

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
