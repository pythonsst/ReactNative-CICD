import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Theme, radius, shadow, spacing} from '../../theme/theme';

interface Props {
  theme: Theme;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  /** Adds a faint gradient sheen across the top of the card. */
  sheen?: boolean;
  padded?: boolean;
}

/**
 * Frosted "glass" surface used for every card in the portfolio. A subtle
 * gradient sheen + hairline border gives depth on the dark background.
 */
export function GlassCard({
  theme,
  children,
  style,
  sheen = true,
  padded = true,
}: Props): React.JSX.Element {
  return (
    <View
      style={[
        styles.card,
        shadow.md,
        {
          backgroundColor: theme.surface,
          borderColor: theme.glassBorder,
        },
        padded && styles.padded,
        style as ViewStyle,
      ]}>
      {sheen && (
        <LinearGradient
          colors={[
            theme.isDark
              ? 'rgba(255,255,255,0.06)'
              : 'rgba(255,255,255,0.5)',
            'rgba(255,255,255,0)',
          ]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  padded: {
    padding: spacing.lg,
  },
});
