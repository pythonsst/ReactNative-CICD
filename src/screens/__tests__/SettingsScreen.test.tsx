import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {Text, TouchableOpacity} from 'react-native';
import SettingsScreen, {formatLastChecked} from '../SettingsScreen';
import {useAppUpdates} from '../../hooks/useAppUpdates';

jest.mock('../../hooks/useAppUpdates', () => ({useAppUpdates: jest.fn()}));
jest.mock('../../services/storeUpdate', () => ({
  getInstalledVersion: () => ({version: '1.0.1', build: '47'}),
}));

const checkNow = jest.fn();
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
    checkNow,
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

beforeEach(() => jest.clearAllMocks());

it('up to date: shows the installed version and checks on demand', async () => {
  mockHook({});
  const r = await render();
  expect(texts(r)).toContain('You’re on the latest version');
  expect(texts(r)).toContain('SnapBiodata 1.0.1 (47)');
  expect(texts(r)).toContain('Last checked just now');
  await act(async () => press(r, 'Check for updates'));
  expect(checkNow).toHaveBeenCalledTimes(1);
});

it('store update: shows installed → store version, notes, and opens the store', async () => {
  mockHook({
    storeUpdateAvailable: true,
    hasUpdate: true,
    latestStoreVersion: '1.1.0',
    releaseNotes: 'Faster PDF export',
  });
  const r = await render();
  const t = texts(r);
  expect(t).toContain('Update available');
  expect(t).toContain('1.0.1');
  expect(t).toContain('1.1.0');
  expect(t).toContain('Faster PDF export');
  await act(async () => press(r, 'Update now'));
  expect(goToStore).toHaveBeenCalledTimes(1);
});

it('store update without a version (Android): explains instead of a version row', async () => {
  mockHook({storeUpdateAvailable: true, hasUpdate: true});
  const r = await render();
  expect(
    texts(r).some(s => s.startsWith('A newer version of SnapBiodata')),
  ).toBe(true);
});

it('OTA ready: offers a restart', async () => {
  mockHook({otaReady: true, hasUpdate: true});
  const r = await render();
  expect(texts(r)).toContain('Latest improvements downloaded');
  await act(async () => press(r, 'Restart now'));
  expect(applyOta).toHaveBeenCalledTimes(1);
});

it('store update outranks a ready OTA', async () => {
  mockHook({storeUpdateAvailable: true, otaReady: true, hasUpdate: true});
  const r = await render();
  expect(texts(r)).toContain('Update now');
  expect(texts(r)).not.toContain('Restart now');
});

it('OTA downloading: shows progress, no button', async () => {
  mockHook({otaDownloading: true});
  const r = await render();
  expect(texts(r)).toContain('Downloading update…');
  expect(r.root.findAllByType(TouchableOpacity)).toHaveLength(1); // back only
});

describe('formatLastChecked', () => {
  const now = new Date(2026, 10, 4, 10, 30).getTime();
  it('handles never / just now / minutes', () => {
    expect(formatLastChecked(0, now)).toBe('Not checked yet');
    expect(formatLastChecked(now - 20_000, now)).toBe('Last checked just now');
    expect(formatLastChecked(now - 5 * 60_000, now)).toBe(
      'Last checked 5 min ago',
    );
  });
  it('falls back to a date and time after an hour', () => {
    expect(formatLastChecked(now - 2 * 3_600_000, now)).toMatch(
      /^Last checked 4 Nov, 08:30$/,
    );
  });
});
