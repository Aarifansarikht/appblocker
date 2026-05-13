import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';

import Container from '../../../layout/Container';
import BackButton from '../../../components/buttons/BackButton';

import {
  CONTAINER_SPACING,
  SCREEN_WIDTH,
} from '../../../utils/constants';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { ResetPasswordImage } from '../../../utils/svg';

import Input from '../../../components/inputs/Input';
import Button from '../../../components/buttons/Button';

import Icon from '../../../utils/icons';

import { useTheme } from '../../../context/theme/ThemeContext';

import Toast from 'react-native-toast-message';

import { supabase } from '../../../supabase/client';

const ResetPassword = () => {
  const { colors } = useTheme();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Please fill all fields',
      });

      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match',
      });

      return;
    }

    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log('CURRENT SESSION =>', session);

      if (!session) {
        Toast.show({
          type: 'error',
          text1: 'Recovery session expired',
        });

        return;
      }

      const { data, error } = await supabase.auth.updateUser({
        password,
      });

      console.log('UPDATE USER DATA =>', data);
      console.log('UPDATE USER ERROR =>', error);

      if (error) {
        Toast.show({
          type: 'error',
          text1: error.message,
        });

        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Password updated successfully',
      });
    } catch (err) {
      console.log('UPDATE PASSWORD ERROR =>', err);

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
        wrapperStyle={{
          padding: CONTAINER_SPACING,
        }}
        title={'Create New Password'}
      />

      <KeyboardAwareScrollView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ResetPasswordImage
            width={SCREEN_WIDTH - 30}
            height={SCREEN_WIDTH - 120}
          />
        </View>

        <View
          style={{
            paddingHorizontal: CONTAINER_SPACING,
          }}
        >
          <Input
            value={password}
            onChangeText={setPassword}
            secureEntry
            label="New Password"
            placeholder="************"
            wrapperStyle={{
              marginBottom: 20,
            }}
            leftIcon={
              <Icon
                name="lock"
                type="entypo"
                color={colors.blackPrimary}
                size={18}
              />
            }
          />

          <Input
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureEntry
            label="Confirm New Password"
            placeholder="************"
            wrapperStyle={{
              marginBottom: '25%',
            }}
            leftIcon={
              <Icon
                name="lock"
                type="entypo"
                color={colors.blackPrimary}
                size={18}
              />
            }
          />

          <Button
            loading={loading}
            title="Continue"
            onPress={handleUpdatePassword}
          />
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({});