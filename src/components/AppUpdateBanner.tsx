import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {useAppUpdates} from '../hooks/useAppUpdates';
import type {AppUpdateState} from '../hooks/updateState';
import {C} from '../theme';

type RowContent = {
  label: string;
  badge?: (latestStoreVersion?: string) => string | undefined;
  showChevron: boolean;
  busy: boolean;
};

const CONTENT: Record<Exclude<AppUpdateState, 'up-to-date'>, RowContent> = {
  'store-update': {
    label: 'App Update Available',
    badge: v => (v ? `v${v}` : undefined),
    showChevron: true,
    busy: false,
  },
  'ota-ready': {
    label: 'Update ready — restart to apply',
    showChevron: true,
    busy: false,
  },
  'ota-available': {
    label: 'Downloading update…',
    showChevron: false,
    busy: true,
  },
};

type Props = {
  // Outer spacing; only applied when the banner is shown, so a hidden banner
  // leaves no gap in the layout.
  style?: StyleProp<ViewStyle>;
};

export const AppUpdateBanner: React.FC<Props> = ({style}) => {
  const {state, isVisible, latestStoreVersion, applyOta, goToStore} =
    useAppUpdates();

  if (!isVisible || state === 'up-to-date') {
    return null;
  }

  const content = CONTENT[state];
  const badge = content.badge?.(latestStoreVersion);

  const onPress = () => {
    if (state === 'store-update') {
      goToStore();
    } else if (state === 'ota-ready') {
      applyOta();
    }
  };

  return (
    <View style={style}>
      <TouchableOpacity
        style={styles.row}
        activeOpacity={content.busy ? 1 : 0.7}
        disabled={content.busy}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={content.label}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>↻</Text>
        </View>
        <Text style={styles.label} numberOfLines={1}>
          {content.label}
        </Text>
        <View style={styles.right}>
          {badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
          {content.busy ? (
            <ActivityIndicator size="small" color={C.maroon} />
          ) : null}
          {content.showChevron ? <Text style={styles.chevron}>›</Text> : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 16,
    color: C.maroon,
    fontWeight: '700',
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: C.ink,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: C.goldSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.maroon,
  },
  chevron: {
    fontSize: 22,
    color: C.muted,
    marginLeft: 2,
  },
});
