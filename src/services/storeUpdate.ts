import { Linking, Platform } from 'react-native';
import type SpInAppUpdatesType from 'sp-react-native-in-app-updates';
import type { StartUpdateOptions } from 'sp-react-native-in-app-updates';
import { IOS_PRODUCTION_BUNDLE_ID, STORE_URL } from '../constants/appUpdate';

export type StoreCheckResult = {
  updateAvailable: boolean;
  latestVersion?: string;
};

// IAUUpdateKind.IMMEDIATE from the library; inlined so we never touch the
// library's exports outside the guarded require below.
const IMMEDIATE_UPDATE = 1;

// Required lazily, never imported at module top level: the library pulls in
// react-native-device-info, which THROWS at import time when its native module
// is missing. Binaries built before these native modules were added (the
// current production build, runtimeVersion 1.0.0) can still receive this JS via
// OTA — a top-level import would crash the whole app on launch there. With the
// guard, those builds just skip the store check; OTA prompts keep working.
let instance: SpInAppUpdatesType | null | undefined;
const getInAppUpdates = (): SpInAppUpdatesType | null => {
  if (instance === undefined) {
    try {
      const mod = require('sp-react-native-in-app-updates');
      const SpInAppUpdates: typeof SpInAppUpdatesType = mod.default ?? mod;
      // isDebug=true logs to the native console; keep it tied to __DEV__.
      instance = new SpInAppUpdates(__DEV__);
    } catch {
      instance = null;
    }
  }
  return instance;
};

/**
 * Detects a newer native binary on the store.
 * iOS: iTunes Search API lookup compared against the installed binary's
 * version (read natively, not from package.json, which an OTA bundle can
 * change without changing the binary).
 * Android: Play Core, which reads the installed versionCode natively.
 */
export const checkStoreUpdate = async (): Promise<StoreCheckResult> => {
  const inAppUpdates = getInAppUpdates();
  if (!inAppUpdates) {
    return { updateAvailable: false };
  }
  try {
    const result = await inAppUpdates.checkNeedsUpdate(
      Platform.OS === 'ios'
        ? { bundleId: IOS_PRODUCTION_BUNDLE_ID }
        : undefined,
    );
    return {
      updateAvailable: Boolean(result?.shouldUpdate),
      // Play Core only reports the versionCode (e.g. 12), not a display
      // version, so only iOS gets a version badge.
      latestVersion:
        Platform.OS === 'ios' && result?.storeVersion
          ? String(result.storeVersion)
          : undefined,
    };
  } catch {
    // Store lookup is best-effort; never surface an update on failure.
    return { updateAvailable: false };
  }
};

/**
 * iOS: opens the App Store product page directly (the user already tapped the
 * banner, so the library's own confirm alert would ask twice).
 * Android: launches Play Core's immediate in-app update flow.
 */
export const startStoreUpdate = async (): Promise<void> => {
  if (Platform.OS === 'ios') {
    await Linking.openURL(STORE_URL);
    return;
  }
  const inAppUpdates = getInAppUpdates();
  if (!inAppUpdates) {
    return;
  }
  const options: StartUpdateOptions = { updateType: IMMEDIATE_UPDATE };
  await inAppUpdates.startUpdate(options);
};
