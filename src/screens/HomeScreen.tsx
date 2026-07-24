import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {C, serif} from '../theme';
import type {BiodataRecord} from '../data/biodata';
import {displayName} from '../data/biodata';
import {getTemplate} from '../templates';

interface Props {
  records: BiodataRecord[];
  onCreate: () => void;
  onOpen: (record: BiodataRecord) => void;
  onDelete: (id: string) => void;
  onPreviewSample: () => void;
}

function formatDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return '♥';
  }
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

export default function HomeScreen({
  records,
  onCreate,
  onOpen,
  onDelete,
  onPreviewSample,
}: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();

  const confirmDelete = (record: BiodataRecord) => {
    Alert.alert(
      'Delete biodata?',
      `“${displayName(record.data)}” will be permanently removed from this device.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(record.id),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.maroon} />

      {/* Branded header */}
      <View style={[styles.header, {paddingTop: insets.top + 14}]}>
        <View style={styles.brandRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeGlyph}>♥</Text>
          </View>
          <Text style={styles.wordmark}>SnapBiodata</Text>
        </View>
        <Text style={styles.tagline}>
          Create beautiful marriage biodata — right on your phone.
        </Text>
      </View>

      {records.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyBadge}>
            <Text style={styles.emptyBadgeGlyph}>♥</Text>
          </View>
          <Text style={styles.emptyFlourish}>✦ ✦ ✦</Text>
          <Text style={styles.emptyTitle}>No biodata yet</Text>
          <Text style={styles.emptyMsg}>
            Fill in your details, pick a template, and export a print-ready
            PDF — 100% offline, no sign-up.
          </Text>
          <TouchableOpacity
            style={styles.sampleBtn}
            activeOpacity={0.7}
            onPress={onPreviewSample}
            accessibilityRole="button"
            accessibilityLabel="See a sample biodata">
            <Text style={styles.sampleBtnText}>See a sample biodata →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={records}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.listContent,
            {paddingBottom: insets.bottom + 96},
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.sectionLabel}>
              Your biodata ({records.length})
            </Text>
          }
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => onOpen(item)}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {initials(displayName(item.data))}
                </Text>
              </View>
              <View style={styles.cardMain}>
                <Text style={styles.cardName} numberOfLines={1}>
                  {displayName(item.data)}
                </Text>
                <Text style={styles.cardMeta} numberOfLines={1}>
                  {getTemplate(item.templateId).name} · {formatDate(item.updatedAt)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => confirmDelete(item)}
                hitSlop={{top: 14, bottom: 14, left: 14, right: 14}}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${displayName(item.data)}`}>
                <Text style={styles.delete}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Floating CTA */}
      <View style={[styles.ctaWrap, {paddingBottom: insets.bottom + 12}]}>
        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.9}
          onPress={onCreate}
          accessibilityRole="button"
          accessibilityLabel="Create new biodata">
          <Text style={styles.ctaPlus}>＋</Text>
          <Text style={styles.ctaText}>Create new biodata</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: C.canvas},

  header: {
    backgroundColor: C.maroon,
    paddingHorizontal: 22,
    paddingBottom: 22,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  brandRow: {flexDirection: 'row', alignItems: 'center', gap: 11},
  badge: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.gold,
  },
  badgeGlyph: {color: C.gold, fontSize: 19},
  wordmark: {
    fontFamily: serif,
    fontSize: 23,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
    marginTop: 12,
    lineHeight: 20,
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyBadge: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: C.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: C.gold,
    marginBottom: 22,
  },
  emptyBadgeGlyph: {color: C.maroon, fontSize: 34},
  emptyFlourish: {
    color: C.gold,
    letterSpacing: 6,
    fontSize: 13,
    marginBottom: 12,
  },
  emptyTitle: {
    fontFamily: serif,
    fontSize: 24,
    fontWeight: '700',
    color: C.ink,
  },
  emptyMsg: {
    fontSize: 14.5,
    lineHeight: 22,
    color: C.muted,
    textAlign: 'center',
    marginTop: 8,
  },
  sampleBtn: {
    marginTop: 22,
    borderWidth: 1.5,
    borderColor: C.maroon,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sampleBtnText: {color: C.maroon, fontSize: 15, fontWeight: '700'},

  list: {flex: 1},
  listContent: {paddingHorizontal: 20, paddingTop: 20},
  sectionLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  card: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#7d1530',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 1,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  avatarText: {
    fontFamily: serif,
    color: C.maroonDark,
    fontSize: 16,
    fontWeight: '700',
  },
  cardMain: {flex: 1, marginRight: 10},
  cardName: {
    fontFamily: serif,
    fontSize: 17,
    fontWeight: '700',
    color: C.ink,
  },
  cardMeta: {fontSize: 12.5, color: C.muted, marginTop: 3},
  delete: {color: C.muted, fontSize: 17, fontWeight: '600', paddingHorizontal: 4},

  ctaWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  cta: {
    backgroundColor: C.maroon,
    borderRadius: 16,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: C.maroon,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaPlus: {color: '#fff', fontSize: 18, fontWeight: '700', marginTop: -2},
  ctaText: {color: '#fff', fontSize: 16.5, fontWeight: '700', letterSpacing: 0.3},
});
