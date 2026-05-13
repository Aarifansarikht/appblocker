// src/screens/profile/useProfileScreen.ts
/**
 * Composable hooks for the Profile screen.
 * Shows profile fetch, update, and avatar upload.
 */
import { useGetProfileQuery, useUpdateProfileMutation } from '../store/api/profileApi';
import { useUploadAvatarMutation, useDeleteAvatarMutation } from '../store/api/storageApi';
import { useAppSelector } from '../store/hooks';
import { selectCurrentUser } from '../store/slices/authSlice';
import { launchImageLibrary } from 'react-native-image-picker';

export const useProfileScreen = () => {
  const user = useAppSelector(selectCurrentUser);
  const userId = user?.id ?? '';

  const { data: profile, isLoading: profileLoading } = useGetProfileQuery(userId, {
    skip: !userId,
  });

  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [uploadAvatar, { isLoading: uploading }] = useUploadAvatarMutation();
  const [deleteAvatar] = useDeleteAvatarMutation();

  const handleUpdateProfile = async (updates: {
    full_name?: string;
    username?: string;
    bio?: string;
  }) => {
    if (!userId) return;
    await updateProfile({ userId, updates }).unwrap();
  };

  const handlePickAndUploadAvatar = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    const asset = result.assets?.[0];
    if (!asset?.uri || !userId) return;

    const ext = asset.fileName?.split('.').pop() ?? 'jpg';
    await uploadAvatar({
      userId,
      uri: asset.uri,
      mimeType: asset.type ?? 'image/jpeg',
      fileExt: ext,
    }).unwrap();
  };

  const handleDeleteAvatar = async () => {
    if (!userId) return;
    await deleteAvatar({ userId }).unwrap();
  };

  return {
    profile,
    profileLoading,
    updating,
    uploading,
    handleUpdateProfile,
    handlePickAndUploadAvatar,
    handleDeleteAvatar,
  };
};