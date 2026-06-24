import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Theme, fontSize, fontWeight, spacing, radius} from '../../theme/theme';
import {portfolio, SkillGroup} from '../../data/portfolio';
import {resolveIcon} from '../../utils/icons';
import {Section} from '../ui/Section';
import {GlassCard} from '../ui/GlassCard';
import {Reveal} from '../ui/Reveal';

interface Props {
  theme: Theme;
}

function SkillCard({
  group,
  theme,
}: {
  group: SkillGroup;
  theme: Theme;
}): React.JSX.Element {
  const icon = resolveIcon(group.icon);

  return (
    <GlassCard theme={theme}>
      <View style={styles.cardHeader}>
        <LinearGradient
          colors={theme.brandGradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </LinearGradient>
        <Text style={[styles.cardTitle, {color: theme.text}]}>
          {group.title}
        </Text>
      </View>
      <View style={styles.skillsContainer}>
        {group.items.map(skill => (
          <View
            key={skill}
            style={[
              styles.skillTag,
              {
                backgroundColor: theme.surfaceAlt,
                borderColor: theme.glassBorder,
              },
            ]}>
            <Text style={[styles.skillText, {color: theme.textMuted}]}>
              {skill}
            </Text>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

export function SkillsSection({theme}: Props): React.JSX.Element {
  return (
    <Section
      eyebrow={portfolio.sections.skills.eyebrow}
      title={portfolio.sections.skills.title}
      theme={theme}>
      <View style={styles.grid}>
        {portfolio.skills.map((group, index) => (
          <Reveal key={group.title} delay={index * 80}>
            <SkillCard group={group} theme={theme} />
          </Reveal>
        ))}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
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
    fontWeight: fontWeight.bold,
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
    borderWidth: 1,
  },
  skillText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
