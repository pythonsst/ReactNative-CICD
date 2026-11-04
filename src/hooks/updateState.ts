export type UpdatePrompt = 'store' | 'ota';

export type PromptSignals = {
  // A newer native build is live on the App Store / Play Store.
  storeUpdateAvailable: boolean;
  // An OTA bundle has been downloaded and applies on restart.
  otaReady: boolean;
  // Prompts the user tapped "Later" on this session.
  dismissed: Readonly<Record<UpdatePrompt, boolean>>;
};

/**
 * Picks which update prompt to show, one at a time:
 *
 *   1. Store update first: a new native build is the bigger update, and
 *      future OTAs may target that build's runtime only.
 *   2. Then the OTA, once the store prompt has been dismissed ("Later") or
 *      when there is no store update at all.
 *
 * So with both pending the user sees "New version available"; after "Later"
 * the "Update ready — restart" prompt follows.
 */
export const resolvePrompt = ({
  storeUpdateAvailable,
  otaReady,
  dismissed,
}: PromptSignals): UpdatePrompt | null => {
  if (storeUpdateAvailable && !dismissed.store) {return 'store';}
  if (otaReady && !dismissed.ota) {return 'ota';}
  return null;
};
