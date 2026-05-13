// src/store/api/authApi.ts
import { baseApi } from './baseApi';
import { supabase } from '../../supabase/client';
import {
  LoginWithPasswordPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UpdatePasswordPayload,
  VerifyOtpPayload,
  GoogleAuthPayload,
  AppleAuthPayload,
  AuthResponse,
} from '../../types/auth.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // ── Email / Password Login ─────────────────────────────────────────────
    loginWithPassword: builder.mutation<AuthResponse, LoginWithPasswordPayload>({
      queryFn: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        if (!data.session || !data.user) return { error: { status: 'CUSTOM_ERROR', error: 'No session returned' } };
        return { data: { user: data.user, session: data.session } };
      },
      invalidatesTags: ['Auth', 'Profile'],
    }),

    // ── Register ───────────────────────────────────────────────────────────
    register: builder.mutation<AuthResponse, RegisterPayload>({
      queryFn: async ({ email, password, full_name, username }) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name, username },
            emailRedirectTo: undefined, // deep-link handled natively
          },
        });
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        if (!data.session || !data.user) return { error: { status: 'CUSTOM_ERROR', error: 'Verify your email to continue' } };
        return { data: { user: data.user, session: data.session } };
      },
      invalidatesTags: ['Auth'],
    }),

    // ── Guest Sign-in ──────────────────────────────────────────────────────
    signInAsGuest: builder.mutation<AuthResponse, void>({
      queryFn: async () => {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        if (!data.session || !data.user) return { error: { status: 'CUSTOM_ERROR', error: 'Guest sign-in failed' } };
        return { data: { user: data.user, session: data.session } };
      },
      invalidatesTags: ['Auth'],
    }),

    // ── Google OAuth ───────────────────────────────────────────────────────
    loginWithGoogle: builder.mutation<AuthResponse, GoogleAuthPayload>({
      queryFn: async ({ idToken, accessToken }) => {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: idToken,
          access_token: accessToken,
        });
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        if (!data.session || !data.user) return { error: { status: 'CUSTOM_ERROR', error: 'Google auth failed' } };
        return { data: { user: data.user, session: data.session } };
      },
      invalidatesTags: ['Auth', 'Profile'],
    }),

    // ── Apple OAuth ────────────────────────────────────────────────────────
    loginWithApple: builder.mutation<AuthResponse, AppleAuthPayload>({
      queryFn: async ({ idToken, nonce }) => {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: idToken,
          nonce,
        });
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        if (!data.session || !data.user) return { error: { status: 'CUSTOM_ERROR', error: 'Apple auth failed' } };
        return { data: { user: data.user, session: data.session } };
      },
      invalidatesTags: ['Auth', 'Profile'],
    }),

    // ── Send OTP / Password Reset Email ───────────────────────────────────
    sendPasswordResetEmail: builder.mutation<void, ResetPasswordPayload>({
      queryFn: async ({ email }) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        return { data: undefined };
      },
    }),

    // ── Verify OTP ────────────────────────────────────────────────────────
    verifyOtp: builder.mutation<AuthResponse, VerifyOtpPayload>({
      queryFn: async ({ email, token, type }) => {
        const { data, error } = await supabase.auth.verifyOtp({ email, token, type });
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        if (!data.session || !data.user) return { error: { status: 'CUSTOM_ERROR', error: 'OTP verification failed' } };
        return { data: { user: data.user, session: data.session } };
      },
      invalidatesTags: ['Auth'],
    }),

    // ── Update Password (after OTP verified) ──────────────────────────────
    updatePassword: builder.mutation<void, UpdatePasswordPayload>({
      queryFn: async ({ new_password }) => {
        const { error } = await supabase.auth.updateUser({ password: new_password });
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        return { data: undefined };
      },
    }),

    // ── Get Current Session ───────────────────────────────────────────────
    getSession: builder.query<AuthResponse | null, void>({
      queryFn: async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        if (!data.session) return { data: null };
        return { data: { user: data.session.user, session: data.session } };
      },
      providesTags: ['Auth'],
    }),

    // ── Sign Out ──────────────────────────────────────────────────────────
    signOut: builder.mutation<null, void>({
      queryFn: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) return { error: { status: 'CUSTOM_ERROR', error: error.message } };
          return { data: null }; // ✅ null is valid, undefined is not
        } catch (e: any) {
          return { error: { status: 'CUSTOM_ERROR', error: e?.message ?? 'Sign out failed' } };
        }
      },
      invalidatesTags: ['Auth', 'Profile', 'Skills', 'UserProgress'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginWithPasswordMutation,
  useRegisterMutation,
  useSignInAsGuestMutation,
  useLoginWithGoogleMutation,
  useLoginWithAppleMutation,
  useSendPasswordResetEmailMutation,
  useVerifyOtpMutation,
  useUpdatePasswordMutation,
  useGetSessionQuery,
  useSignOutMutation,
} = authApi;
