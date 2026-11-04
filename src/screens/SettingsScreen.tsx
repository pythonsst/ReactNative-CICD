import React, {useMemo} from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as Updates from 'expo-updates';
import {useAppUpdates} from '../hooks/useAppUpdates';
import {getInstalledVersion} from '../services/storeUpdate';
import {C, serif, MAX_CONTENT_WIDTH} from '../theme';

interface Props {
  onBack: () => void;
}

function formatDateTime(d: Date): string {
  try {
    const time = d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const date = d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
    return `${date}, ${time}`;
  } catch {
    return d.toISOString().slice(0, 16).replace('T', ' ');
  }
}

const STORE_NAME = Platform.OS === 'ios' ? 'App Store' : 'Google Play';

/**
 * Settings. Update UI follows the Zepto pattern: an "Update Available" row
 * exists only while there is an update; tapping it asks for confirmation in
 * a native alert, then opens the store (or restarts into a downloaded OTA).
 * When up to date there is no update UI at all.
 */
export default function SettingsScreen({onBack}: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const {
    storeUpdateAvailable,
    otaReady,
    latestStoreVersion,
    applyOta,
    goToStore,
  } = useAppUpdates();

  const installed = useMemo(getInstalledVersion, []);
  const versionLabel = installed.build
    ? `${installed.version} (${installed.build})`
    : installed.version;

  // An OTA bundle is running (not the one built into the binary): show when it
  // was published, since an OTA doesn't change the version number.
  const otaPublishedAt =
    Updates.isEnabled && !Updates.isEmbeddedLaunch && Updates.createdAt
      ? formatDateTime(Updates.createdAt)
      : null;

  // Store update wins over a ready OTA: same order as the bottom-sheet prompt.
  const update: 'store' | 'ota' | null = storeUpdateAvailable
    ? 'store'
    : otaReady
    ? 'ota'
    : null;

  const onUpdatePress = () => {
    if (update === 'store') {
      if (Platform.OS === 'android') {
        // Google's in-app update screen is itself the confirmation.
        goToStore();
        return;
      }
      Alert.alert(
        'Update Available',
        `There is an updated version${
          latestStoreVersion ? ` (${latestStoreVersion})` : ''
        } available on the ${STORE_NAME}. Would you like to upgrade?`,
        [
          {text: 'Upgrade', onPress: goToStore},
          {text: 'Cancel', style: 'cancel'},
        ],
      );
    } else if (update === 'ota') {
      Alert.alert(
        'Update Ready',
        'The latest improvements have been downloaded. Restart the app to see them?',
        [
          {text: 'Restart', onPress: applyOta},
          {text: 'Later', style: 'cancel'},
        ],
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.maroon} />
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            onPress={onBack}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
            accessibilityRole="button"
            accessibilityLabel="Back to Home">
            <Text style={styles.back}>‹ Home</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {paddingBottom: insets.bottom + 32},
        ]}>
        {update ? (
          <TouchableOpacity
            style={styles.updateRow}
            activeOpacity={0.7}
            onPress={onUpdatePress}
            accessibilityRole="button"
            accessibilityLabel="Update Available">
            <View style={styles.updateIcon}>
              <Text style={styles.updateIconText}>↻</Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.updateTitle}>Update Available</Text>
              <Text style={styles.updateSub}>
                {update === 'store'
                  ? 'Get the latest features and a smoother experience'
                  : 'Restart to get the latest improvements'}
              </Text>
            </View>
            <View style={styles.newPill}>
              <Text style={styles.newPillText}>New</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ) : null}

        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.list}>
          <Row label="Version" value={versionLabel} />
          {otaPublishedAt ? (
            <Row label="Last updated" value={otaPublishedAt} divider />
          ) : null}
        </View>

        <Text style={styles.footer}>Your biodata stays on this device — private and offline.</Text>
      </ScrollView>
    </View>
  );
}

function Row({
  label,
  value,
  divider,
}: {
  label: string;
  value: string;
  divider?: boolean;
}) {
  return (
    <View style={[styles.row, divider && styles.rowDivider]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const OK = '#1f8a4c';

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {flex: 1, backgroundColor: C.canvas},
  header: {
    backgroundColor: C.maroon,
    paddingHorizontal: 22,
    paddingBottom: 20,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  headerInner: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  back: {color: '#fff', fontSize: 16, fontWeight: '600', opacity: 0.92},
  title: {
    fontFamily: serif,
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 10,
  },

  content: {
    padding: 20,
    gap: 12,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: C.muted,
    textTransform: 'uppercase',
    marginTop: 8,
    marginLeft: 4,
  },

  // "Update Available" row (only rendered while an update exists)
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  updateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateIconText: {fontSize: 20, fontWeight: '700', color: C.maroon},
  updateTitle: {fontSize: 16, fontWeight: '600', color: C.ink},
  updateSub: {fontSize: 13.5, color: C.muted, marginTop: 2, lineHeight: 19},
  newPill: {
    backgroundColor: OK,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  newPillText: {color: '#fff', fontSize: 12.5, fontWeight: '700'},
  chevron: {fontSize: 24, color: C.maroon, marginLeft: -4, marginTop: -2},

  list: {
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
  },
  rowLabel: {fontSize: 15, color: C.ink},
  rowValue: {fontSize: 15, color: C.muted},

  footer: {
    fontSize: 12.5,
    color: C.muted,
    textAlign: 'center',
    marginTop: 12,
  },
});
