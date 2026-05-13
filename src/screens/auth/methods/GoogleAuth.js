import { View, Alert, StyleSheet } from 'react-native';
import { GoogleIcon } from '../../../utils/svg';
import { Fonts } from '../../../utils/typography';
import { MethodsButton } from './MethodsButton';
import { useNavigation } from '@react-navigation/native';
import { Navigate_Bottom } from '../../../routes/path';

import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux';
import { setSession } from '../../../store';
import { supabase } from '../../../supabase/client';


GoogleSignin.configure({
  webClientId: '553256550288-uqr417b2mfvuql8f1mvo6jgkg6idbl7i.apps.googleusercontent.com', // Web client ID from Google Cloud Console
  scopes: ['profile', 'email'],
});

const GoogleAuth = ({ type }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

 const handleGoogleSignIn = async () => {
    try {
      // 1. Check Play Services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // 2. Sign out first — forces account picker to show every time
      await GoogleSignin.signOut();

      // 3. Open native Google account picker popup
      const userInfo = await GoogleSignin.signIn();

      // 4. Get idToken
      const idToken = userInfo?.data?.idToken ?? userInfo?.idToken;
      if (!idToken) throw new Error('No ID token received from Google');

      // 5. Pass idToken to Supabase
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) throw error;

      // 6. Sync session to Redux
      if (data?.session) {
        dispatch(setSession(data.session));
      }

      // 7. Navigate into the app
      navigation.navigate(Navigate_Bottom);

    } catch (err) {
      if (
        err.code === statusCodes.SIGN_IN_CANCELLED ||
        err.code === statusCodes.IN_PROGRESS
      ) {
        return;
      }

      if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Google Play Services required', 'Please update Google Play Services and try again.');
        return;
      }

      console.error('Google sign-in error:', err);
      Alert.alert('Sign-in failed', err.message ?? 'Please try again.');
    }
  };

  return (
    <View>
      <MethodsButton title="Google" type={type} onPress={handleGoogleSignIn}>
        <GoogleIcon />
      </MethodsButton>
    </View>
  );
};

export default GoogleAuth;

const styles = StyleSheet.create({
  labels: {
    fontFamily: Fonts.primary_Medium,
    fontSize: 16,
    textAlign: 'center',
  },
});