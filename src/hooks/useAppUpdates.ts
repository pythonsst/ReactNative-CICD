import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import * as Updates from 'expo-updates';
import { checkStoreUpdate, startStoreUpdate } from '../services/storeUpdate';
import {
  resolveUpdateState,
  shouldShowUpdate,
  type AppUpdateState,
} from './updateState';

// Avoid re-checking on every foreground bounce.
const CHECK_THROTTLE_MS = 60_000;

export type AppUpdateStatus = {
  state: AppUpdateState;
  isVisible: boolean;
  isChecking: boolean;
  latestStoreVersion?: string;
  checkNow: () => Promise<void>;
  applyOta: () => Promise<void>;
  goToStore: () => Promise<void>;
};

export const useAppUpdates = (): AppUpdateStatus => {
  const { isUpdateAvailable, isUpdatePending } = Updates.useUpdates();

  const [storeUpdateAvailable, setStoreUpdateAvailable] = useState(false);
  const [latestStoreVersion, setLatestStoreVersion] = useState<string>();
  const [isChecking, setIsChecking] = useState(false);

  const lastCheckRef = useRef(0);
  const inFlightRef = useRef(false);

  const checkNow = useCallback(async () => {
    if (inFlightRef.current) {return;}
    inFlightRef.current = true;
    setIsChecking(true);
    try {
      // Kick the OTA check (updates useUpdates() reactively); tolerate failure.
      const otaCheck = Updates.isEnabled
        ? Updates.checkForUpdateAsync().catch(() => null)
        : Promise.resolve(null);

      const [, store] = await Promise.all([otaCheck, checkStoreUpdate()]);

      setStoreUpdateAvailable(store.updateAvailable);
      setLatestStoreVersion(store.latestVersion);
      lastCheckRef.current = Date.now();
    } finally {
      inFlightRef.current = false;
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkNow();
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (
        next === 'active' &&
        Date.now() - lastCheckRef.current > CHECK_THROTTLE_MS
      ) {
        checkNow();
      }
    });
    return () => sub.remove();
  }, [checkNow]);

  const applyOta = useCallback(async () => {
    if (!Updates.isEnabled) {return;}
    try {
      if (!isUpdatePending) {
        await Updates.fetchUpdateAsync();
      }
      await Updates.reloadAsync();
    } catch {
      // Fire-and-forget from a press handler; a failed reload must not reject.
    }
  }, [isUpdatePending]);

  const goToStore = useCallback(async () => {
    try {
      await startStoreUpdate();
    } catch {
      // The store flow is best-effort; swallow to avoid an unhandled rejection.
    }
  }, []);

  const state = resolveUpdateState({
    storeUpdateAvailable,
    isOtaPending: isUpdatePending,
    isOtaAvailable: isUpdateAvailable,
  });

  return {
    state,
    isVisible: shouldShowUpdate(state),
    isChecking,
    latestStoreVersion,
    checkNow,
    applyOta,
    goToStore,
  };
};
