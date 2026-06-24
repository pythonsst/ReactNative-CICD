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
import {portfolio, Experience} from '../../data/portfolio';
import {Section} from '../ui/Section';
import {GlassCard} from '../ui/GlassCard';
import {Reveal} from '../ui/Reveal';

interface Props {
  theme: Theme;
}

function ExperienceCard({
  experience,
  theme,
  isLast,
}: {
  experience: Experience;
  theme: Theme;
  isLast: boolean;
}): React.JSX.Element {
  return (
    <View style={styles.cardWrapper}>
      {/* Timeline dot and line */}
      <View style={styles.timelineColumn}>
        <LinearGradient
          colors={theme.brandGradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[styles.timelineDot, glow(theme.glowColor)]}
        />
        {!isLast && (
          <View style={[styles.timelineLine, {backgroundColor: theme.border}]} />
        )}
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <GlassCard theme={theme}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={[styles.role, {color: theme.text}]}>
                {experience.role}
              </Text>
              <Text style={[styles.company, {color: theme.primaryLight}]}>
                {experience.company}
              </Text>
            </View>
            <View
              style={[
                styles.periodBadge,
                {
                  backgroundColor: theme.surfaceAlt,
                  borderColor: theme.glassBorder,
                },
              ]}>
              <Text style={[styles.period, {color: theme.textMuted}]}>
                {experience.period}
              </Text>
            </View>
          </View>

          <Text style={[styles.description, {color: theme.textMuted}]}>
            {experience.description}
          </Text>

          {experience.highlights && experience.highlights.length > 0 && (
            <View style={styles.highlights}>
              {experience.highlights.map((highlight, index) => (
                <View key={index} style={styles.highlightRow}>
                  <Text style={[styles.bullet, {color: theme.accent}]}>
                    {'▸'}
                  </Text>
                  <Text style={[styles.highlightText, {color: theme.textMuted}]}>
                    {highlight}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </GlassCard>
      </View>
    </View>
  );
}

export function ExperienceSection({theme}: Props): React.JSX.Element {
  return (
    <Section eyebrow="Where I've been" title="Experience" theme={theme}>
      <View style={styles.timeline}>
        {portfolio.experience.map((exp, index) => (
          <Reveal key={`${exp.company}-${exp.role}`} delay={index * 90}>
            <ExperienceCard
              experience={exp}
              theme={theme}
              isLast={index === portfolio.experience.length - 1}
            />
          </Reveal>
        ))}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  timeline: {
    gap: spacing.md,
  },
  cardWrapper: {
    flexDirection: 'row',
  },
  timelineColumn: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: spacing.lg,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: spacing.sm,
    minHeight: 24,
  },
  cardContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  headerText: {
    flex: 1,
    minWidth: 150,
  },
  role: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  company: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  periodBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  period: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  description: {
    fontSize: fontSize.md,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  highlights: {
    gap: spacing.sm,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: fontSize.sm,
    marginRight: spacing.sm,
    marginTop: 3,
  },
  highlightText: {
    flex: 1,
    fontSize: fontSize.sm,
    lineHeight: 22,
  },
});
