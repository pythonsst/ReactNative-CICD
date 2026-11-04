import { Platform } from 'react-native';

const pkg = require('../../package.json') as { version: string };

export const CURRENT_APP_VERSION = pkg.version;

export const APP_STORE_ID = '6791839989';
export const ANDROID_PACKAGE = 'com.snapbiodata.app';

export const STORE_URL =
  Platform.select({
    ios: `https://apps.apple.com/app/id${APP_STORE_ID}`,
    android: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`,
    default: '',
  }) ?? '';
