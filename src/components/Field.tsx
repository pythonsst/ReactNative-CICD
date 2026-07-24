import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardTypeOptions,
} from 'react-native';
import {C, serif} from '../theme';
import type {FieldDef} from '../data/biodata';

interface Props {
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
}

const keyboardFor = (type?: string): KeyboardTypeOptions => {
  switch (type) {
    case 'tel':
      return 'phone-pad';
    case 'email':
      return 'email-address';
    default:
      return 'default';
  }
};

export default function Field({field, value, onChange}: Props): React.JSX.Element {
  const [pickerOpen, setPickerOpen] = useState(false);
  const isTextarea = field.type === 'textarea';
  const isSelect = field.type === 'select';
  const hint =
    field.type === 'date'
      ? 'YYYY-MM-DD'
      : field.type === 'time'
      ? 'HH:MM'
      : field.placeholder;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{field.label}</Text>

      {isSelect ? (
        <>
          <TouchableOpacity
            style={styles.input}
            activeOpacity={0.7}
            onPress={() => setPickerOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={`${field.label}: ${value || 'not set'}`}>
            <Text style={value ? styles.selectValue : styles.selectPlaceholder}>
              {value || 'Select…'}
            </Text>
            <Text style={styles.chev}>▾</Text>
          </TouchableOpacity>

          <Modal
            visible={pickerOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setPickerOpen(false)}>
            <Pressable
              style={styles.backdrop}
              onPress={() => setPickerOpen(false)}>
              <Pressable style={styles.sheet}>
                <Text style={styles.sheetTitle}>{field.label}</Text>
                <ScrollView>
                  {field.options?.map(opt => (
                    <TouchableOpacity
                      key={opt}
                      style={styles.option}
                      onPress={() => {
                        onChange(opt);
                        setPickerOpen(false);
                      }}>
                      <Text
                        style={[
                          styles.optionText,
                          opt === value && styles.optionActive,
                        ]}>
                        {opt}
                      </Text>
                      {opt === value ? (
                        <Text style={styles.check}>✓</Text>
                      ) : null}
                    </TouchableOpacity>
                  ))}
                  {value ? (
                    <TouchableOpacity
                      style={styles.option}
                      onPress={() => {
                        onChange('');
                        setPickerOpen(false);
                      }}>
                      <Text style={styles.clearText}>Clear</Text>
                    </TouchableOpacity>
                  ) : null}
                </ScrollView>
              </Pressable>
            </Pressable>
          </Modal>
        </>
      ) : (
        <TextInput
          style={[styles.input, isTextarea && styles.textarea]}
          value={value}
          onChangeText={onChange}
          placeholder={hint}
          placeholderTextColor={C.muted}
          multiline={isTextarea}
          keyboardType={keyboardFor(field.type)}
          autoCapitalize={field.type === 'email' ? 'none' : 'sentences'}
          autoCorrect={field.type !== 'email'}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {marginBottom: 14},
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: C.ink,
    marginBottom: 6,
  },
  input: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: C.ink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectValue: {fontSize: 15, color: C.ink, flex: 1},
  selectPlaceholder: {fontSize: 15, color: C.muted, flex: 1},
  chev: {color: C.muted, fontSize: 14, marginLeft: 8},

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 30,
    maxHeight: '70%',
  },
  sheetTitle: {
    fontFamily: serif,
    fontSize: 18,
    fontWeight: '700',
    color: C.ink,
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.line,
  },
  optionText: {fontSize: 16, color: C.ink},
  optionActive: {color: C.maroon, fontWeight: '700'},
  check: {color: C.maroon, fontSize: 16, fontWeight: '700'},
  clearText: {fontSize: 16, color: C.muted},
});
