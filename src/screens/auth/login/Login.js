import { Image, StyleSheet, Text, View } from 'react-native';
import Container from '../../../layout/Container';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LoginImage } from '../../../utils/svg';
import GoogleAuth from '../methods/GoogleAuth';
import FacebookAuth from '../methods/FacebookAuth';
import AppleAuth from '../methods/AppleAuth';
import { CONTAINER_SPACING, SCREEN_WIDTH } from '../../../utils/constants';
import { Fonts } from '../../../utils/typography';
import { useTheme } from '../../../context/theme/ThemeContext';
import Button from '../../../components/buttons/Button';
import { useNavigation } from '@react-navigation/native';
import { Navigate_Bottom, Navigate_Login_With_ID, Navigate_Register } from '../../../routes/path';

import { ImagePath } from '../../../utils/images';
import Spacer from '../../../components/shared/Spacer';
import { continueAsGuest, useSignInAsGuestMutation } from '../../../store';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';

export const Divider = ({ label }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}
    >
      <View style={{ flex: 1, height: 1, backgroundColor: colors.borderColor }} />
      <Text
        style={{
          fontFamily: Fonts.primary_Medium,
          color: colors.paragraph,
          fontSize: 13,
        }}
      >
        {label}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.borderColor }} />
    </View>
  );
};

const Login = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const handleGuestLogin = () => {
    dispatch(continueAsGuest());
    navigation.navigate(Navigate_Bottom);
    // RootNavigation sees isGuest=true → renders AppNavigator instantly
    // No API call, no loading, no error possible
  };

  return (
    <Container>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingHorizontal: CONTAINER_SPACING,
          flexGrow: 1,
        }}
      >
        <View
          style={{
            padding: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={ImagePath.greenLogo}
            style={{
              width: SCREEN_WIDTH - 160,
              height: SCREEN_WIDTH - 160,
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 36,
              fontFamily: Fonts.primary_Bold,
              color: colors.accent,
              marginBottom: 30,
              textAlign: 'center',
            }}
          >
            ScreenToSkill
          </Text>
          <View style={{ flexDirection: 'column', gap: 10, marginBottom: '10%' }}>
            {/* <FacebookAuth /> */}
            <GoogleAuth />
            <AppleAuth />
          </View>
          <Divider label={'or'} />
          <View style={{ marginBottom: '10%' }} />
          <Button title="Sign in with password" onPress={() => navigation.navigate(Navigate_Login_With_ID)} />
          <Spacer space={'2%'} />
          {/* <Button
            title={ 'Continue as Guest'}
            onPress={handleGuestLogin}
      
            buttonStyle={{ backgroundColor: colors.blackPrimary }}
          /> */}
          <View style={{ marginBottom: '10%' }} />
          <Text
            style={{
              fontSize: 15,
              textAlign: 'center',
              fontFamily: Fonts.primary_Medium,
              color: colors.inactiveTintColor,
            }}
          >
            Don't have an account ?{' '}
            <Text style={{ color: colors.blackPrimary }} onPress={() => navigation.navigate(Navigate_Register)}>
              Sign Up
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default Login;

const styles = StyleSheet.create({});
