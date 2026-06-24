import {Alert, Linking} from 'react-native';

/**
 * Safely open an external URL, surfacing a friendly alert if it can't be opened.
 */
export async function openUrl(url: string): Promise<void> {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Cannot open link', url);
    }
  } catch {
    Alert.alert('Something went wrong', 'Unable to open the link right now.');
  }
}
