import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Container from '../../../layout/Container';
import BackButton from '../../../components/buttons/BackButton';
import { CONTAINER_SPACING, SCREEN_WIDTH } from '../../../utils/constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ForgotPasswordImage } from '../../../utils/svg';
import { useTheme } from '../../../context/theme/ThemeContext';
import { Fonts } from '../../../utils/typography';
import Button from '../../../components/buttons/Button';
import Input from '../../../components/inputs/Input';
import Icon from '../../../utils/icons';
import Toast from 'react-native-toast-message';
import { supabase } from '../../../supabase/client';



const ForgotPassword = () => {
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Please enter email',
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'myapp://reset-password',
      });

      if (error) {
        Toast.show({
          type: 'error',
          text1: error.message,
        });
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Password reset email sent',
      });
    } catch (err) {
  console.log('RESET PASSWORD ERROR =>', err);

  Toast.show({
    type: 'error',
    text1: err?.message || 'Something went wrong',
  });
} finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <BackButton
        title={'Forgot Password'}
        wrapperStyle={{ padding: CONTAINER_SPACING }}
      />

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: CONTAINER_SPACING,
          flexGrow: 1,
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ForgotPasswordImage
            width={SCREEN_WIDTH - 30}
            height={SCREEN_WIDTH - 120}
          />
        </View>

        <View style={{ marginBottom: 25 }}>
          <Text
            style={{
              fontSize: 15,
              color: colors.blackPrimary,
              fontFamily: Fonts.primary_Regular,
            }}
          >
            Enter your email to reset password
          </Text>
        </View>

        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={
            <Icon
              name="mail"
              size={20}
              color={colors.blackPrimary}
            />
          }
        />
      </KeyboardAwareScrollView>

      <Button
        loading={loading}
        title="Send Reset Link"
        onPress={handleResetPassword}
        wrapperStyle={{
          padding: CONTAINER_SPACING,
        }}
      />
    </Container>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({});