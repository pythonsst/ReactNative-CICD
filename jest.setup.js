// Mock the native animated module so `useNativeDriver: true` animations
// don't crash under react-test-renderer (no native bridge in Jest).
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
