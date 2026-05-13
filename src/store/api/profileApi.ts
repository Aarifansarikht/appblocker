// src/store/api/profileApi.ts
import { baseApi } from './baseApi';
import { supabase } from '../../supabase/client';
import { Profile, ProfileUpdate } from '../../types/database.types';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Fetch Profile ──────────────────────────────────────────────────────
    getProfile: builder.query<Profile, string>({
      queryFn: async (userId) => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        return { data };
      },
      providesTags: (_result, _error, userId) => [{ type: 'Profile', id: userId }],
    }),

    // ── Update Profile ─────────────────────────────────────────────────────
    // ✅ FIX: destructure { userId, updates } — before it was ({ updates }) only
    //         so userId was undefined and the .eq() matched nothing
    updateProfile: builder.mutation<Profile, { userId: string; updates: ProfileUpdate }>({
      queryFn: async ({ userId, updates }) => {
        const { data, error } = await supabase
          .from('profiles')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', userId)
          .select()
          .single();
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        return { data };
      },
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'Profile', id: userId }],
    }),

    // ── Check Username Availability ────────────────────────────────────────
    checkUsernameAvailability: builder.query<boolean, string>({
      queryFn: async (username) => {
        const { count, error } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('username', username);
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        return { data: count === 0 };
      },
    }),

    // ── Complete Onboarding ────────────────────────────────────────────────
    completeOnboarding: builder.mutation<void, string>({
      queryFn: async (userId) => {
        const { error } = await supabase
          .from('profiles')
          .update({ onboarding_completed: true, updated_at: new Date().toISOString() })
          .eq('id', userId);
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        return { data: undefined };
      },
      invalidatesTags: (_result, _error, userId) => [{ type: 'Profile', id: userId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useCheckUsernameAvailabilityQuery,
  useCompleteOnboardingMutation,
} = profileApi;