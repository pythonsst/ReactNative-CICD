import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {C, serif} from '../theme';
import type {BiodataRecord} from '../data/biodata';
import {buildHtml} from '../templates/html';
import {sharePdf, printBiodata} from '../lib/pdf';

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
  const [busy, setBusy] = useState<'share' | 'print' | null>(null);

  const html = useMemo(
    () => buildHtml(record.data, record.templateId, false),
    [record.data, record.templateId],
  );

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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          accessibilityRole="button"
          accessibilityLabel="Back to home">
          <Text style={styles.headerBtn}>‹ Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preview</Text>
        <TouchableOpacity
          onPress={onEdit}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          accessibilityRole="button"
          accessibilityLabel="Edit biodata">
          <Text style={styles.headerBtnStrong}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.docWrap}>
        <WebView
          originWhitelist={['*']}
          source={{html}}
          style={styles.web}
          scalesPageToFit
          showsVerticalScrollIndicator
        />
      </View>

      <View style={styles.actions}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.line,
  },
  headerBtn: {color: C.maroon, fontSize: 16, fontWeight: '600'},
  headerBtnStrong: {color: C.maroon, fontSize: 16, fontWeight: '700'},
  headerTitle: {
    fontFamily: serif,
    fontSize: 17,
    fontWeight: '700',
    color: C.ink,
  },

  docWrap: {flex: 1, backgroundColor: '#e9e2da'},
  web: {flex: 1, backgroundColor: '#e9e2da'},

  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
  },
  primary: {
    flex: 1,
    backgroundColor: C.maroon,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
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
    minHeight: 50,
  },
  secondaryText: {color: C.maroon, fontSize: 16, fontWeight: '700'},
  disabled: {opacity: 0.6},
});
