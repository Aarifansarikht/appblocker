// src/screens/auth/register/Register.tsx
import { Image, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { z } from 'zod';
import Container from '../../../layout/Container';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GoogleAuth from '../methods/GoogleAuth';
import AppleAuth from '../methods/AppleAuth';
import { CONTAINER_SPACING } from '../../../utils/constants';
import { Fonts } from '../../../utils/typography';
import { useTheme } from '../../../context/theme/ThemeContext';
import Button from '../../../components/buttons/Button';
import { useNavigation } from '@react-navigation/native';
import { registerSchema } from '../../../schema/validation';
import { Navigate_Login } from '../../../routes/path';
import { Divider } from '../login/Login';
import Input from '../../../components/inputs/Input';
import Icon from '../../../utils/icons';
import BackButton from '../../../components/buttons/BackButton';
import { ImagePath } from '../../../utils/images';
import Checkbox from '../../../components/inputs/Checkbox';
import { useRegisterMutation } from '../../../store/api/authApi';
import Toast from 'react-native-toast-message';

/**
 * HOW SESSION IS STORED ON REGISTER:
 *
 * 1. useRegisterMutation() calls supabase.auth.signUp()
 * 2. Supabase returns { user, session } on success
 * 3. authApi.extraReducers catches matchFulfilled →
 *    sets state.user, state.session, state.isAuthenticated = true
 * 4. Simultaneously, authListener's onAuthStateChange fires →
 *    calls setSession() which also updates Redux + saves to AsyncStorage
 * 5. RootNavigation reads isAuthenticated → automatically switches
 *    from <AuthNavigator> to <AppNavigator>
 * 6. No navigation.navigate() needed here at all ✅
 */

const Register = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors]       = useState({ email: '', password: '' });

  const [register, { isLoading }] = useRegisterMutation();

  const clearFieldError = (field) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSignUp = async () => {
    try {
      setErrors({ email: '', password: '' });

      // 1. Zod validation
      registerSchema.parse({ email, password });

      // 2. Call Supabase via RTK Query
      //    On success → authSlice.extraReducers.matchFulfilled runs:
      //      state.user    = response.user
      //      state.session = response.session
      //      state.isAuthenticated = true
      //    → authListener.onAuthStateChange also fires and saves session
      //      to AsyncStorage via supabase client (autoRefreshToken + persistSession)
      await register({ email: email.trim(), password, full_name: '' }).unwrap();

      Toast.show({ type: 'success', text1: 'Account Created Successfully!' });

      // ✅ DO NOT call navigation.navigate() here
      // RootNavigation watches isAuthenticated in Redux and
      // automatically renders <AppNavigator> when it becomes true

    } catch (err) {
      // Zod errors → show inline field errors
      if (err instanceof z.ZodError) {
        const fieldErrors = { email: '', password: '' };
        err.errors.forEach(e => {
          if (e.path[0] === 'email')    fieldErrors.email    = e.message;
          if (e.path[0] === 'password') fieldErrors.password = e.message;
        });
        setErrors(fieldErrors);
        return;
      }

      // Supabase API errors
      const message = err?.data?.message || err?.error || err?.message || 'Something went wrong';

      if (message.toLowerCase().includes('already registered')) {
        Toast.show({ type: 'error', text1: 'Email already in use', text2: 'Please sign in instead.' });
      } else if (message.toLowerCase().includes('rate limit')) {
        Toast.show({ type: 'error', text1: 'Too Many Attempts', text2: 'Please wait a few minutes.' });
      } else {
        Toast.show({ type: 'error', text1: 'Registration Failed', text2: message });
      }
    }
  };

  return (
    <Container>
      <BackButton wrapperStyle={{ paddingHorizontal: CONTAINER_SPACING, paddingTop: CONTAINER_SPACING }} />
      <KeyboardAwareScrollView contentContainerStyle={{ paddingHorizontal: CONTAINER_SPACING, flexGrow: 1 }}>
        <View style={{ padding: 30, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={ImagePath.greenLogo} style={{ width: 85, height: 85 }} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 25, fontFamily: Fonts.primary_Medium, color: colors.blackPrimary, marginBottom: 30, textAlign: 'center' }}>
            Create Your Account
          </Text>

          <Input
            label="Email*"
            placeholder="example@gmail.com"
            wrapperStyle={{ marginBottom: 15 }}
            leftIcon={<Icon name="mail" color={colors.placeholderText} size={18} />}
            value={email}
            onChangeText={text => { setEmail(text); clearFieldError('email'); }}
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
            onChangeText={text => { setPassword(text); clearFieldError('password'); }}
            isError={!!errors.password}
            errorMessage={errors.password}
          />

          {/* <View style={{ marginBottom: 20, alignItems: 'center' }}>
            <Checkbox label="Remember me" value={rememberMe} onChange={setRememberMe} />
          </View> */}

          <Button isLoading={isLoading} isDisable={isLoading} title={'Sign Up'} onPress={handleSignUp} disabled={isLoading} />

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

export default Register;
const styles = StyleSheet.create({});
