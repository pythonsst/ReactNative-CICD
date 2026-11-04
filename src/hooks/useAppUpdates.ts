import {useCallback, useEffect, useSyncExternalStore} from 'react';
import {AppState, DevSettings, type AppStateStatus} from 'react-native';
import * as Updates from 'expo-updates';
import {
  checkStoreUpdate,
  startStoreUpdate,
  type StoreCheckResult,
} from '../services/storeUpdate';

// Avoid re-checking on every foreground bounce or screen mount. A manual
// "Check for updates" (checkNow) ignores this.
const CHECK_THROTTLE_MS = 60_000;

// ── Shared state ─────────────────────────────────────────────────────────────
// One store for the whole app, so the root prompt, the Home gear dot and the
// Settings screen always agree: a check started on Settings updates them all.

export type DevUpdatePreview = 'store' | 'ota' | 'both' | null;

type Snapshot = {
  store: StoreCheckResult;
  isChecking: boolean;
  lastCheckAt: number; // 0 = never
  devPreview: DevUpdatePreview;
  devPreviewKey: number;
};

let snapshot: Snapshot = {
  store: {updateAvailable: false},
  isChecking: false,
  lastCheckAt: 0,
  devPreview: null,
  devPreviewKey: 0,
};
const listeners = new Set<() => void>();
const setSnapshot = (patch: Partial<Snapshot>) => {
  snapshot = {...snapshot, ...patch};
  listeners.forEach(l => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const getSnapshot = () => snapshot;

let inFlight = false;
const checkForUpdates = async (): Promise<void> => {
  if (inFlight) {
    return;
  }
  inFlight = true;
  setSnapshot({isChecking: true});
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
    setSnapshot({store, lastCheckAt: Date.now()});
  } finally {
    inFlight = false;
    setSnapshot({isChecking: false});
  }
};

// ── Dev-only preview ─────────────────────────────────────────────────────────
// Debug builds never hit a real update (OTA is disabled, store version equals
// the installed one), so the dev menu (Cmd+D / shake) gets items that force
// each state to check the UI. All of it is dead code in release builds.
const DEV_PREVIEW_STORE: StoreCheckResult = {
  updateAvailable: true,
  latestVersion: '1.1.0',
  releaseNotes: '• Three new biodata templates\n• Faster PDF export',
};
if (__DEV__) {
  const preview = (devPreview: DevUpdatePreview) =>
    setSnapshot({devPreview, devPreviewKey: snapshot.devPreviewKey + 1});
  DevSettings.addMenuItem('Preview update prompt: Store', () =>
    preview('store'),
  );
  DevSettings.addMenuItem('Preview update prompt: OTA', () => preview('ota'));
  // Store first, then OTA after "Later" — the real sequencing.
  DevSettings.addMenuItem('Preview update prompt: Store + OTA', () =>
    preview('both'),
  );
  DevSettings.addMenuItem('Preview update prompt: Off', () => preview(null));
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export type AppUpdateStatus = {
  // A newer native build is live on the store.
  storeUpdateAvailable: boolean;
  // An OTA bundle is downloaded and will apply on restart.
  otaReady: boolean;
  // An OTA bundle is downloading right now.
  otaDownloading: boolean;
  // Either of the above needs the user: drives the Home gear dot.
  hasUpdate: boolean;
  isChecking: boolean;
  lastCheckAt: number;
  latestStoreVersion?: string;
  releaseNotes?: string;
  checkNow: () => Promise<void>;
  applyOta: () => Promise<void>;
  goToStore: () => Promise<void>;
  // Changes each time a dev preview is triggered (always 0 in release).
  devPreviewKey: number;
};

export const useAppUpdates = (): AppUpdateStatus => {
  const {isUpdatePending, isDownloading} = Updates.useUpdates();
  const snap = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => {
    const isStale = () => Date.now() - snapshot.lastCheckAt > CHECK_THROTTLE_MS;
    if (isStale()) {
      checkForUpdates();
    }
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'active' && isStale()) {
        checkForUpdates();
      }
    });
    return () => sub.remove();
  }, []);

  const applyOta = useCallback(async () => {
    if (__DEV__ && snapshot.devPreview) {
      DevSettings.reload();
      return;
    }
    if (!Updates.isEnabled) {
      return;
    }
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

  const preview = __DEV__ ? snap.devPreview : null;
  const store = preview
    ? preview === 'ota'
      ? {updateAvailable: false}
      : DEV_PREVIEW_STORE
    : snap.store;
  const otaReady = preview ? preview !== 'store' : isUpdatePending;
  const otaDownloading = preview ? false : isDownloading;

  return {
    storeUpdateAvailable: store.updateAvailable,
    otaReady,
    otaDownloading,
    hasUpdate: store.updateAvailable || otaReady,
    isChecking: snap.isChecking,
    lastCheckAt: snap.lastCheckAt,
    latestStoreVersion: store.latestVersion,
    releaseNotes: store.releaseNotes,
    checkNow: checkForUpdates,
    applyOta,
    goToStore,
    devPreviewKey: snap.devPreviewKey,
  };
};
