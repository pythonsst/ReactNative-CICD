import {Platform} from 'react-native';

// SnapBiodata brand palette (matches the web app: warm maroon + gold wedding theme).
export const C = {
  canvas: '#faf6f2',
  surface: '#ffffff',
  ink: '#2a2025',
  muted: '#7c7077',
  line: '#ece3da',
  maroon: '#9b1c3a',
  maroonDark: '#7d1530',
  gold: '#c79a3a',
  goldSoft: '#f3e7c8',
  navy: '#1f2a44',
  navyDark: '#16203a',
};

export const serif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

// On large screens (iPad) content is capped to a readable, centered column
// instead of stretching edge-to-edge. Used by every screen's content wrapper.
export const MAX_CONTENT_WIDTH = 620;

