// src/screens/profile/EditProfile.tsx
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Container from '../../layout/Container';
import BackButton from '../../components/buttons/BackButton';
import { CONTAINER_SPACING } from '../../utils/constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Input from '../../components/inputs/Input';
import Button from '../../components/buttons/Button';
import Icon from '../../utils/icons';
import { useNavigation } from '@react-navigation/native';
import { Navigate_changePassword } from '../../routes/path';
import { useTheme } from '../../context/theme/ThemeContext';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../hooks/useAuth';
import { useUpdateProfileMutation } from '../../store/api/profileApi';
import { useUploadAvatarMutation } from '../../store/api/storageApi';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const EditProfile = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const { userId, email, fullName, avatarUrl } = useAuth();

  const [name, setName] = useState(fullName ?? '');
  const [localAvatar, setLocalAvatar] = useState(null);

  useEffect(() => {
    if (fullName) setName(fullName);
  }, [fullName, userId]);

  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();
  const [uploadAvatar, { isLoading: uploading }] = useUploadAvatarMutation();

  const displayAvatar = localAvatar ?? avatarUrl ?? 'https://cdn-icons-png.magnific.com/512/4122/4122823.png';

  const initials = (name || email || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handlePickImage = () => {
    Alert.alert('Update Profile Photo', 'Choose an option', [
      { text: 'Take Photo', onPress: openCamera },
      { text: 'Choose from Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openCamera = () => {
    launchCamera({ mediaType: 'photo', quality: 0.8, saveToPhotos: false }, handleImageResponse);
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8, selectionLimit: 1 }, handleImageResponse);
  };

  const handleImageResponse = async response => {
    if (response.didCancel) {
      return;
    }
    if (response.errorCode) {
      return;
    }

    const asset = response.assets?.[0];

    if (!asset?.uri) {
      return;
    }
    if (!userId) {
      Toast.show({ type: 'error', text1: 'Not logged in', text2: 'userId is missing' });
      return;
    }

    setLocalAvatar(asset.uri);

    try {
      const ext = asset.fileName?.split('.').pop() ?? 'jpg';
      const payload = {
        userId,
        uri: asset.uri,
        mimeType: asset.type ?? 'image/jpeg',
        fileExt: ext,
      };

      const result = await uploadAvatar(payload).unwrap();

      Toast.show({ type: 'success', text1: 'Profile photo updated!' });
    } catch (err) {
      setLocalAvatar(null);
      Toast.show({ type: 'error', text1: 'Upload failed', text2: err?.error ?? err?.message });
    }
  };

  // ── Save profile ──────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!userId) {
      Toast.show({ type: 'error', text1: 'Not logged in', text2: 'userId is missing' });
      return;
    }

    try {
      const payload = { userId, updates: { full_name: name.trim() } };

      const result = await updateProfile(payload).unwrap();

      Toast.show({ type: 'success', text1: 'Profile updated!' });
      navigation.goBack();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Update failed', text2: err?.error ?? err?.message });
    }
  };

  return (
    <Container>
      <BackButton title="Edit Profile" wrapperStyle={{ padding: CONTAINER_SPACING }} />
      <KeyboardAwareScrollView contentContainerStyle={{ paddingHorizontal: CONTAINER_SPACING, flexGrow: 1, paddingBottom: CONTAINER_SPACING }}>
        <View style={{ gap: 15, flex: 1 }}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              {displayAvatar ? (
                <Image
                  source={{
                    uri: displayAvatar,
                    cache: 'reload',
                  }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitials}>{initials}</Text>
                </View>
              )}
              {uploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="small" color={colors.whitePrimary} />
                </View>
              )}
              <TouchableOpacity style={styles.cameraBadge} onPress={handlePickImage} activeOpacity={0.8}>
                <Icon name="camera" size={14} color={colors.whitePrimary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarHint}>Tap the camera icon to update photo</Text>
          </View>

          <Input label="Your name" placeholder="Enter name" value={name} onChangeText={setName} />
          <Input label="Your email address" placeholder="Enter Email" value={email ?? ''} editable={false} inputProps={{ style: { opacity: 0.6 } }} />

          <TouchableOpacity onPress={() => navigation.navigate(Navigate_changePassword)}>
            <Input inputProps={{ value: 'Change Password', editable: false }} rightIcon={<Icon name="arrow-forward" size={20} style={{ marginRight: 10 }} />} />
          </TouchableOpacity>

          <Button isLoading={saving} isDisable={saving} title={ 'Save Changes'} onPress={handleSubmit} />
        </View>saving
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default EditProfile;

const makeStyles = colors =>
  StyleSheet.create({
    avatarSection: { alignItems: 'center', paddingTop: 8, paddingBottom: 4 },
    avatarWrapper: { position: 'relative', width: 96, height: 96 },
    avatarImage: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: colors.accent },
    avatarFallback: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: colors.accent + '20',
      borderWidth: 3,
      borderColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarInitials: { fontSize: 30, fontWeight: '700', color: colors.accent, letterSpacing: 1 },
    uploadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 48,
      backgroundColor: 'rgba(0,0,0,0.45)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cameraBadge: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.background,
    },
    avatarHint: { marginTop: 8, fontSize: 12, color: colors.paragraphLight, fontWeight: '500' },
  });
