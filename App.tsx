/**
 * Portfolio App - Shiv Shankar Tiwari
 *
 * A React Native portfolio showcasing mobile development expertise.
 * Deployed to iOS App Store and Google Play via EAS + GitHub Actions.
 *
 * Repository: https://github.com/pythonsst/ReactNative-CICD
 */

import React, {useCallback, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  RefreshControl,
  Animated,
} from 'react-native';
import {getTheme, spacing} from './src/theme/theme';
import {
  HeroSection,
  AboutSection,
  SkillsSection,
  ProjectsSection,
  ExperienceSection,
  ContactSection,
  Footer,
} from './src/components';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = getTheme(isDarkMode);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Pull-to-refresh simulation (could trigger data reload in the future)
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false}
        )}
        scrollEventThrottle={16}>
        {/* Hero Section - Profile overview */}
        <HeroSection theme={theme} />

        {/* Main content sections */}
        <View style={styles.content}>
          <AboutSection theme={theme} />
          <SkillsSection theme={theme} />
          <ProjectsSection theme={theme} />
          <ExperienceSection theme={theme} />
          <ContactSection theme={theme} />
        </View>

        {/* Footer */}
        <Footer theme={theme} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  content: {
    flex: 1,
  },
});

export default App;
