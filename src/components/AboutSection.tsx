import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, fontSize, fontWeight, spacing, radius, shadow} from '../theme/theme';
import {portfolio} from '../data/portfolio';
import {Section} from './Section';

interface Props {
  theme: Theme;
}

export function AboutSection({theme}: Props): React.JSX.Element {
  return (
    <Section title="About" theme={theme}>
      <View
        style={[
          styles.card,
          shadow.md,
          {backgroundColor: theme.surface, borderColor: theme.border},
        ]}>
        <Text style={[styles.aboutText, {color: theme.text}]}>
          {portfolio.about}
        </Text>
        <View style={[styles.divider, {backgroundColor: theme.border}]} />
        <View style={styles.emailRow}>
          <Text style={[styles.emailLabel, {color: theme.textSubtle}]}>
            {'\u{2709}'} Get in touch
          </Text>
          <Text style={[styles.emailValue, {color: theme.primary}]}>
            {portfolio.email}
          </Text>
        </View>
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
  aboutText: {
    fontSize: fontSize.md,
    lineHeight: 26,
    fontWeight: fontWeight.regular,
  },
  divider: {
    height: 1,
    marginVertical: spacing.lg,
  },
  emailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  emailLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  emailValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});
