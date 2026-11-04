import { resolvePrompt } from '../updateState';

const none = { store: false, ota: false };

describe('resolvePrompt', () => {
  it('shows nothing when up to date', () => {
    expect(
      resolvePrompt({
        storeUpdateAvailable: false,
        otaReady: false,
        dismissed: none,
      }),
    ).toBeNull();
  });

  it('shows the store prompt first when both a store build and an OTA are ready', () => {
    expect(
      resolvePrompt({
        storeUpdateAvailable: true,
        otaReady: true,
        dismissed: none,
      }),
    ).toBe('store');
  });

  it('falls through to the OTA prompt after the store prompt is dismissed', () => {
    expect(
      resolvePrompt({
        storeUpdateAvailable: true,
        otaReady: true,
        dismissed: { store: true, ota: false },
      }),
    ).toBe('ota');
  });

  it('shows the OTA prompt alone when there is no store update', () => {
    expect(
      resolvePrompt({
        storeUpdateAvailable: false,
        otaReady: true,
        dismissed: none,
      }),
    ).toBe('ota');
  });

  it('shows nothing once every pending prompt is dismissed', () => {
    expect(
      resolvePrompt({
        storeUpdateAvailable: true,
        otaReady: true,
        dismissed: { store: true, ota: true },
      }),
    ).toBeNull();
  });

  it('does not show the store prompt for an OTA-only dismissal', () => {
    expect(
      resolvePrompt({
        storeUpdateAvailable: false,
        otaReady: true,
        dismissed: { store: false, ota: true },
      }),
    ).toBeNull();
  });
});
