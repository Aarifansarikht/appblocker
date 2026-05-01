import {
  LogBox,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ThemeProvider from './src/context/theme/ThemeContext';
import RootNavigation from './src/routes/RootNavigation';

import { AppBlockerProvider } from './src/context/AppBlockerContext';

const App = () => {

 useEffect(() => {
  setTimeout(() => {
    SplashScreen.hide();
  }, 500);
}, []);
  if (Text.defaultProps == null) Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
  if (TextInput.defaultProps == null) TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
  if (TouchableOpacity.defaultProps == null) TouchableOpacity.defaultProps = {};
  TouchableOpacity.defaultProps.activeOpacity = 0.8;
  LogBox.ignoreAllLogs();
  return (
    <ThemeProvider>
      <AppBlockerProvider>
        <NavigationContainer>
          <RootNavigation />
        </NavigationContainer>
      </AppBlockerProvider>
    </ThemeProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
