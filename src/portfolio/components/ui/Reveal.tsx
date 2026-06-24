import React, {useEffect, useRef} from 'react';
import {Animated, Easing, ViewStyle} from 'react-native';

interface Props {
  children: React.ReactNode;
  /** Stagger delay in ms — pass index * 80 for a cascading list. */
  delay?: number;
  /** Initial vertical offset before settling. */
  offset?: number;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Fade + slide-up entrance animation that plays once on mount.
 * Uses the built-in Animated API (no native config required) and the
 * native driver for smooth 60fps transforms.
 */
export function Reveal({
  children,
  delay = 0,
  offset = 24,
  style,
}: Props): React.JSX.Element {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 620,
      delay,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, delay]);

  return (
    <Animated.View
      style={[
        style as ViewStyle,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [offset, 0],
              }),
            },
          ],
        },
      ]}>
      {children}
    </Animated.View>
  );
}
