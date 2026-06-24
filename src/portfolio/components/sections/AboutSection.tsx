import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, fontSize, fontWeight, spacing} from '../../theme/theme';
import {portfolio} from '../../data/portfolio';
import {Section} from '../ui/Section';
import {GlassCard} from '../ui/GlassCard';
import {Reveal} from '../ui/Reveal';

interface Props {
  theme: Theme;
}

export function AboutSection({theme}: Props): React.JSX.Element {
  return (
    <Section
      eyebrow={portfolio.sections.about.eyebrow}
      title={portfolio.sections.about.title}
      theme={theme}>
      <Reveal>
        <GlassCard theme={theme}>
          <Text style={[styles.aboutText, {color: theme.textMuted}]}>
            {portfolio.about}
          </Text>
          <View style={[styles.divider, {backgroundColor: theme.border}]} />
          <View style={styles.emailRow}>
            <Text style={[styles.emailLabel, {color: theme.textSubtle}]}>
              {'\u{2709}\u{FE0F}'} {portfolio.actions.contact}
            </Text>
            <Text style={[styles.emailValue, {color: theme.primaryLight}]}>
              {portfolio.email}
            </Text>
          </View>
        </GlassCard>
      </Reveal>
    </Section>
  );
}

const styles = StyleSheet.create({
  aboutText: {
    fontSize: fontSize.md,
    lineHeight: 27,
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
