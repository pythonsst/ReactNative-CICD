// Required for expo-updates OTA asset resolution (images from require() must resolve to CDN URLs)
import 'expo/src/Expo.fx';

import './ReactotronConfig'; // Ensure this is at the top
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
