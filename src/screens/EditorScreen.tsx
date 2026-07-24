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
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
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

/** A tiny visual hint of each template's layout — no WebView needed. */
function TemplateThumb({id, active}: {id: string; active: boolean}): React.JSX.Element {
  const tint = active ? C.maroon : C.line;
  if (id === 'modern') {
    return (
      <View style={thumb.page}>
        <View style={[thumb.sidebar, {backgroundColor: active ? C.maroon : '#d9cfc6'}]} />
        <View style={thumb.mainCol}>
          <View style={[thumb.line, {width: '70%', backgroundColor: tint}]} />
          <View style={thumb.lineSm} />
          <View style={thumb.lineSm} />
          <View style={thumb.lineSm} />
        </View>
      </View>
    );
  }
  if (id === 'elegant') {
    return (
      <View style={[thumb.page, thumb.center]}>
        <View style={[thumb.dot, {borderColor: active ? C.gold : '#d9cfc6'}]} />
        <View style={[thumb.line, {width: '55%', backgroundColor: tint, marginTop: 6}]} />
        <View style={[thumb.lineSm, {width: '75%'}]} />
        <View style={[thumb.lineSm, {width: '65%'}]} />
      </View>
    );
  }
  // traditional (default) — double frame
  return (
    <View style={[thumb.page, {borderWidth: 1.5, borderColor: active ? C.maroon : '#d9cfc6', padding: 4}]}>
      <View style={[thumb.frame, {borderColor: active ? C.gold : '#e4d8c8'}]}>
        <View style={[thumb.line, {width: '60%', backgroundColor: tint, alignSelf: 'center'}]} />
        <View style={[thumb.lineSm, {marginTop: 5}]} />
        <View style={thumb.lineSm} />
        <View style={thumb.lineSm} />
      </View>
    </View>
  );
}

export default function EditorScreen({
  record,
  onChange,
  onPreview,
  onBack,
}: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
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
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" backgroundColor={C.canvas} />

      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
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

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            {paddingBottom: insets.bottom + 90},
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Template picker */}
          <Text style={styles.groupTitle}>Choose a template</Text>
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
                  activeOpacity={0.85}
                  onPress={() => update({...draft, templateId: t.id})}
                  accessibilityRole="button"
                  accessibilityState={{selected: active}}>
                  <TemplateThumb id={t.id} active={active} />
                  <Text
                    style={[styles.templateName, active && styles.templateNameActive]}>
                    {t.name}
                  </Text>
                  {active ? <Text style={styles.templateCheck}>✓ Selected</Text> : null}
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
                <Text style={styles.photoEmptyGlyph}>＋</Text>
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
              ) : (
                <Text style={styles.photoHint}>Optional · shown on the biodata</Text>
              )}
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
              <View style={styles.sectionHead}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
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
        </ScrollView>

        {/* Sticky action bar */}
        <View style={[styles.footer, {paddingBottom: insets.bottom + 10}]}>
          <TouchableOpacity
            style={styles.cta}
            activeOpacity={0.9}
            onPress={() => onPreview(draft)}>
            <Text style={styles.ctaText}>Preview & export PDF</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const thumb = StyleSheet.create({
  page: {
    width: 58,
    height: 78,
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e4d8c8',
  },
  center: {alignItems: 'center', paddingTop: 10, paddingHorizontal: 6},
  frame: {flex: 1, borderWidth: 1, padding: 5, justifyContent: 'flex-start'},
  sidebar: {position: 'absolute', left: 0, top: 0, bottom: 0, width: 20},
  mainCol: {marginLeft: 26, marginRight: 6, marginTop: 12, gap: 4},
  line: {height: 4, borderRadius: 2},
  lineSm: {height: 3, borderRadius: 2, backgroundColor: '#e0d6ca', marginTop: 4, width: '90%'},
  dot: {width: 20, height: 20, borderRadius: 10, borderWidth: 2},
});

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
  headerBtn: {color: C.maroon, fontSize: 16, fontWeight: '600'},
  headerBtnStrong: {color: C.maroon, fontSize: 16, fontWeight: '700'},
  headerTitle: {
    fontFamily: serif,
    fontSize: 17,
    fontWeight: '700',
    color: C.ink,
  },

  content: {paddingHorizontal: 20, paddingTop: 14},
  groupTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: C.maroon,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 22,
    marginBottom: 12,
  },

  chipRow: {gap: 12, paddingRight: 20, paddingBottom: 4},
  templateChip: {
    width: 108,
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.line,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  templateChipActive: {borderColor: C.maroon, backgroundColor: '#fff'},
  templateName: {
    fontFamily: serif,
    fontSize: 14.5,
    fontWeight: '700',
    color: C.ink,
  },
  templateNameActive: {color: C.maroonDark},
  templateCheck: {fontSize: 10.5, color: C.maroon, fontWeight: '700', marginTop: 2},

  photoRow: {flexDirection: 'row', alignItems: 'center', gap: 16},
  photo: {
    width: 84,
    height: 105,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: C.gold,
  },
  photoEmpty: {
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: C.line,
    borderStyle: 'dashed',
  },
  photoEmptyGlyph: {color: C.muted, fontSize: 30, fontWeight: '300'},
  photoActions: {gap: 10, flex: 1},
  smallBtn: {
    backgroundColor: C.maroon,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 11,
    alignSelf: 'flex-start',
  },
  smallBtnText: {color: '#fff', fontSize: 14, fontWeight: '700'},
  smallBtnGhost: {alignSelf: 'flex-start', paddingHorizontal: 2},
  smallBtnGhostText: {color: C.maroon, fontSize: 14, fontWeight: '600'},
  photoHint: {color: C.muted, fontSize: 12.5},

  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  headerChip: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    maxWidth: '100%',
  },
  headerChipActive: {borderColor: C.maroon, backgroundColor: C.goldSoft},
  headerChipText: {fontSize: 13, color: C.ink},
  headerChipTextActive: {color: C.maroonDark, fontWeight: '700'},

  section: {marginTop: 26},
  sectionHead: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14},
  sectionAccent: {width: 4, height: 20, borderRadius: 2, backgroundColor: C.gold},
  sectionTitle: {
    fontFamily: serif,
    fontSize: 19,
    fontWeight: '700',
    color: C.ink,
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: C.canvas,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
  },
  cta: {
    backgroundColor: C.maroon,
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: C.maroon,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaText: {color: '#fff', fontSize: 16.5, fontWeight: '700', letterSpacing: 0.3},
});
