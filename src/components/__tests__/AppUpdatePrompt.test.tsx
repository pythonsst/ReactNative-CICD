import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {Text, TouchableOpacity} from 'react-native';
import {AppUpdatePrompt} from '../AppUpdatePrompt';
import {useAppUpdates} from '../../hooks/useAppUpdates';

jest.mock('../../hooks/useAppUpdates', () => ({useAppUpdates: jest.fn()}));

const applyOta = jest.fn();
const goToStore = jest.fn();

const mockHook = (storeUpdateAvailable: boolean, otaReady: boolean) =>
  (useAppUpdates as jest.Mock).mockReturnValue({
    storeUpdateAvailable,
    otaReady,
    isChecking: false,
    latestStoreVersion: '1.1.0',
    checkNow: jest.fn(),
    applyOta,
    goToStore,
    devPreviewKey: 0,
  });

const texts = (r: ReactTestRenderer.ReactTestRenderer) =>
  r.root.findAllByType(Text).map(t => [t.props.children].flat().join(''));

const press = (r: ReactTestRenderer.ReactTestRenderer, label: string) =>
  r.root
    .findAllByType(TouchableOpacity)
    .find(b => b.props.accessibilityLabel === label)!
    .props.onPress();

const isOpen = (r: ReactTestRenderer.ReactTestRenderer) =>
  r.root.findByProps({transparent: true}).props.visible;

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
});
afterEach(() => jest.useRealTimers());

it('shows the store prompt first, then the OTA prompt after "Later"', async () => {
  mockHook(true, true);
  let r!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    r = ReactTestRenderer.create(<AppUpdatePrompt />);
  });

  expect(isOpen(r)).toBe(true);
  expect(texts(r)).toContain('New version available');
  expect(texts(r)).toContain('Update now');

  await act(async () => press(r, 'Update now'));
  expect(goToStore).toHaveBeenCalledTimes(1);

  // "Later" on the store prompt: sheet slides down, then the OTA one comes up.
  await act(async () => press(r, 'Later'));
  expect(isOpen(r)).toBe(false);
  await act(async () => {
    jest.runAllTimers();
  });
  expect(isOpen(r)).toBe(true);
  expect(texts(r)).toContain('Update ready');

  await act(async () => press(r, 'Restart now'));
  expect(applyOta).toHaveBeenCalledTimes(1);

  // "Later" on the OTA prompt: nothing left to show.
  await act(async () => press(r, 'Later'));
  await act(async () => {
    jest.runAllTimers();
  });
  expect(isOpen(r)).toBe(false);
});

it('shows only the OTA prompt when there is no store update', async () => {
  mockHook(false, true);
  let r!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    r = ReactTestRenderer.create(<AppUpdatePrompt />);
  });
  expect(isOpen(r)).toBe(true);
  expect(texts(r)).toContain('Update ready');
});

it('shows the OTA prompt once its download finishes after the store prompt was dismissed', async () => {
  mockHook(true, false);
  let r!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    r = ReactTestRenderer.create(<AppUpdatePrompt />);
  });
  await act(async () => press(r, 'Later'));
  expect(isOpen(r)).toBe(false);

  mockHook(true, true); // OTA finished downloading later in the session
  await act(async () => {
    r.update(<AppUpdatePrompt />);
  });
  expect(isOpen(r)).toBe(true);
  expect(texts(r)).toContain('Update ready');
});

it('shows nothing when up to date', async () => {
  mockHook(false, false);
  let r!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    r = ReactTestRenderer.create(<AppUpdatePrompt />);
  });
  expect(isOpen(r)).toBe(false);
});
