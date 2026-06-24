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
import {Section} from '../ui/Section';
import {GlassCard} from '../ui/GlassCard';
import {Reveal} from '../ui/Reveal';
import {PressableScale} from '../ui/PressableScale';
import {openUrl} from '../../utils/openUrl';
import {tapSuccess} from '../../utils/haptics';

interface Props {
  theme: Theme;
}

const iconMap: Record<string, string> = {
  github: '\u{1F4BB}',
  linkedin: '\u{1F4BC}',
  twitter: '\u{1F426}',
  globe: '\u{1F310}',
  mail: '\u{2709}\u{FE0F}',
};

export function ContactSection({theme}: Props): React.JSX.Element {
  return (
    <Section eyebrow="Say hello" title="Let's Connect" theme={theme}>
      <Reveal>
        <GlassCard theme={theme}>
          <Text style={[styles.ctaText, {color: theme.text}]}>
            Have a project in mind?
          </Text>
          <Text style={[styles.ctaSubtext, {color: theme.textMuted}]}>
            I'm always open to discussing new products, creative ideas, or
            opportunities to be part of your vision.
          </Text>

          <View style={styles.socialsGrid}>
            {portfolio.socials.map(social => {
              const icon = social.icon
                ? iconMap[social.icon] || '\u{1F517}'
                : '\u{1F517}';

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
            accessibilityLabel="Send email">
            <LinearGradient
              colors={theme.brandGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[styles.ctaButton, glow(theme.glowColor)]}>
              <Text style={styles.ctaButtonText}>
                {'\u{2709}\u{FE0F}'}  Send me an email
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
