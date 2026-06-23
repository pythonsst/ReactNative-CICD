import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, fontSize, fontWeight, spacing, radius, shadow} from '../theme/theme';
import {portfolio, SkillGroup} from '../data/portfolio';
import {Section} from './Section';

interface Props {
  theme: Theme;
}

const iconMap: Record<string, string> = {
  phone: '\u{1F4F1}',
  code: '\u{1F4BB}',
  cloud: '\u{2601}',
  tools: '\u{1F527}',
};

function SkillCard({
  group,
  theme,
}: {
  group: SkillGroup;
  theme: Theme;
}): React.JSX.Element {
  const icon = group.icon ? iconMap[group.icon] || '\u{2728}' : '\u{2728}';

  return (
    <View
      style={[
        styles.card,
        shadow.sm,
        {backgroundColor: theme.surface, borderColor: theme.border},
      ]}>
      <View style={styles.cardHeader}>
        <View
          style={[styles.iconContainer, {backgroundColor: theme.primarySoft}]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={[styles.cardTitle, {color: theme.text}]}>
          {group.title}
        </Text>
      </View>
      <View style={styles.skillsContainer}>
        {group.items.map(skill => (
          <View
            key={skill}
            style={[styles.skillTag, {backgroundColor: theme.surfaceAlt}]}>
            <Text style={[styles.skillText, {color: theme.textMuted}]}>
              {skill}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function SkillsSection({theme}: Props): React.JSX.Element {
  return (
    <Section title="Skills & Expertise" theme={theme}>
      <View style={styles.grid}>
        {portfolio.skills.map(group => (
          <SkillCard key={group.title} group={group} theme={theme} />
        ))}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.md,
  },
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    flex: 1,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skillTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
  },
  skillText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
