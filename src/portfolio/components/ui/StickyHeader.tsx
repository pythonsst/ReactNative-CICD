import React, {useEffect, useRef, useState} from 'react';
import {Animated, Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Theme, fontSize, fontWeight, spacing, radius} from '../../theme/theme';
import {portfolio} from '../../data/portfolio';
import {getInitials} from '../../utils/initials';
import {PressableScale} from './PressableScale';

interface Props {
  theme: Theme;
  scrollY: Animated.Value;
  onContact: () => void;
}

const SHOW_AT = 320;

/** Approximate top safe-area inset without an extra dependency. */
const TOP_INSET =
  Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 50;

/**
 * A compact header that fades + slides in once the user scrolls past the hero,
 * giving quick access to the contact action from anywhere on the page.
 */
export function StickyHeader({
  theme,
  scrollY,
  onContact,
}: Props): React.JSX.Element {
  const opacity = scrollY.interpolate({
    inputRange: [SHOW_AT, SHOW_AT + 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const translateY = scrollY.interpolate({
    inputRange: [SHOW_AT, SHOW_AT + 60],
    outputRange: [-12, 0],
    extrapolate: 'clamp',
  });

  // The header is absolutely positioned over the top of the page even while
  // invisible. Track whether it's shown so we can make it touch-inert when
  // hidden — otherwise it would intercept taps meant for the hero beneath.
  const [shown, setShown] = useState(false);
  const shownRef = useRef(false);
  useEffect(() => {
    const id = scrollY.addListener(({value}) => {
      const next = value > SHOW_AT;
      if (next !== shownRef.current) {
        shownRef.current = next;
        setShown(next);
      }
    });
    return () => scrollY.removeListener(id);
  }, [scrollY]);

  const initials = getInitials(portfolio.name);

  const barStyle = {
    backgroundColor: theme.isDark
      ? 'rgba(7,7,17,0.82)'
      : 'rgba(247,247,252,0.85)',
    borderBottomColor: theme.glassBorder,
  };

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        {paddingTop: TOP_INSET, opacity, transform: [{translateY}]},
      ]}>
      <View
        style={[styles.bar, barStyle]}
        pointerEvents={shown ? 'auto' : 'none'}>
        <View style={styles.left}>
          <LinearGradient
            colors={theme.brandGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.avatar}>
            <View
              style={[
                styles.avatarInner,
                {backgroundColor: theme.backgroundElevated},
              ]}>
              <Text style={[styles.initials, {color: theme.text}]}>
                {initials}
              </Text>
            </View>
          </LinearGradient>
          <Text style={[styles.name, {color: theme.text}]} numberOfLines={1}>
            {portfolio.name}
          </Text>
        </View>

        <PressableScale
          onPress={onContact}
          accessibilityLabel={portfolio.actions.contact}>
          <LinearGradient
            colors={theme.brandGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.cta}>
            <Text style={styles.ctaText}>{portfolio.actions.contact}</Text>
          </LinearGradient>
        </PressableScale>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.extrabold,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    flexShrink: 1,
  },
  cta: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
});
