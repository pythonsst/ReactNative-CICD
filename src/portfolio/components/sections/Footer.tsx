import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Theme, fontSize, fontWeight, spacing} from '../../theme/theme';
import {portfolio} from '../../data/portfolio';
import {openUrl} from '../../utils/openUrl';

interface Props {
  theme: Theme;
}

const CURRENT_YEAR = new Date().getFullYear();

export function Footer({theme}: Props): React.JSX.Element {
  return (
    <View style={[styles.container, {borderTopColor: theme.border}]}>
      {portfolio.footer.lines.map(line => (
        <Text key={line} style={[styles.text, {color: theme.textSubtle}]}>
          {line}
        </Text>
      ))}
      {portfolio.footer.linkUrl ? (
        <TouchableOpacity
          onPress={() => openUrl(portfolio.footer.linkUrl)}
          accessibilityRole="link"
          accessibilityLabel={portfolio.footer.linkLabel}>
          <Text style={[styles.link, {color: theme.primaryLight}]}>
            {portfolio.footer.linkLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
      <Text style={[styles.copyright, {color: theme.textSubtle}]}>
        {'\u{00A9}'} {CURRENT_YEAR} {portfolio.name}
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
