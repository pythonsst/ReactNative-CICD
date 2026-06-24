import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Image, StyleSheet, Text, View} from 'react-native';
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
import {Reveal} from '../ui/Reveal';
import {PressableScale} from '../ui/PressableScale';

interface Props {
  theme: Theme;
  onContact: () => void;
  onWork: () => void;
}

export function HeroSection({
  theme,
  onContact,
  onWork,
}: Props): React.JSX.Element {
  const initials = portfolio.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2);

  // Slow, looping pulse for the ambient glow blobs.
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 4200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 4200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const blobAScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.18],
  });
  const blobBScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1.15, 0.92],
  });
  const blobOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0.7],
  });

  return (
    <View style={styles.wrapper}>
      {/* Ambient gradient backdrop */}
      <LinearGradient
        colors={theme.heroGradient}
        start={{x: 0.1, y: 0}}
        end={{x: 0.9, y: 1}}
        style={styles.backdrop}
      />
      {/* Soft animated glow blobs */}
      <Animated.View
        style={[
          styles.blob,
          styles.blobTop,
          {
            backgroundColor: theme.glowColor,
            opacity: blobOpacity,
            transform: [{scale: blobAScale}],
          },
        ]}
        pointerEvents="none"
      />
      <Animated.View
        style={[
          styles.blob,
          styles.blobBottom,
          {opacity: blobOpacity, transform: [{scale: blobBScale}]},
        ]}
        pointerEvents="none"
      />

      <View style={styles.container}>
        {/* Availability badge */}
        <Reveal delay={40}>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: theme.glass, borderColor: theme.glassBorder},
            ]}>
            <View style={[styles.statusDot, {backgroundColor: theme.success}]} />
            <Text style={[styles.statusText, {color: theme.textMuted}]}>
              Available for select work
            </Text>
          </View>
        </Reveal>

        {/* Avatar with gradient ring */}
        <Reveal delay={120}>
          <LinearGradient
            colors={theme.brandGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={[styles.avatarRing, glow(theme.glowColor)]}>
            <View
              style={[
                styles.avatarInner,
                {backgroundColor: theme.backgroundElevated},
              ]}>
              {portfolio.avatarUrl ? (
                <Image
                  source={{uri: portfolio.avatarUrl}}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={[styles.avatarText, {color: theme.text}]}>
                  {initials}
                </Text>
              )}
            </View>
          </LinearGradient>
        </Reveal>

        {/* Name */}
        <Reveal delay={200}>
          <Text style={[styles.name, {color: theme.text}]}>
            {portfolio.name}
          </Text>
        </Reveal>

        {/* Title */}
        <Reveal delay={260}>
          <Text style={[styles.title, {color: theme.primaryLight}]}>
            {portfolio.title}
          </Text>
        </Reveal>

        {/* Location */}
        <Reveal delay={320}>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>{'\u{1F4CD}'}</Text>
            <Text style={[styles.locationText, {color: theme.textSubtle}]}>
              {portfolio.location}
            </Text>
          </View>
        </Reveal>

        {/* Tagline */}
        <Reveal delay={380}>
          <Text style={[styles.tagline, {color: theme.textMuted}]}>
            {portfolio.tagline}
          </Text>
        </Reveal>

        {/* CTA buttons */}
        <Reveal delay={440}>
          <View style={styles.ctaRow}>
            <PressableScale
              onPress={onContact}
              accessibilityLabel="Get in touch">
              <LinearGradient
                colors={theme.brandGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[styles.ctaPrimary, glow(theme.glowColor)]}>
                <Text style={styles.ctaPrimaryText}>Get in touch</Text>
              </LinearGradient>
            </PressableScale>
            <PressableScale onPress={onWork} accessibilityLabel="View my work">
              <View
                style={[
                  styles.ctaSecondary,
                  {
                    backgroundColor: theme.glass,
                    borderColor: theme.glassBorder,
                  },
                ]}>
                <Text style={[styles.ctaSecondaryText, {color: theme.text}]}>
                  View work
                </Text>
              </View>
            </PressableScale>
          </View>
        </Reveal>

        {/* Stats row */}
        <Reveal delay={520}>
          <View
            style={[
              styles.statsCard,
              {backgroundColor: theme.glass, borderColor: theme.glassBorder},
            ]}>
            {portfolio.highlights.map((stat, index) => (
              <React.Fragment key={stat.label}>
                {index > 0 && (
                  <View
                    style={[styles.divider, {backgroundColor: theme.border}]}
                  />
                )}
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, {color: theme.text}]}>
                    {stat.value}
                  </Text>
                  <Text style={[styles.statLabel, {color: theme.textSubtle}]}>
                    {stat.label}
                  </Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </Reveal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  blob: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  blobTop: {
    top: -120,
    right: -90,
  },
  blobBottom: {
    bottom: -140,
    left: -110,
    backgroundColor: 'rgba(34, 211, 238, 0.25)',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.xl,
    paddingBottom: spacing.xxl,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.3,
  },
  avatarRing: {
    width: 124,
    height: 124,
    borderRadius: 62,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  avatarInner: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.black,
    letterSpacing: 1,
  },
  name: {
    fontSize: fontSize.display,
    fontWeight: fontWeight.black,
    textAlign: 'center',
    letterSpacing: -1,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingHorizontal: spacing.sm,
    maxWidth: 380,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  ctaPrimary: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
  },
  ctaPrimaryText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  ctaSecondary: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  ctaSecondaryText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignSelf: 'stretch',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 32,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
