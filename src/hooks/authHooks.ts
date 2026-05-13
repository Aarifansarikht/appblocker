// src/screens/auth/LoginWithPassword.tsx
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLoginWithPasswordMutation } from '../store/api/authApi';

/**
 * Drop-in replacement for the existing LoginWithID screen.
 * Shows how to consume the RTK Query auth endpoint.
 */
const LoginWithPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginWithPassword, { isLoading, error }] = useLoginWithPasswordMutation();

  const handleLogin = async () => {
    try {
      await loginWithPassword({ email: email.trim(), password }).unwrap();
      // Navigation handled by auth state listener — no manual navigate needed
    } catch (err: any) {
      Alert.alert('Login failed', err?.error ?? 'Please try again');
    }
  };

  // Return your existing JSX — wire email/password state and handleLogin
  return null;
};

export default LoginWithPassword;


// ─────────────────────────────────────────────────────────────────────────────
// src/screens/auth/RegisterScreen.tsx
import { useRegisterMutation } from '../store/api/authApi';

export const useRegister = () => {
  const [register, { isLoading, error }] = useRegisterMutation();

  const handleRegister = async (
    email: string,
    password: string,
    full_name: string,
    username: string
  ) => {
    await register({ email, password, full_name, username }).unwrap();
  };

  return { handleRegister, isLoading, error };
};


// ─────────────────────────────────────────────────────────────────────────────
// src/screens/auth/GoogleAuth.tsx  (wired version)
import { useLoginWithGoogleMutation } from '../store/api/authApi';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const useGoogleAuth = () => {
  const [loginWithGoogle, { isLoading }] = useLoginWithGoogleMutation();

  const handleGoogleLogin = async () => {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const { idToken } = await GoogleSignin.getTokens();
    if (!idToken) throw new Error('No ID token from Google');
    await loginWithGoogle({ idToken }).unwrap();
  };

  return { handleGoogleLogin, isLoading };
};


// ─────────────────────────────────────────────────────────────────────────────
// src/screens/auth/AppleAuth.tsx  (wired version)
import * as AppleAuthentication from 'expo-apple-authentication';
import { useLoginWithAppleMutation } from '../store/api/authApi';

export const useAppleAuth = () => {
  const [loginWithApple, { isLoading }] = useLoginWithAppleMutation();

  const handleAppleLogin = async () => {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (!credential.identityToken) throw new Error('No identity token from Apple');
    await loginWithApple({
      idToken: credential.identityToken,
      nonce: credential.authorizationCode ?? '',
    }).unwrap();
  };

  return { handleAppleLogin, isLoading };
};


// ─────────────────────────────────────────────────────────────────────────────
// src/screens/auth/OTPVerification.tsx  (wired version)
import { useVerifyOtpMutation } from '../store/api/authApi';

export const useOtpVerification = (email: string) => {
  const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation();

  const handleVerify = async (token: string) => {
    await verifyOtp({ email, token, type: 'recovery' }).unwrap();
  };

  return { handleVerify, isLoading, error };
};


// ─────────────────────────────────────────────────────────────────────────────
// src/screens/auth/ResetPassword.tsx  (wired version)
import { useUpdatePasswordMutation } from '../store/api/authApi';

export const useResetPassword = () => {
  const [updatePassword, { isLoading, error, isSuccess }] = useUpdatePasswordMutation();

  const handleReset = async (newPassword: string) => {
    await updatePassword({ new_password: newPassword }).unwrap();
  };

  return { handleReset, isLoading, error, isSuccess };
};