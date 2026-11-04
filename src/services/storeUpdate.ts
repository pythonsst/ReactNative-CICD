import { Linking, Platform } from 'react-native';
import SpInAppUpdates, {
  IAUUpdateKind,
  type StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import { STORE_URL } from '../constants/appUpdate';

export type StoreCheckResult = {
  updateAvailable: boolean;
  latestVersion?: string;
};

// Lazily constructed so an OTA bundle landing on a binary without the native
// module degrades gracefully (no store updates) instead of crashing at import.
let instance: SpInAppUpdates | null | undefined;
const getInAppUpdates = (): SpInAppUpdates | null => {
  if (instance === undefined) {
    try {
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
    const result = await inAppUpdates.checkNeedsUpdate();
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
  const options: StartUpdateOptions = { updateType: IAUUpdateKind.IMMEDIATE };
  await inAppUpdates.startUpdate(options);
};
