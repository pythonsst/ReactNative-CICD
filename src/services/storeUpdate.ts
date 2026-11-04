import { Platform } from 'react-native';
import SpInAppUpdates, {
  IAUUpdateKind,
  type StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import { CURRENT_APP_VERSION } from '../constants/appUpdate';

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
 * iOS: iTunes Search API lookup compared against curVersion.
 * Android: Play Core, which reads the installed versionCode natively.
 */
export const checkStoreUpdate = async (): Promise<StoreCheckResult> => {
  const inAppUpdates = getInAppUpdates();
  if (!inAppUpdates) {
    return { updateAvailable: false };
  }
  try {
    const result = await inAppUpdates.checkNeedsUpdate({
      curVersion: CURRENT_APP_VERSION,
    });
    return {
      updateAvailable: Boolean(result?.shouldUpdate),
      latestVersion: result?.storeVersion
        ? String(result.storeVersion)
        : undefined,
    };
  } catch {
    // Store lookup is best-effort; never surface an update on failure.
    return { updateAvailable: false };
  }
};

/**
 * iOS: alert prompting the user, then opens the App Store product page.
 * Android: launches Play Core's immediate in-app update flow.
 */
export const startStoreUpdate = async (): Promise<void> => {
  const inAppUpdates = getInAppUpdates();
  if (!inAppUpdates) {
    return;
  }
  const options: StartUpdateOptions =
    Platform.OS === 'android' ? { updateType: IAUUpdateKind.IMMEDIATE } : {};
  await inAppUpdates.startUpdate(options);
};
