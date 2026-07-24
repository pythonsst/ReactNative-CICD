import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import {C, serif} from '../theme';
import type {BiodataRecord} from '../data/biodata';
import {displayName} from '../data/biodata';
import {getTemplate} from '../templates';

interface Props {
  records: BiodataRecord[];
  onCreate: () => void;
  onOpen: (record: BiodataRecord) => void;
  onDelete: (id: string) => void;
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

export default function HomeScreen({
  records,
  onCreate,
  onOpen,
  onDelete,
}: Props): React.JSX.Element {
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
      <View style={styles.brandRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeGlyph}>♥</Text>
        </View>
        <Text style={styles.wordmark}>SnapBiodata</Text>
      </View>

      <Text style={styles.tagline}>
        Create beautiful marriage biodata — right on your phone.
      </Text>

      {records.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyFlourish}>✦ ✦ ✦</Text>
          <Text style={styles.emptyTitle}>No biodata yet</Text>
          <Text style={styles.emptyMsg}>
            Tap the button below to fill in your details, pick a template, and
            export a print-ready PDF — 100% offline, no sign-up.
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          data={records}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => onOpen(item)}>
              <View style={styles.cardMain}>
                <Text style={styles.cardName} numberOfLines={1}>
                  {displayName(item.data)}
                </Text>
                <Text style={styles.cardMeta}>
                  {getTemplate(item.templateId).name} · Updated{' '}
                  {formatDate(item.updatedAt)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => confirmDelete(item)}
                hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${displayName(item.data)}`}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.cta}
        activeOpacity={0.85}
        onPress={onCreate}
        accessibilityRole="button"
        accessibilityLabel="Create new biodata">
        <Text style={styles.ctaText}>+ Create new biodata</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 24},
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
  },
  badge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.maroon,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.gold,
  },
  badgeGlyph: {color: '#fff', fontSize: 17},
  wordmark: {
    fontFamily: serif,
    fontSize: 20,
    fontWeight: '700',
    color: C.ink,
    letterSpacing: 0.2,
  },
  tagline: {
    fontSize: 14.5,
    color: C.muted,
    marginTop: 12,
    lineHeight: 21,
  },

  empty: {flex: 1, justifyContent: 'center', alignItems: 'center', gap: 6},
  emptyFlourish: {color: C.gold, letterSpacing: 6, fontSize: 14, marginBottom: 10},
  emptyTitle: {
    fontFamily: serif,
    fontSize: 22,
    fontWeight: '700',
    color: C.ink,
  },
  emptyMsg: {
    fontSize: 14.5,
    lineHeight: 22,
    color: C.muted,
    textAlign: 'center',
    maxWidth: 300,
    marginTop: 4,
  },

  list: {flex: 1, marginTop: 16},
  listContent: {paddingBottom: 12},
  card: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardMain: {flex: 1, marginRight: 12},
  cardName: {
    fontFamily: serif,
    fontSize: 17,
    fontWeight: '700',
    color: C.ink,
  },
  cardMeta: {fontSize: 12.5, color: C.muted, marginTop: 3},
  delete: {color: C.maroon, fontSize: 13, fontWeight: '600'},

  cta: {
    backgroundColor: C.maroon,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
    shadowColor: C.maroon,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaText: {color: '#fff', fontSize: 16.5, fontWeight: '700', letterSpacing: 0.3},
});
