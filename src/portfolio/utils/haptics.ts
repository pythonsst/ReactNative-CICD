/**
 * Light, safe haptic helpers.
 *
 * `expo-haptics` resolves its native module at import time and throws if the
 * module isn't linked into the current native build. Haptics are optional
 * polish, so we load the module defensively: if it's unavailable the helpers
 * become no-ops instead of crashing the app.
 */

type HapticsModule = typeof import('expo-haptics');

// Metro provides `require` at runtime; declare it for TypeScript without
// pulling in @types/node. Scoped to this module.
declare const require: (moduleName: string) => unknown;

let Haptics: HapticsModule | null = null;
try {
  Haptics = require('expo-haptics') as HapticsModule;
} catch {
  Haptics = null;
}

// Swallow both synchronous throws and async Promise rejections — the native
// module may be absent even when the JS module loaded, in which case the Expo
// call rejects rather than throwing synchronously.
const noop = (): void => {};

export const tapLight = (): void => {
  try {
    Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Light)?.catch(noop);
  } catch {
    // no-op
  }
};

export const tapMedium = (): void => {
  try {
    Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Medium)?.catch(noop);
  } catch {
    // no-op
  }
};

export const tapSuccess = (): void => {
  try {
    Haptics?.notificationAsync(Haptics.NotificationFeedbackType.Success)?.catch(
      noop,
    );
  } catch {
    // no-op
  }
};
