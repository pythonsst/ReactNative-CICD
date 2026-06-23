import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, fontSize, fontWeight, spacing} from '../theme/theme';

interface Props {
  title: string;
  theme: Theme;
  children: React.ReactNode;
}

/** A titled content block used to structure the portfolio screen. */
export function Section({title, theme, children}: Props): React.JSX.Element {
  return (
    <View style={styles.container} accessibilityRole="summary">
      <View style={styles.titleRow}>
        <View style={[styles.titleLine, {backgroundColor: theme.primary}]} />
        <Text style={[styles.title, {color: theme.text}]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  titleLine: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
  },
});
