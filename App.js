import {
  Linking,
  LogBox,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ThemeProvider from './src/context/theme/ThemeContext';
import RootNavigation from './src/routes/RootNavigation';
import {navigationRef} from './src/routes/NavigationUtil';
import { AppBlockerProvider } from './src/context/AppBlockerContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/services/ToastServices';
import { AppProviders } from './src/providers/AppProviders';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }, []);
  useEffect(() => {
    const handleDeepLink = url => {
      console.log('DEEP LINK URL =>', url);

      if (url.includes('reset-password')) {
        navigationRef.current?.navigate('reset-password');
      }
    };

    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink(url);
      }
    });

    const sub = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => sub.remove();
  }, []);
  if (Text.defaultProps == null) Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
  if (TextInput.defaultProps == null) TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
  if (TouchableOpacity.defaultProps == null) TouchableOpacity.defaultProps = {};
  TouchableOpacity.defaultProps.activeOpacity = 0.8;
  LogBox.ignoreAllLogs();
  return (
    <AppProviders>
      <ThemeProvider>
        <AppBlockerProvider>
          <NavigationContainer ref={navigationRef}>
            <RootNavigation />
          </NavigationContainer>
        </AppBlockerProvider>
        <Toast config={toastConfig} position="top" autoHide={true} />
      </ThemeProvider>
    </AppProviders>
  );
};

export default App;

const styles = StyleSheet.create({});
