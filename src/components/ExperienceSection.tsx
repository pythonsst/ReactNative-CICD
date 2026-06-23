import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, fontSize, fontWeight, spacing, radius, shadow} from '../theme/theme';
import {portfolio, Experience} from '../data/portfolio';
import {Section} from './Section';

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
        <View
          style={[styles.timelineDot, {backgroundColor: theme.primary}]}
        />
        {!isLast && (
          <View style={[styles.timelineLine, {backgroundColor: theme.border}]} />
        )}
      </View>

      {/* Content */}
      <View
        style={[
          styles.card,
          shadow.sm,
          {backgroundColor: theme.surface, borderColor: theme.border},
        ]}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.role, {color: theme.text}]}>
              {experience.role}
            </Text>
            <Text style={[styles.company, {color: theme.primary}]}>
              {experience.company}
            </Text>
          </View>
          <View style={[styles.periodBadge, {backgroundColor: theme.surfaceAlt}]}>
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
                <Text style={[styles.bullet, {color: theme.primary}]}>
                  {'\u2022'}
                </Text>
                <Text style={[styles.highlightText, {color: theme.textMuted}]}>
                  {highlight}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

export function ExperienceSection({theme}: Props): React.JSX.Element {
  return (
    <Section title="Experience" theme={theme}>
      <View style={styles.timeline}>
        {portfolio.experience.map((exp, index) => (
          <ExperienceCard
            key={`${exp.company}-${exp.role}`}
            experience={exp}
            theme={theme}
            isLast={index === portfolio.experience.length - 1}
          />
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
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: spacing.lg,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: spacing.sm,
  },
  card: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
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
    fontSize: fontSize.md,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  highlightText: {
    flex: 1,
    fontSize: fontSize.sm,
    lineHeight: 22,
  },
});
