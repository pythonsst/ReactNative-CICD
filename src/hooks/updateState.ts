export type AppUpdateState =
  | 'up-to-date'
  | 'ota-available'
  | 'ota-ready'
  | 'store-update';

export type UpdateSignals = {
  storeUpdateAvailable: boolean;
  isOtaPending: boolean;
  isOtaAvailable: boolean;
};

/**
 * Resolves the single state to show, in priority order:
 *   store-update > ota-ready > ota-available > up-to-date
 *
 * A newer native binary wins: a user behind on the store cannot receive that
 * binary's OTA anyway (OTA is locked to the running runtimeVersion), so the
 * store update is the only path forward and must be surfaced first.
 */
export const resolveUpdateState = ({
  storeUpdateAvailable,
  isOtaPending,
  isOtaAvailable,
}: UpdateSignals): AppUpdateState => {
  if (storeUpdateAvailable) {return 'store-update';}
  if (isOtaPending) {return 'ota-ready';}
  if (isOtaAvailable) {return 'ota-available';}
  return 'up-to-date';
};

export const shouldShowUpdate = (state: AppUpdateState): boolean =>
  state !== 'up-to-date';
