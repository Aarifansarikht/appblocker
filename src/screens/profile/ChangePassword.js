// src/screens/profile/ChangePassword.tsx
import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Container from '../../layout/Container';
import BackButton from '../../components/buttons/BackButton';
import { CONTAINER_SPACING } from '../../utils/constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Input from '../../components/inputs/Input';
import Button from '../../components/buttons/Button';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useUpdatePasswordMutation } from '../../store/api/authApi';
import { supabase } from '../../supabase/client';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const ChangePassword = () => {
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const clearFieldError = field => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleChangePassword = async () => {
    try {
      setErrors({ currentPassword: '', newPassword: '', confirmPassword: '' });

      // 1. Zod validation
      changePasswordSchema.parse({ currentPassword, newPassword, confirmPassword });

      // 2. Re-authenticate with current password first (Supabase requires this)
      //    Get the current user's email from the active session
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email) throw new Error('No active session');

      const { error: reAuthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (reAuthError) {
        setErrors(prev => ({ ...prev, currentPassword: 'Current password is incorrect' }));
        return;
      }

      // 3. Update to new password
      await updatePassword({ new_password: newPassword }).unwrap();

      Toast.show({ type: 'success', text1: 'Password changed successfully!' });
      navigation.goBack();
    } catch (err) {
      // Zod errors → inline
      if (err instanceof z.ZodError) {
        const fieldErrors = { currentPassword: '', newPassword: '', confirmPassword: '' };
        err.errors.forEach(e => {
          const field = e.path[0];
          if (field in fieldErrors) fieldErrors[field] = e.message;
        });
        setErrors(fieldErrors);
        return;
      }

      // API errors
      const message = err?.error ?? err?.message ?? 'Something went wrong';
      Toast.show({ type: 'error', text1: 'Failed to change password', text2: message });
    }
  };

  return (
    <Container>
      <BackButton title="Change Password" wrapperStyle={{ padding: CONTAINER_SPACING }} />
      <KeyboardAwareScrollView contentContainerStyle={{ paddingHorizontal: CONTAINER_SPACING, flexGrow: 1 }}>
        <View style={{ flex: 1, gap: 15 }}>
          <Input
            label="Current Password"
            placeholder="Enter current password"
            secureEntry
            value={currentPassword}
            onChangeText={text => {
              setCurrentPassword(text);
              clearFieldError('currentPassword');
            }}
            isError={!!errors.currentPassword}
            errorMessage={errors.currentPassword}
          />

          <Input
            label="New Password"
            placeholder="Enter new password"
            secureEntry
            value={newPassword}
            onChangeText={text => {
              setNewPassword(text);
              clearFieldError('newPassword');
            }}
            isError={!!errors.newPassword}
            errorMessage={errors.newPassword}
          />

          <Input
            label="Confirm Password"
            placeholder="Enter confirm password"
            secureEntry
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              clearFieldError('confirmPassword');
            }}
            isError={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword}
          />

          <Button isLoading={isLoading} isDisable={isLoading} title={'Change Password'} onPress={handleChangePassword} />
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({});
