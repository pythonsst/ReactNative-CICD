import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {
  Theme,
  fontSize,
  fontWeight,
  spacing,
  radius,
  glow,
} from '../../theme/theme';
import {portfolio} from '../../data/portfolio';
import {resolveIcon} from '../../utils/icons';
import {Section} from '../ui/Section';
import {GlassCard} from '../ui/GlassCard';
import {Reveal} from '../ui/Reveal';
import {PressableScale} from '../ui/PressableScale';
import {openUrl} from '../../utils/openUrl';
import {tapSuccess} from '../../utils/haptics';

interface Props {
  theme: Theme;
}

export function ContactSection({theme}: Props): React.JSX.Element {
  return (
    <Section
      eyebrow={portfolio.sections.contact.eyebrow}
      title={portfolio.sections.contact.title}
      theme={theme}>
      <Reveal>
        <GlassCard theme={theme}>
          <Text style={[styles.ctaText, {color: theme.text}]}>
            {portfolio.contactCard.heading}
          </Text>
          <Text style={[styles.ctaSubtext, {color: theme.textMuted}]}>
            {portfolio.contactCard.subheading}
          </Text>

          <View style={styles.socialsGrid}>
            {portfolio.socials.map(social => {
              const icon = resolveIcon(social.icon, '\u{1F517}');

              return (
                <PressableScale
                  key={social.label}
                  onPress={() => openUrl(social.url)}
                  accessibilityRole="link"
                  accessibilityLabel={`Open ${social.label}`}
                  style={[
                    styles.socialButton,
                    {
                      backgroundColor: theme.surfaceAlt,
                      borderColor: theme.glassBorder,
                    },
                  ]}>
                  <Text style={styles.socialIcon}>{icon}</Text>
                  <Text style={[styles.socialLabel, {color: theme.text}]}>
                    {social.label}
                  </Text>
                </PressableScale>
              );
            })}
          </View>

          {/* Primary CTA */}
          <PressableScale
            haptic={false}
            onPress={() => {
              tapSuccess();
              openUrl(`mailto:${portfolio.email}`);
            }}
            accessibilityLabel={portfolio.contactCard.buttonLabel}>
            <LinearGradient
              colors={theme.brandGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[styles.ctaButton, glow(theme.glowColor)]}>
              <Text style={styles.ctaButtonText}>
                {'\u{2709}\u{FE0F}'}  {portfolio.contactCard.buttonLabel}
              </Text>
            </LinearGradient>
          </PressableScale>
        </GlassCard>
      </Reveal>
    </Section>
  );
}

const styles = StyleSheet.create({
  ctaText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
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
    minWidth: 104,
  },
  socialIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  socialLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  ctaButton: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
});
