import { Platform } from 'react-native';

export const APP_STORE_ID = '6791839989';
export const ANDROID_PACKAGE = 'com.snapbiodata.app';
// The App Store listing is always under the production bundle ID, even when
// this code is running inside a dev/staging build (com.snapbiodata.app.dev,
// .staging, …) whose bundle ID has no App Store entry of its own.
export const IOS_PRODUCTION_BUNDLE_ID = 'com.snapbiodata.app';

export const STORE_URL =
  Platform.select({
    ios: `https://apps.apple.com/app/id${APP_STORE_ID}`,
    android: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`,
    default: '',
  }) ?? '';
