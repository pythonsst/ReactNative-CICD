import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {C, serif, MAX_CONTENT_WIDTH} from '../theme';
import type {BiodataRecord} from '../data/biodata';
import {displayName} from '../data/biodata';
import {getTemplate} from '../templates';
import {sharePdf, printBiodata} from '../lib/pdf';
import BiodataDocument from '../components/BiodataDocument';

interface Props {
  record: BiodataRecord;
  onEdit: () => void;
  onBack: () => void;
}

export default function PreviewScreen({
  record,
  onEdit,
  onBack,
}: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState<'share' | 'print' | null>(null);

  const doShare = async () => {
    setBusy('share');
    try {
      await sharePdf(record.data, record.templateId);
    } catch {
      Alert.alert('Export failed', 'Could not create the PDF. Please try again.');
    } finally {
      setBusy(null);
    }
  };

  const doPrint = async () => {
    setBusy('print');
    try {
      await printBiodata(record.data, record.templateId);
    } catch {
      Alert.alert('Print failed', 'Could not open the print dialog.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor={C.canvas} />

      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          accessibilityRole="button"
          accessibilityLabel="Back to home">
          <Text style={styles.headerBtn}>‹ Home</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {displayName(record.data)}
          </Text>
          <Text style={styles.headerSub}>
            {getTemplate(record.templateId).name} template
          </Text>
        </View>
        <TouchableOpacity
          onPress={onEdit}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          accessibilityRole="button"
          accessibilityLabel="Edit biodata">
          <Text style={styles.headerBtnStrong}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.docWrap}
        contentContainerStyle={styles.docContent}
        showsVerticalScrollIndicator={false}>
        <BiodataDocument data={record.data} templateId={record.templateId} />
      </ScrollView>

      <View style={[styles.actions, {paddingBottom: insets.bottom + 12}]}>
        <TouchableOpacity
          style={[styles.secondary, busy && styles.disabled]}
          onPress={doPrint}
          disabled={!!busy}
          accessibilityRole="button"
          accessibilityLabel="Print or save as PDF">
          {busy === 'print' ? (
            <ActivityIndicator color={C.maroon} />
          ) : (
            <Text style={styles.secondaryText}>Print / Save</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primary, busy && styles.disabled]}
          onPress={doShare}
          disabled={!!busy}
          accessibilityRole="button"
          accessibilityLabel="Share PDF">
          {busy === 'share' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryText}>Share PDF</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: C.canvas},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: C.canvas,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.line,
  },
  headerBtn: {color: C.maroon, fontSize: 16, fontWeight: '600', width: 60},
  headerBtnStrong: {
    color: C.maroon,
    fontSize: 16,
    fontWeight: '700',
    width: 60,
    textAlign: 'right',
  },
  headerCenter: {flex: 1, alignItems: 'center'},
  headerTitle: {
    fontFamily: serif,
    fontSize: 16,
    fontWeight: '700',
    color: C.ink,
  },
  headerSub: {fontSize: 11.5, color: C.muted, marginTop: 1},

  docWrap: {flex: 1, backgroundColor: '#dfd7cd'},
  docContent: {
    padding: 16,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: C.canvas,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH + 40,
    alignSelf: 'center',
  },
  primary: {
    flex: 1.3,
    backgroundColor: C.maroon,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    shadowColor: C.maroon,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryText: {color: '#fff', fontSize: 16, fontWeight: '700'},
  secondary: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.maroon,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  secondaryText: {color: C.maroon, fontSize: 16, fontWeight: '700'},
  disabled: {opacity: 0.6},
});
