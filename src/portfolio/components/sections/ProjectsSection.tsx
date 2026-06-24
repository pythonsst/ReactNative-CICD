import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Theme, fontSize, fontWeight, spacing, radius} from '../../theme/theme';
import {portfolio, Project} from '../../data/portfolio';
import {resolveIcon} from '../../utils/icons';
import {Section} from '../ui/Section';
import {GlassCard} from '../ui/GlassCard';
import {Reveal} from '../ui/Reveal';
import {PressableScale} from '../ui/PressableScale';
import {openUrl} from '../../utils/openUrl';

interface Props {
  theme: Theme;
}

function ProjectCard({
  project,
  theme,
}: {
  project: Project;
  theme: Theme;
}): React.JSX.Element {
  const icon = resolveIcon(project.icon, '\u{1F4E6}');

  const handlePress = () => {
    if (project.url) {
      openUrl(project.url);
    }
  };

  return (
    <PressableScale
      onPress={handlePress}
      disabled={!project.url}
      accessibilityLabel={`View ${project.name} project`}>
      <GlassCard theme={theme}>
        <View style={styles.cardHeader}>
          <LinearGradient
            colors={theme.brandGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </LinearGradient>
          <View style={styles.titleContainer}>
            <Text style={[styles.projectName, {color: theme.text}]}>
              {project.name}
            </Text>
            {project.url && (
              <Text style={[styles.linkIndicator, {color: theme.accent}]}>
                {'\u{2197}\u{FE0F}'} View Project
              </Text>
            )}
          </View>
        </View>

        <Text style={[styles.description, {color: theme.textMuted}]}>
          {project.description}
        </Text>

        <View style={styles.tagsContainer}>
          {project.tags.map(tag => (
            <View
              key={tag}
              style={[
                styles.tag,
                {
                  backgroundColor: theme.primarySoft,
                  borderColor: theme.glassBorder,
                },
              ]}>
              <Text style={[styles.tagText, {color: theme.primaryLight}]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </GlassCard>
    </PressableScale>
  );
}

export function ProjectsSection({theme}: Props): React.JSX.Element {
  return (
    <Section eyebrow="Selected work" title="Featured Projects" theme={theme}>
      <View style={styles.projectsList}>
        {portfolio.projects.map((project, index) => (
          <Reveal key={project.name} delay={index * 90}>
            <ProjectCard project={project} theme={theme} />
          </Reveal>
        ))}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  projectsList: {
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  titleContainer: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  projectName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  linkIndicator: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  description: {
    fontSize: fontSize.md,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  tagText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
