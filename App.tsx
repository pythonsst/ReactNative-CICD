import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Config from 'react-native-config';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // Get the API URL from the environment configuration
  const apiUrl = Config.API_URL;

  // Function to handle button press
  const handleLearnMorePress = async () => {
    const url = 'https://www.educatorslabs.com/';
    // Check if the URL can be opened
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Open the URL in the default browser
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to open URL');
    }
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to IgniteKit!</Text>
        <Text style={styles.subtitle}>Current Environment:</Text>
        <Text style={styles.apiUrl}>{apiUrl}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLearnMorePress()}>
          <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: 'gray',
    marginBottom: 4,
    textAlign: 'center',
  },
  apiUrl: {
    fontSize: 16,
    color: '#007AFF',
    fontStyle: 'italic',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: '#E6F7FF',
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    backgroundColor: '#6366F1',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
