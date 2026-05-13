// src/screens/auth/login/LoginWithIdPassword.tsx
import { Image, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import Container from '../../../layout/Container';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GoogleAuth from '../methods/GoogleAuth';
import AppleAuth from '../methods/AppleAuth';
import { CONTAINER_SPACING } from '../../../utils/constants';
import { Fonts } from '../../../utils/typography';
import { useTheme } from '../../../context/theme/ThemeContext';
import Button from '../../../components/buttons/Button';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { Navigate_ForgotPassword, Navigate_Login } from '../../../routes/path';
import { Divider } from '../login/Login';
import Input from '../../../components/inputs/Input';
import Icon from '../../../utils/icons';
import BackButton from '../../../components/buttons/BackButton';
import { ImagePath } from '../../../utils/images';
import Checkbox from '../../../components/inputs/Checkbox';
import { useLoginWithPasswordMutation } from '../../../store/api/authApi';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
const REMEMBER_ME_KEY = 'REMEMBER_ME';
const REMEMBERED_EMAIL_KEY = 'REMEMBERED_EMAIL';
const REMEMBERED_PASSWORD_KEY = 'REMEMBERED_PASSWORD';
/**
 * HOW SESSION IS STORED ON LOGIN:
 *
 * 1. useLoginWithPasswordMutation() calls supabase.auth.signInWithPassword()
 * 2. Supabase returns { user, session } and ALSO stores session in
 *    AsyncStorage automatically (because persistSession: true in client.ts)
 * 3. authSlice.extraReducers matchFulfilled fires →
 *      state.user    = response.user
 *      state.session = response.session
 *      state.isAuthenticated = true
 * 4. authListener.onAuthStateChange fires → calls setSession() (double safety)
 * 5. RootNavigation re-renders → isAuthenticated = true → shows <AppNavigator>
 *
 * ON NEXT APP LAUNCH:
 * 1. AppProviders mounts → initAuthListener() runs
 * 2. supabase.auth.getSession() reads session from AsyncStorage
 * 3. If valid (not expired) → setSession() → isAuthenticated = true
 * 4. User goes directly to app without seeing login screen ✅
 */

const LoginWithIdPassword = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const redirectTo = route.params?.redirectTo;
  const redirectParams = route.params?.redirectParams;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [loginWithPassword, { isLoading }] = useLoginWithPasswordMutation();

  const clearFieldError = field => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleLogin = async () => {
    try {
      setErrors({ email: '', password: '' });

      // Validate form
      loginSchema.parse({
        email: email.trim(),
        password,
      });

      // Login
      await loginWithPassword({
        email: email.trim(),
        password,
      }).unwrap();

      // Remember me storage
      try {
        if (rememberMe) {
          await AsyncStorage.setItem(REMEMBER_ME_KEY, 'true');

          await AsyncStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim());

          await AsyncStorage.setItem(REMEMBERED_PASSWORD_KEY, password);
        } else {
          await AsyncStorage.removeItem(REMEMBER_ME_KEY);

          await AsyncStorage.removeItem(REMEMBERED_EMAIL_KEY);

          await AsyncStorage.removeItem(REMEMBERED_PASSWORD_KEY);
        }
      } catch (storageError) {}

      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
      });

      // RootNavigation switches automatically
    } catch (err) {
      // Zod validation
      if (err instanceof z.ZodError) {
        const fieldErrors = {
          email: '',
          password: '',
        };

        err.errors.forEach(e => {
          if (e.path[0] === 'email') {
            fieldErrors.email = e.message;
          }

          if (e.path[0] === 'password') {
            fieldErrors.password = e.message;
          }
        });

        setErrors(fieldErrors);

        return;
      }

      // API errors
      const message = err?.data?.message || err?.error || err?.message || 'Something went wrong';

      if (message.toLowerCase().includes('invalid login credentials')) {
        Toast.show({
          type: 'error',
          text1: 'Wrong email or password',
          text2: 'Please check and try again.',
        });
      } else if (message.toLowerCase().includes('email not confirmed')) {
        Toast.show({
          type: 'error',
          text1: 'Email not verified',
          text2: 'Please check your inbox.',
        });
      } else if (message.toLowerCase().includes('rate limit')) {
        Toast.show({
          type: 'error',
          text1: 'Too many attempts',
          text2: 'Please wait a few minutes.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: String(message),
        });
      }
    }
  };
  useEffect(() => {
    loadRememberedCredentials();
  }, []);

  const loadRememberedCredentials = async () => {
    try {
      const remember = await AsyncStorage.getItem(REMEMBER_ME_KEY);

      if (remember === 'true') {
        const savedEmail = await AsyncStorage.getItem(REMEMBERED_EMAIL_KEY);

        const savedPassword = await AsyncStorage.getItem(REMEMBERED_PASSWORD_KEY);

        setRememberMe(true);
        setEmail(savedEmail || '');
        setPassword(savedPassword || '');
      } else {
      }
    } catch (error) {
      console.log('Load remembered credentials error:', error);
    }
  };
  return (
    <Container>
      <BackButton wrapperStyle={{ paddingHorizontal: CONTAINER_SPACING, paddingTop: CONTAINER_SPACING }} />
      <KeyboardAwareScrollView
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: CONTAINER_SPACING, flexGrow: 1 }}
      >
        <View style={{ padding: 30, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={ImagePath.greenLogo} style={{ width: 80, height: 80 }} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 25, fontFamily: Fonts.primary_Medium, color: colors.blackPrimary, marginBottom: 20, textAlign: 'center' }}>
            Login to Your Account
          </Text>

          <View style={{ marginBottom: 20 }}>
            <Input
              label="Email*"
              placeholder="example@gmail.com"
              wrapperStyle={{ marginBottom: 15 }}
              leftIcon={<Icon name="mail" color={colors.placeholderText} size={18} />}
              value={email}
              onChangeText={text => {
                setEmail(text);
                clearFieldError('email');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              isError={!!errors.email}
              errorMessage={errors.email}
            />
            <Input
              wrapperStyle={{ marginBottom: 20 }}
              label="Password*"
              placeholder="*********"
              secureEntry
              leftIcon={<Icon name="lock" type="entypo" color={colors.placeholderText} size={18} />}
              value={password}
              onChangeText={text => {
                setPassword(text);
                clearFieldError('password');
              }}
              isError={!!errors.password}
              errorMessage={errors.password}
            />
            <View style={{ marginBottom: 20, alignItems: 'center' }}>
              <Checkbox label="Remember me" isChecked={rememberMe} onPress={() => setRememberMe(prev => !prev)} />
            </View>
            <Button isLoading={isLoading} isDisable={isLoading} title={'Sign In'} onPress={handleLogin} disabled={isLoading} />
          </View>

          <Text
            style={{ fontSize: 12, textAlign: 'center', fontFamily: Fonts.primary_Medium, color: colors.blackPrimary }}
            onPress={() => navigation.navigate(Navigate_ForgotPassword)}
          >
            Forgot the password?
          </Text>

          <View style={{ marginBottom: '5%' }} />
          <Divider label="or continue with" />
          <View style={{ marginBottom: '5%' }} />

          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
            <GoogleAuth type="small" />
            <AppleAuth type="small" />
          </View>

          <View style={{ marginBottom: '5%' }} />
          <Text style={{ fontSize: 15, textAlign: 'center', fontFamily: Fonts.primary_Medium, color: colors.inactiveTintColor }}>
            Already have an account?{' '}
            <Text style={{ color: colors.blackPrimary }} onPress={() => navigation.navigate(Navigate_Login)}>
              Sign In
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default LoginWithIdPassword;
const styles = StyleSheet.create({});
