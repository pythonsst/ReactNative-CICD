import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
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

// "just now" / "5 min ago" / "10:20" / "4 Nov, 10:20"
export function formatLastChecked(ts: number, now: number): string {
  if (!ts) {
    return 'Not checked yet';
  }
  const mins = Math.floor((now - ts) / 60_000);
  if (mins < 1) {
    return 'Last checked just now';
  }
  if (mins < 60) {
    return `Last checked ${mins} min ago`;
  }
  return `Last checked ${formatDateTime(new Date(ts))}`;
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

export default function SettingsScreen({onBack}: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const {
    storeUpdateAvailable,
    otaReady,
    otaDownloading,
    isChecking,
    lastCheckAt,
    latestStoreVersion,
    releaseNotes,
    checkNow,
    applyOta,
    goToStore,
  } = useAppUpdates();

  const installed = useMemo(getInstalledVersion, []);
  const versionLabel = installed.build
    ? `${installed.version} (${installed.build})`
    : installed.version;

  // Re-render each minute so "x min ago" stays honest while the screen is open.
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);
  // Bump "now" when a check finishes so it reads "just now" immediately.
  useEffect(() => {
    if (lastCheckAt) {
      setNow(Date.now());
    }
  }, [lastCheckAt]);

  // An OTA bundle is running (not the one built into the binary): show when it
  // was published, since an OTA doesn't change the version number.
  const otaPublishedAt =
    Updates.isEnabled && !Updates.isEmbeddedLaunch && Updates.createdAt
      ? formatDateTime(Updates.createdAt)
      : null;

  const storeName = Platform.OS === 'ios' ? 'App Store' : 'Google Play';

  let card: React.JSX.Element;
  if (storeUpdateAvailable) {
    card = (
      <View style={[styles.card, styles.cardAttn]}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Update available</Text>
        </View>
        {latestStoreVersion ? (
          <View style={styles.versions}>
            <View>
              <Text style={styles.vLabel}>Installed</Text>
              <Text style={styles.vValue}>{installed.version}</Text>
            </View>
            <Text style={styles.vArrow}>→</Text>
            <View style={styles.vRight}>
              <Text style={styles.vLabel}>{storeName}</Text>
              <Text style={[styles.vValue, styles.vNew]}>
                {latestStoreVersion}
              </Text>
            </View>
          </View>
        ) : (
          // Android: Play Core reports only that a newer build exists.
          <Text style={styles.cardSub}>
            A newer version of SnapBiodata is available on {storeName}.
          </Text>
        )}
        {releaseNotes ? (
          <View>
            <Text style={styles.notesLabel}>What’s new</Text>
            <Text style={styles.notes} numberOfLines={8}>
              {releaseNotes.trim()}
            </Text>
          </View>
        ) : null}
        <PrimaryButton label="Update now" onPress={goToStore} />
      </View>
    );
  } else if (otaReady) {
    card = (
      <View style={[styles.card, styles.cardAttn]}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Update ready</Text>
        </View>
        <CardHead
          icon="↻"
          tone="new"
          title="Latest improvements downloaded"
          sub="Restart the app to see the new changes"
        />
        <PrimaryButton label="Restart now" onPress={applyOta} />
        <Text style={styles.caption}>
          Takes a second. Your biodata is saved.
        </Text>
      </View>
    );
  } else if (otaDownloading) {
    card = (
      <View style={styles.card}>
        <CardHead
          spinner
          tone="new"
          title="Downloading update…"
          sub="It will be ready in a moment"
        />
      </View>
    );
  } else {
    card = (
      <View style={styles.card}>
        <CardHead
          icon="✓"
          tone="ok"
          title="You’re on the latest version"
          sub={`SnapBiodata ${versionLabel}`}
        />
        <TouchableOpacity
          style={[styles.btn, styles.btnOutline]}
          activeOpacity={0.7}
          disabled={isChecking}
          onPress={checkNow}
          accessibilityRole="button"
          accessibilityLabel="Check for updates"
          accessibilityState={{busy: isChecking}}>
          {isChecking ? (
            <ActivityIndicator color={C.maroon} />
          ) : (
            <Text style={styles.btnOutlineText}>Check for updates</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.caption}>
          {isChecking ? 'Checking…' : formatLastChecked(lastCheckAt, now)}
        </Text>
      </View>
    );
  }

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
        <Text style={styles.sectionLabel}>App updates</Text>
        {card}

        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.list}>
          <Row label="Version" value={versionLabel} />
          {otaPublishedAt ? (
            <Row label="Update" value={otaPublishedAt} divider />
          ) : null}
        </View>

        <Text style={styles.footer}>Your biodata stays on this device.</Text>
      </ScrollView>
    </View>
  );
}

function CardHead({
  icon,
  spinner,
  tone,
  title,
  sub,
}: {
  icon?: string;
  spinner?: boolean;
  tone: 'ok' | 'new';
  title: string;
  sub: string;
}) {
  return (
    <View style={styles.cardHead}>
      <View
        style={[styles.icon, tone === 'ok' ? styles.iconOk : styles.iconNew]}>
        {spinner ? (
          <ActivityIndicator size="small" color={C.maroon} />
        ) : (
          <Text
            style={[
              styles.iconText,
              tone === 'ok' ? styles.iconTextOk : styles.iconTextNew,
            ]}>
            {icon}
          </Text>
        )}
      </View>
      <View style={styles.flex}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSub}>{sub}</Text>
      </View>
    </View>
  );
}

function PrimaryButton({label, onPress}: {label: string; onPress: () => void}) {
  return (
    <TouchableOpacity
      style={[styles.btn, styles.btnPrimary]}
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Text style={styles.btnPrimaryText}>{label}</Text>
    </TouchableOpacity>
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

const OK = '#2f7a4f';
const OK_SOFT = '#e3f1e8';

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

  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardAttn: {borderColor: C.gold, borderWidth: 1.5},
  cardHead: {flexDirection: 'row', alignItems: 'center', gap: 12},
  icon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOk: {backgroundColor: OK_SOFT},
  iconNew: {backgroundColor: C.goldSoft},
  iconText: {fontSize: 20, fontWeight: '700'},
  iconTextOk: {color: OK},
  iconTextNew: {color: C.maroon},
  cardTitle: {fontSize: 16, fontWeight: '600', color: C.ink},
  cardSub: {fontSize: 13.5, color: C.muted, marginTop: 2, lineHeight: 19},

  pill: {
    alignSelf: 'flex-start',
    backgroundColor: C.maroon,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  versions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.canvas,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  vRight: {alignItems: 'flex-end'},
  vLabel: {fontSize: 11.5, color: C.muted},
  vValue: {fontSize: 16, fontWeight: '700', color: C.ink, marginTop: 2},
  vNew: {color: C.maroon},
  vArrow: {fontSize: 18, color: C.gold},

  notesLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: C.muted,
    marginBottom: 4,
  },
  notes: {fontSize: 14, lineHeight: 20, color: C.ink},

  btn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  btnPrimary: {backgroundColor: C.maroon},
  btnPrimaryText: {color: '#fff', fontSize: 16, fontWeight: '700'},
  btnOutline: {borderWidth: 1.5, borderColor: C.maroon},
  btnOutlineText: {color: C.maroon, fontSize: 16, fontWeight: '700'},
  caption: {fontSize: 12.5, color: C.muted, textAlign: 'center', marginTop: -4},

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
