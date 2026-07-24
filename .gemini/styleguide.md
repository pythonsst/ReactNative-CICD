# SnapBiodata — review style guide

Gemini Code Assist: review PRs against the conventions below. Focus on
correctness, then simplicity and consistency. Keep feedback concise and
actionable; skip subjective style nits already handled by ESLint/Prettier.

## Stack
- React Native 0.81 (New Architecture / bridgeless) + Expo 54 modules, TypeScript, Yarn.
- Builds/submits via **EAS** (`yarn eas:build:*`, `yarn eas:submit:*`); Fastlane is only for App Store screenshots/metadata.
- Fully **offline, on-device** app — no backend, no accounts. Flag any code that adds network calls or remote data dependencies for the core flow.

## Architecture (keep these invariants)
- The biodata field schema in `src/data/biodata.ts` is the single source of truth for the form, the native preview, and the PDF. New fields go there, not hard-coded in screens.
- The on-screen preview is rendered **natively** (`src/components/BiodataDocument.tsx`). HTML (`src/templates/html.ts`) is used **only** for the expo-print PDF. The app ships **zero WebViews** — flag any reintroduction of `react-native-webview` in app code.
- Safe-area insets are provided statically via `SafeAreaInsetsContext` in `App.tsx` (NOT `<SafeAreaProvider>`, which crashes on launch under the new architecture). Do not reintroduce `SafeAreaProvider`.
- Drafts persist to AsyncStorage on **navigation**, not per keystroke (avoids a read-modify-write race). Preserve that.

## Conventions
- TypeScript: no `any`; type component props explicitly.
- Styling: use `StyleSheet.create`; avoid inline style object literals in JSX (ESLint `react-native/no-inline-styles`). Pass dynamic values as variables.
- Responsive: screens cap content to `MAX_CONTENT_WIDTH` (`src/theme.ts`) and center it so layouts read well on iPad.
- Accessibility: interactive elements need `accessibilityRole` and `accessibilityLabel`.
- npm scripts follow `<action>:<profile>:<platform>` with colons (e.g. `eas:build:ios:production`), plus short aliases like `dev`/`staging`/`prod`.

## Flag as issues
- New network/backend dependency in the core biodata flow.
- Reintroducing WebView or `SafeAreaProvider`.
- Secrets committed (e.g. `*.p8`, `.asc.env`, keystores) — these must stay gitignored.
- Blocking the JS thread, or per-keystroke storage writes.
- Missing error handling around `expo-print` / `expo-image-picker` / AsyncStorage calls.
