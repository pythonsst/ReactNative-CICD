import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Theme, fontSize, fontWeight, spacing, radius, shadow} from '../theme/theme';
import {portfolio} from '../data/portfolio';
import {Section} from './Section';
import {openUrl} from '../utils/openUrl';

interface Props {
  theme: Theme;
}

const iconMap: Record<string, string> = {
  github: '\u{1F4BB}',
  linkedin: '\u{1F4BC}',
  twitter: '\u{1F426}',
  globe: '\u{1F310}',
  mail: '\u{2709}',
};

export function ContactSection({theme}: Props): React.JSX.Element {
  return (
    <Section title="Let's Connect" theme={theme}>
      <View
        style={[
          styles.card,
          shadow.md,
          {backgroundColor: theme.surface, borderColor: theme.border},
        ]}>
        <Text style={[styles.ctaText, {color: theme.text}]}>
          Interested in working together or just want to say hi?
        </Text>
        <Text style={[styles.ctaSubtext, {color: theme.textMuted}]}>
          I'm always open to discussing new projects, creative ideas, or
          opportunities to be part of your vision.
        </Text>

        <View style={styles.socialsGrid}>
          {portfolio.socials.map(social => {
            const icon = social.icon
              ? iconMap[social.icon] || '\u{1F517}'
              : '\u{1F517}';

            return (
              <TouchableOpacity
                key={social.label}
                onPress={() => openUrl(social.url)}
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: theme.surfaceAlt,
                    borderColor: theme.border,
                  },
                ]}
                activeOpacity={0.7}
                accessibilityRole="link"
                accessibilityLabel={`Open ${social.label}`}>
                <Text style={styles.socialIcon}>{icon}</Text>
                <Text style={[styles.socialLabel, {color: theme.text}]}>
                  {social.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Primary CTA */}
        <TouchableOpacity
          onPress={() => openUrl(`mailto:${portfolio.email}`)}
          style={[styles.ctaButton, {backgroundColor: theme.primary}]}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Send email">
          <Text style={[styles.ctaButtonText, {color: theme.onPrimary}]}>
            {'\u{1F4E7}'} Send me an email
          </Text>
        </TouchableOpacity>
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
  ctaText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  ctaSubtext: {
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  socialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    minWidth: 100,
  },
  socialIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  socialLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  ctaButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
