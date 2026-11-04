import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, DevSettings, type AppStateStatus } from 'react-native';
import * as Updates from 'expo-updates';
import {
  checkStoreUpdate,
  startStoreUpdate,
  type StoreCheckResult,
} from '../services/storeUpdate';
// Avoid re-checking on every foreground bounce or Home remount.
const CHECK_THROTTLE_MS = 60_000;

// Module-level so the throttle and last store result survive a remount of the
// prompt (e.g. a fast refresh in dev).
let lastCheckAt = 0;
let lastStoreResult: StoreCheckResult = { updateAvailable: false };

// ── Dev-only preview ─────────────────────────────────────────────────────────
// Debug builds never hit a real update (OTA is disabled, store version equals
// the installed one), so the dev menu (Cmd+D / shake) gets items that force
// each prompt to check the UI. All of it is dead code in release builds.
export type DevUpdatePreview = 'store' | 'ota' | 'both' | null;
let devPreview: DevUpdatePreview = null;
let devPreviewKey = 0;
const devListeners = new Set<() => void>();
const setDevPreview = (next: DevUpdatePreview) => {
  devPreview = next;
  devPreviewKey += 1;
  devListeners.forEach(l => l());
};
if (__DEV__) {
  DevSettings.addMenuItem('Preview update prompt: Store', () =>
    setDevPreview('store'),
  );
  DevSettings.addMenuItem('Preview update prompt: OTA', () =>
    setDevPreview('ota'),
  );
  // Store first, then OTA after "Later" — the real sequencing.
  DevSettings.addMenuItem('Preview update prompt: Store + OTA', () =>
    setDevPreview('both'),
  );
}

export type AppUpdateStatus = {
  // A newer native build is live on the store.
  storeUpdateAvailable: boolean;
  // An OTA bundle is downloaded and will apply on restart.
  otaReady: boolean;
  isChecking: boolean;
  latestStoreVersion?: string;
  checkNow: () => Promise<void>;
  applyOta: () => Promise<void>;
  goToStore: () => Promise<void>;
  // Changes each time a dev preview is triggered (always 0 in release).
  devPreviewKey: number;
};

export const useAppUpdates = (): AppUpdateStatus => {
  const { isUpdatePending } = Updates.useUpdates();

  const [storeUpdateAvailable, setStoreUpdateAvailable] = useState(
    lastStoreResult.updateAvailable,
  );
  const [latestStoreVersion, setLatestStoreVersion] = useState(
    lastStoreResult.latestVersion,
  );
  const [isChecking, setIsChecking] = useState(false);

  const inFlightRef = useRef(false);

  const [, forceRender] = useState(0);
  useEffect(() => {
    if (!__DEV__) {return;}
    const l = () => forceRender(n => n + 1);
    devListeners.add(l);
    return () => {
      devListeners.delete(l);
    };
  }, []);

  const checkNow = useCallback(async () => {
    if (inFlightRef.current) {return;}
    inFlightRef.current = true;
    setIsChecking(true);
    try {
      // Check AND download: checkForUpdateAsync only reports that an OTA
      // exists. Without the fetch, an OTA published while the app is open
      // would never become "ready" until the next cold start. Once fetched,
      // useUpdates() flips isUpdatePending and the restart prompt shows.
      const otaCheck = Updates.isEnabled
        ? Updates.checkForUpdateAsync()
            .then(r => (r.isAvailable ? Updates.fetchUpdateAsync() : null))
            .catch(() => null)
        : Promise.resolve(null);

      const [, store] = await Promise.all([otaCheck, checkStoreUpdate()]);

      lastStoreResult = store;
      setStoreUpdateAvailable(store.updateAvailable);
      setLatestStoreVersion(store.latestVersion);
      lastCheckAt = Date.now();
    } finally {
      inFlightRef.current = false;
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    const isStale = () => Date.now() - lastCheckAt > CHECK_THROTTLE_MS;
    if (isStale()) {
      checkNow();
    }
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'active' && isStale()) {
        checkNow();
      }
    });
    return () => sub.remove();
  }, [checkNow]);

  const applyOta = useCallback(async () => {
    if (__DEV__ && devPreview) {
      DevSettings.reload();
      return;
    }
    if (!Updates.isEnabled) {return;}
    try {
      await Updates.reloadAsync();
    } catch {
      // Fire-and-forget from a press handler; a failed reload must not reject.
    }
  }, []);

  const goToStore = useCallback(async () => {
    try {
      await startStoreUpdate();
    } catch {
      // The store flow is best-effort; swallow to avoid an unhandled rejection.
    }
  }, []);

  const preview = __DEV__ ? devPreview : null;

  return {
    storeUpdateAvailable: preview
      ? preview !== 'ota'
      : storeUpdateAvailable,
    otaReady: preview ? preview !== 'store' : isUpdatePending,
    isChecking,
    latestStoreVersion: preview ? '1.1.0' : latestStoreVersion,
    checkNow,
    applyOta,
    goToStore,
    devPreviewKey,
  };
};
