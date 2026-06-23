import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Theme, fontSize, fontWeight, spacing, radius, shadow} from '../theme/theme';
import {portfolio, Project} from '../data/portfolio';
import {Section} from './Section';
import {openUrl} from '../utils/openUrl';

interface Props {
  theme: Theme;
}

const iconMap: Record<string, string> = {
  rocket: '\u{1F680}',
  flame: '\u{1F525}',
  star: '\u{2B50}',
  code: '\u{1F4BB}',
  app: '\u{1F4F1}',
};

function ProjectCard({
  project,
  theme,
}: {
  project: Project;
  theme: Theme;
}): React.JSX.Element {
  const icon = project.icon ? iconMap[project.icon] || '\u{1F4E6}' : '\u{1F4E6}';

  const handlePress = () => {
    if (project.url) {
      openUrl(project.url);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!project.url}
      activeOpacity={project.url ? 0.7 : 1}
      accessibilityRole="button"
      accessibilityLabel={`View ${project.name} project`}>
      <View
        style={[
          styles.card,
          shadow.md,
          {backgroundColor: theme.surface, borderColor: theme.border},
        ]}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: theme.surfaceHighlight},
            ]}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.projectName, {color: theme.text}]}>
              {project.name}
            </Text>
            {project.url && (
              <Text style={[styles.linkIndicator, {color: theme.primary}]}>
                {'\u{1F517}'} View Project
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
              style={[styles.tag, {backgroundColor: theme.primarySoft}]}>
              <Text style={[styles.tagText, {color: theme.primary}]}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function ProjectsSection({theme}: Props): React.JSX.Element {
  return (
    <Section title="Featured Projects" theme={theme}>
      <View style={styles.projectsList}>
        {portfolio.projects.map(project => (
          <ProjectCard key={project.name} project={project} theme={theme} />
        ))}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  projectsList: {
    gap: spacing.md,
  },
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
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
    fontWeight: fontWeight.medium,
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
  },
  tagText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
