import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Theme, fontSize, fontWeight, spacing} from '../../theme/theme';
import {openUrl} from '../../utils/openUrl';

interface Props {
  theme: Theme;
}

const CURRENT_YEAR = new Date().getFullYear();
const REPO_URL = 'https://github.com/pythonsst/ReactNative-CICD';

export function Footer({theme}: Props): React.JSX.Element {
  return (
    <View style={[styles.container, {borderTopColor: theme.border}]}>
      <Text style={[styles.text, {color: theme.textSubtle}]}>
        {'\u{1F4F1}'} Built with React Native
      </Text>
      <Text style={[styles.text, {color: theme.textSubtle}]}>
        {'\u{1F680}'} Deployed via EAS + GitHub Actions
      </Text>
      <TouchableOpacity
        onPress={() => openUrl(REPO_URL)}
        accessibilityRole="link"
        accessibilityLabel="View source code on GitHub">
        <Text style={[styles.link, {color: theme.primaryLight}]}>
          {'\u{2B50}'} Star on GitHub
        </Text>
      </TouchableOpacity>
      <Text style={[styles.copyright, {color: theme.textSubtle}]}>
        {'\u{00A9}'} {CURRENT_YEAR} Shiv Shankar Tiwari
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    borderTopWidth: 1,
    gap: spacing.sm,
  },
  text: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  link: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginVertical: spacing.sm,
  },
  copyright: {
    fontSize: fontSize.xs,
    marginTop: spacing.sm,
  },
});
