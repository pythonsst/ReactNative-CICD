import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, fontSize, fontWeight, spacing, radius} from '../theme/theme';
import {portfolio} from '../data/portfolio';

interface Props {
  theme: Theme;
}

export function HeroSection({theme}: Props): React.JSX.Element {
  const initials = portfolio.name
    .split(' ')
    .map(n => n[0])
    .join('');

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View
        style={[
          styles.avatarContainer,
          {backgroundColor: theme.primarySoft, borderColor: theme.primary},
        ]}>
        <Text style={[styles.avatarText, {color: theme.primary}]}>
          {initials}
        </Text>
      </View>

      {/* Name & Title */}
      <Text style={[styles.name, {color: theme.text}]}>{portfolio.name}</Text>
      <Text style={[styles.title, {color: theme.primary}]}>
        {portfolio.title}
      </Text>

      {/* Location Badge */}
      <View style={[styles.locationBadge, {backgroundColor: theme.surfaceAlt}]}>
        <Text style={[styles.locationIcon, {color: theme.textMuted}]}>
          {'\u{1F4CD}'}
        </Text>
        <Text style={[styles.locationText, {color: theme.textMuted}]}>
          {portfolio.location}
        </Text>
      </View>

      {/* Tagline */}
      <Text style={[styles.tagline, {color: theme.textMuted}]}>
        {portfolio.tagline}
      </Text>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {portfolio.highlights.map((stat, index) => (
          <View
            key={stat.label}
            style={[
              styles.statItem,
              {backgroundColor: theme.surface, borderColor: theme.border},
              index === portfolio.highlights.length - 1 && styles.statItemLast,
            ]}>
            <Text style={[styles.statValue, {color: theme.primary}]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, {color: theme.textSubtle}]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    marginBottom: spacing.lg,
  },
  avatarText: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
  },
  name: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    marginBottom: spacing.lg,
  },
  locationIcon: {
    fontSize: fontSize.sm,
    marginRight: spacing.xs,
  },
  locationText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  tagline: {
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  statItem: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    minWidth: 80,
  },
  statItemLast: {
    marginRight: 0,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
