/**
 * PortfolioScreen — the entire portfolio experience.
 *
 * Owns the scroll container, the scroll-aware sticky header, and the order of
 * the page sections. Everything it needs lives inside this `portfolio` feature
 * folder (components, data, theme, utils), so the whole feature is portable and
 * self-contained.
 */

import React, {useCallback, useRef} from 'react';
import {
  Animated,
  LayoutChangeEvent,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  RefreshControl,
} from 'react-native';
import {getTheme, spacing} from './theme/theme';
import {
  HeroSection,
  AboutSection,
  SkillsSection,
  ProjectsSection,
  ExperienceSection,
  ContactSection,
  Footer,
  StickyHeader,
} from './components';
import {tapMedium} from './utils/haptics';

export function PortfolioScreen(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = getTheme(isDarkMode);

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const workY = useRef(0);
  const contactY = useRef(0);

  const scrollTo = useCallback((y: number) => {
    tapMedium();
    scrollRef.current?.scrollTo({y: Math.max(y - 12, 0), animated: true});
  }, []);

  const onWorkLayout = (e: LayoutChangeEvent) => {
    workY.current = e.nativeEvent.layout.y;
  };
  const onContactLayout = (e: LayoutChangeEvent) => {
    contactY.current = e.nativeEvent.layout.y;
  };

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  return (
    <View style={[styles.root, {backgroundColor: theme.background}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <StickyHeader
        theme={theme}
        scrollY={scrollY}
        onContact={() => scrollTo(contactY.current)}
      />

      <SafeAreaView style={styles.container}>
        <Animated.ScrollView
          ref={scrollRef as never}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: true},
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }>
          {/* Hero Section - Profile overview */}
          <HeroSection
            theme={theme}
            onContact={() => scrollTo(contactY.current)}
            onWork={() => scrollTo(workY.current)}
          />

          {/* Main content sections */}
          <AboutSection theme={theme} />
          <SkillsSection theme={theme} />
          <View onLayout={onWorkLayout}>
            <ProjectsSection theme={theme} />
          </View>
          <ExperienceSection theme={theme} />
          <View onLayout={onContactLayout}>
            <ContactSection theme={theme} />
          </View>

          {/* Footer */}
          <Footer theme={theme} />
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
});
