import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {C, serif} from '../theme';
import {
  biodataSections,
  headerPresets,
  type Biodata,
  type BiodataRecord,
} from '../data/biodata';
import {templates} from '../templates';
import Field from '../components/Field';
import {pickPhoto} from '../lib/photo';

interface Props {
  record: BiodataRecord;
  onChange: (record: BiodataRecord) => void;
  onPreview: (record: BiodataRecord) => void;
  onBack: (record: BiodataRecord) => void;
}

export default function EditorScreen({
  record,
  onChange,
  onPreview,
  onBack,
}: Props): React.JSX.Element {
  const [draft, setDraft] = useState<BiodataRecord>(record);

  const update = useCallback(
    (next: BiodataRecord) => {
      const stamped = {...next, updatedAt: Date.now()};
      setDraft(stamped);
      onChange(stamped);
    },
    [onChange],
  );

  const setData = useCallback(
    (patch: Partial<Biodata>) => {
      update({...draft, data: {...draft.data, ...patch}});
    },
    [draft, update],
  );

  const setValue = useCallback(
    (key: string, value: string) => {
      update({
        ...draft,
        data: {...draft.data, values: {...draft.data.values, [key]: value}},
      });
    },
    [draft, update],
  );

  const onPickPhoto = useCallback(async () => {
    try {
      const uri = await pickPhoto();
      if (uri) {
        setData({photo: uri});
      } else {
        Alert.alert(
          'Photo access needed',
          'Allow photo access in Settings to add a profile photo to your biodata.',
        );
      }
    } catch {
      Alert.alert('Could not add photo', 'Please try again.');
    }
  }, [setData]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onBack(draft)}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          accessibilityRole="button"
          accessibilityLabel="Back to home">
          <Text style={styles.headerBtn}>‹ Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit biodata</Text>
        <TouchableOpacity
          onPress={() => onPreview(draft)}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          accessibilityRole="button"
          accessibilityLabel="Preview biodata">
          <Text style={styles.headerBtnStrong}>Preview</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {/* Template picker */}
        <Text style={styles.groupTitle}>Template</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}>
          {templates.map(t => {
            const active = t.id === draft.templateId;
            return (
              <TouchableOpacity
                key={t.id}
                style={[styles.templateChip, active && styles.templateChipActive]}
                onPress={() => update({...draft, templateId: t.id})}
                accessibilityRole="button"
                accessibilityState={{selected: active}}>
                <Text
                  style={[
                    styles.templateName,
                    active && styles.templateNameActive,
                  ]}>
                  {t.name}
                </Text>
                <Text
                  style={[
                    styles.templateDesc,
                    active && styles.templateDescActive,
                  ]}
                  numberOfLines={2}>
                  {t.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Photo */}
        <Text style={styles.groupTitle}>Profile photo</Text>
        <View style={styles.photoRow}>
          {draft.data.photo ? (
            <Image source={{uri: draft.data.photo}} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.photoEmpty]}>
              <Text style={styles.photoEmptyText}>No photo</Text>
            </View>
          )}
          <View style={styles.photoActions}>
            <TouchableOpacity style={styles.smallBtn} onPress={onPickPhoto}>
              <Text style={styles.smallBtnText}>
                {draft.data.photo ? 'Change photo' : 'Add photo'}
              </Text>
            </TouchableOpacity>
            {draft.data.photo ? (
              <TouchableOpacity
                style={styles.smallBtnGhost}
                onPress={() => setData({photo: undefined})}>
                <Text style={styles.smallBtnGhostText}>Remove</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Header invocation */}
        <Text style={styles.groupTitle}>Heading</Text>
        <View style={styles.chipWrap}>
          {headerPresets.map((preset, i) => {
            const active = draft.data.header === preset;
            const label = preset === '' ? 'None' : preset;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.headerChip, active && styles.headerChipActive]}
                onPress={() => setData({header: preset})}>
                <Text
                  style={[
                    styles.headerChipText,
                    active && styles.headerChipTextActive,
                  ]}
                  numberOfLines={1}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Sections */}
        {biodataSections.map(section => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.fields.map(field => (
              <Field
                key={field.key}
                field={field}
                value={draft.data.values[field.key] ?? ''}
                onChange={v => setValue(field.key, v)}
              />
            ))}
          </View>
        ))}

        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.85}
          onPress={() => onPreview(draft)}>
          <Text style={styles.ctaText}>Preview & export PDF</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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

  content: {paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40},
  groupTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.maroon,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 18,
    marginBottom: 10,
  },

  chipRow: {gap: 10, paddingRight: 20},
  templateChip: {
    width: 150,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    padding: 12,
  },
  templateChipActive: {borderColor: C.maroon, backgroundColor: C.goldSoft},
  templateName: {
    fontFamily: serif,
    fontSize: 15,
    fontWeight: '700',
    color: C.ink,
  },
  templateNameActive: {color: C.maroonDark},
  templateDesc: {fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 16},
  templateDescActive: {color: C.maroonDark},

  photoRow: {flexDirection: 'row', alignItems: 'center', gap: 16},
  photo: {
    width: 84,
    height: 105,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: C.gold,
  },
  photoEmpty: {
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: C.line,
  },
  photoEmptyText: {color: C.muted, fontSize: 12},
  photoActions: {gap: 10},
  smallBtn: {
    backgroundColor: C.maroon,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  smallBtnText: {color: '#fff', fontSize: 14, fontWeight: '600'},
  smallBtnGhost: {paddingHorizontal: 4, paddingVertical: 4},
  smallBtnGhostText: {color: C.maroon, fontSize: 14, fontWeight: '600'},

  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  headerChip: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxWidth: '100%',
  },
  headerChipActive: {borderColor: C.maroon, backgroundColor: C.goldSoft},
  headerChipText: {fontSize: 13, color: C.ink},
  headerChipTextActive: {color: C.maroonDark, fontWeight: '700'},

  section: {marginTop: 22},
  sectionTitle: {
    fontFamily: serif,
    fontSize: 18,
    fontWeight: '700',
    color: C.ink,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.line,
  },

  cta: {
    marginTop: 28,
    backgroundColor: C.maroon,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: {color: '#fff', fontSize: 16.5, fontWeight: '700', letterSpacing: 0.3},
});
