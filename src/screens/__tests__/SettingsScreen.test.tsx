import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {Alert, Platform, Text, TouchableOpacity} from 'react-native';
import SettingsScreen from '../SettingsScreen';
import {useAppUpdates} from '../../hooks/useAppUpdates';

jest.mock('../../hooks/useAppUpdates', () => ({useAppUpdates: jest.fn()}));
jest.mock('../../services/storeUpdate', () => ({
  getInstalledVersion: () => ({version: '1.0.1', build: '47'}),
}));

const applyOta = jest.fn();
const goToStore = jest.fn();

const mockHook = (over: Record<string, unknown>) =>
  (useAppUpdates as jest.Mock).mockReturnValue({
    storeUpdateAvailable: false,
    otaReady: false,
    otaDownloading: false,
    hasUpdate: false,
    isChecking: false,
    lastCheckAt: Date.now(),
    latestStoreVersion: undefined,
    releaseNotes: undefined,
    checkNow: jest.fn(),
    applyOta,
    goToStore,
    devPreviewKey: 0,
    ...over,
  });

const render = async () => {
  let r!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    r = ReactTestRenderer.create(<SettingsScreen onBack={jest.fn()} />);
  });
  return r;
};
const texts = (r: ReactTestRenderer.ReactTestRenderer) =>
  r.root.findAllByType(Text).map(t => [t.props.children].flat().join(''));
const press = (r: ReactTestRenderer.ReactTestRenderer, label: string) =>
  r.root
    .findAllByType(TouchableOpacity)
    .find(b => b.props.accessibilityLabel === label)!
    .props.onPress();

// Taps the button with the given text in the most recent alert.
const tapAlert = (text: string) => {
  const calls = (Alert.alert as jest.Mock).mock.calls;
  const buttons = calls[calls.length - 1][2];
  buttons.find((b: {text: string}) => b.text === text).onPress?.();
};

const originalOS = Platform.OS;
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  Platform.OS = 'ios';
});
afterAll(() => {
  Platform.OS = originalOS;
});

it('up to date: no update UI at all, only the version', async () => {
  mockHook({});
  const r = await render();
  const t = texts(r);
  expect(t).not.toContain('Update Available');
  expect(t).not.toContain('Check for updates');
  expect(t).toContain('1.0.1 (47)');
  // Only the back button is tappable.
  expect(r.root.findAllByType(TouchableOpacity)).toHaveLength(1);
});

it('store update (iOS): row → confirm alert → Upgrade opens the store', async () => {
  mockHook({
    storeUpdateAvailable: true,
    hasUpdate: true,
    latestStoreVersion: '1.1.0',
  });
  const r = await render();
  const t = texts(r);
  expect(t).toContain('Update Available');
  expect(t).toContain('New');

  await act(async () => press(r, 'Update Available'));
  expect(Alert.alert).toHaveBeenCalledWith(
    'Update Available',
    'There is an updated version (1.1.0) available on the App Store. Would you like to upgrade?',
    expect.any(Array),
  );
  expect(goToStore).not.toHaveBeenCalled();
  tapAlert('Upgrade');
  expect(goToStore).toHaveBeenCalledTimes(1);
});

it('store update (iOS): Cancel does nothing', async () => {
  mockHook({storeUpdateAvailable: true, hasUpdate: true});
  const r = await render();
  await act(async () => press(r, 'Update Available'));
  tapAlert('Cancel');
  expect(goToStore).not.toHaveBeenCalled();
});

it('store update (Android): goes straight to Google’s in-app update', async () => {
  Platform.OS = 'android';
  mockHook({storeUpdateAvailable: true, hasUpdate: true});
  const r = await render();
  await act(async () => press(r, 'Update Available'));
  expect(Alert.alert).not.toHaveBeenCalled();
  expect(goToStore).toHaveBeenCalledTimes(1);
});

it('OTA ready: row → alert → Restart applies the update', async () => {
  mockHook({otaReady: true, hasUpdate: true});
  const r = await render();
  expect(texts(r)).toContain('Restart to get the latest improvements');
  await act(async () => press(r, 'Update Available'));
  expect((Alert.alert as jest.Mock).mock.calls[0][0]).toBe('Update Ready');
  tapAlert('Restart');
  expect(applyOta).toHaveBeenCalledTimes(1);
});

it('store update outranks a ready OTA', async () => {
  mockHook({storeUpdateAvailable: true, otaReady: true, hasUpdate: true});
  const r = await render();
  expect(texts(r)).toContain(
    'Get the latest features and a smoother experience',
  );
});

it('OTA still downloading: nothing to act on yet, so no row', async () => {
  mockHook({otaDownloading: true});
  const r = await render();
  expect(texts(r)).not.toContain('Update Available');
});
