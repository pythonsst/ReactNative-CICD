import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Theme, fontSize, fontWeight, spacing, radius} from '../../theme/theme';
import {Reveal} from './Reveal';

interface Props {
  title: string;
  /** Small uppercase label shown above the title. */
  eyebrow?: string;
  theme: Theme;
  children: React.ReactNode;
}

/** A titled content block used to structure the portfolio screen. */
export function Section({
  title,
  eyebrow,
  theme,
  children,
}: Props): React.JSX.Element {
  return (
    <View style={styles.container} accessibilityRole="summary">
      <Reveal>
        <View style={styles.header}>
          {eyebrow && (
            <Text style={[styles.eyebrow, {color: theme.accent}]}>
              {eyebrow}
            </Text>
          )}
          <View style={styles.titleRow}>
            <LinearGradient
              colors={theme.brandGradient}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.titleLine}
            />
            <Text style={[styles.title, {color: theme.text}]}>{title}</Text>
          </View>
        </View>
      </Reveal>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  eyebrow: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: spacing.md + 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleLine: {
    width: 4,
    height: 28,
    borderRadius: radius.pill,
    marginRight: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    letterSpacing: -0.3,
  },
});
