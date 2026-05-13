// src/store/api/storageApi.ts
import { baseApi } from './baseApi';
import { supabase } from '../../supabase/client';

const AVATAR_BUCKET = 'avatars';

export interface UploadAvatarPayload {
  userId: string;
  uri: string;       // local file URI from image picker
  mimeType?: string; // e.g. 'image/jpeg'
  fileExt?: string;  // e.g. 'jpg'
}

export interface StorageFile {
  publicUrl: string;
  path: string;
}

/**
 * Converts a local file URI to a Uint8Array / ArrayBuffer for upload.
 * Works on both iOS and Android (Expo + bare RN).
 */
async function uriToArrayBuffer(uri: string): Promise<ArrayBuffer> {
  const response = await fetch(uri);
  return response.arrayBuffer();
}

export const storageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Upload Avatar ──────────────────────────────────────────────────────
    uploadAvatar: builder.mutation<StorageFile, UploadAvatarPayload>({
      queryFn: async ({ userId, uri, mimeType = 'image/jpeg', fileExt = 'jpg' }) => {
        try {
          const buffer = await uriToArrayBuffer(uri);
          const filePath = `${userId}/avatar.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from(AVATAR_BUCKET)
            .upload(filePath, buffer, {
              contentType: mimeType,
              upsert: true,               // overwrite on re-upload
              cacheControl: '3600',
            });

          if (uploadError)
            return { error: { status: 'CUSTOM_ERROR', error: uploadError.message } };

          const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

          // Also persist avatar_url in the profiles table
          await supabase
            .from('profiles')
            .update({ avatar_url: data.publicUrl, updated_at: new Date().toISOString() })
            .eq('id', userId);

          return { data: { publicUrl: data.publicUrl, path: filePath } };
        } catch (err: any) {
          return { error: { status: 'CUSTOM_ERROR', error: err.message ?? 'Upload failed' } };
        }
      },
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'Profile', id: userId }],
    }),

    // ── Delete Avatar ──────────────────────────────────────────────────────
    deleteAvatar: builder.mutation<void, { userId: string; fileExt?: string }>({
      queryFn: async ({ userId, fileExt = 'jpg' }) => {
        const filePath = `${userId}/avatar.${fileExt}`;
        const { error } = await supabase.storage.from(AVATAR_BUCKET).remove([filePath]);
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };

        await supabase
          .from('profiles')
          .update({ avatar_url: null, updated_at: new Date().toISOString() })
          .eq('id', userId);

        return { data: undefined };
      },
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'Profile', id: userId }],
    }),

    // ── Get Signed URL (for private buckets) ──────────────────────────────
    getSignedAvatarUrl: builder.query<string, { userId: string; fileExt?: string }>({
      queryFn: async ({ userId, fileExt = 'jpg' }) => {
        const filePath = `${userId}/avatar.${fileExt}`;
        const { data, error } = await supabase.storage
          .from(AVATAR_BUCKET)
          .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        return { data: data.signedUrl };
      },
      providesTags: (_result, _error, { userId }) => [{ type: 'StorageFile', id: userId }],
    }),

    // ── List Files in User Folder ──────────────────────────────────────────
    listUserFiles: builder.query<string[], string>({
      queryFn: async (userId) => {
        const { data, error } = await supabase.storage
          .from(AVATAR_BUCKET)
          .list(userId, { limit: 100 });
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        return { data: data.map((f) => f.name) };
      },
      providesTags: (_result, _error, userId) => [{ type: 'StorageFile', id: userId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
  useGetSignedAvatarUrlQuery,
  useListUserFilesQuery,
} = storageApi;