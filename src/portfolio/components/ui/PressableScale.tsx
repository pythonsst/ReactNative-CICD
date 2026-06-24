import React, {useRef} from 'react';
import {Animated, Pressable, ViewStyle} from 'react-native';
import {tapLight} from '../../utils/haptics';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  /** Trigger a light haptic on press-in. Defaults to true. */
  haptic?: boolean;
  /** How far to scale down while pressed. */
  scaleTo?: number;
  style?: ViewStyle | ViewStyle[];
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link';
}

/**
 * A pressable that scales + dims slightly on press for a tactile, premium
 * feel, with an optional light haptic. Uses the native driver for 60fps.
 */
export function PressableScale({
  children,
  onPress,
  disabled = false,
  haptic = true,
  scaleTo = 0.96,
  style,
  accessibilityLabel,
  accessibilityRole = 'button',
}: Props): React.JSX.Element {
  const scale = useRef(new Animated.Value(1)).current;
  const animatedStyle = {transform: [{scale}]};

  const animate = (to: number) =>
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => {
        if (disabled) {
          return;
        }
        if (haptic) {
          tapLight();
        }
        animate(scaleTo);
      }}
      onPressOut={() => animate(1)}
      onPress={onPress}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}>
      <Animated.View style={[style as ViewStyle, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
