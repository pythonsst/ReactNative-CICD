import { resolveUpdateState, shouldShowUpdate } from '../updateState';

describe('resolveUpdateState', () => {
  it('prioritizes store-update over any OTA signal', () => {
    // The 13.1 → 15.2 case: a store update outranks a pending/available OTA,
    // because the behind-binary user cannot receive the new binary's OTA anyway.
    expect(
      resolveUpdateState({
        storeUpdateAvailable: true,
        isOtaPending: true,
        isOtaAvailable: true,
      }),
    ).toBe('store-update');
  });

  it('returns ota-ready when an OTA is downloaded and pending', () => {
    expect(
      resolveUpdateState({
        storeUpdateAvailable: false,
        isOtaPending: true,
        isOtaAvailable: true,
      }),
    ).toBe('ota-ready');
  });

  it('returns ota-available when an OTA exists but is not yet downloaded', () => {
    expect(
      resolveUpdateState({
        storeUpdateAvailable: false,
        isOtaPending: false,
        isOtaAvailable: true,
      }),
    ).toBe('ota-available');
  });

  it('returns up-to-date when nothing is newer', () => {
    expect(
      resolveUpdateState({
        storeUpdateAvailable: false,
        isOtaPending: false,
        isOtaAvailable: false,
      }),
    ).toBe('up-to-date');
  });
});

describe('shouldShowUpdate', () => {
  it('hides the row only when up-to-date', () => {
    expect(shouldShowUpdate('up-to-date')).toBe(false);
    expect(shouldShowUpdate('store-update')).toBe(true);
    expect(shouldShowUpdate('ota-ready')).toBe(true);
    expect(shouldShowUpdate('ota-available')).toBe(true);
  });
});
