// src/hooks/useAuth.ts
import { useAppSelector } from '../store/hooks';
import {
  selectCurrentUser,
  selectSession,
  selectIsAuthenticated,
  selectIsGuest,
  selectAuthLoading,
  selectAuthError,
  clearAuth,
} from '../store/slices/authSlice';
import { useSignOutMutation } from '../store/api/authApi';
import { useGetProfileQuery } from '../store/api/profileApi';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { supabase } from '../supabase/client';

export const useAuth = () => {
  const user = useAppSelector(selectCurrentUser);
  const session = useAppSelector(selectSession);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isGuest = useAppSelector(selectIsGuest);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const userId = user?.id ?? null;
  const dispatch = useDispatch();
  // ── Fetch from public.profiles — source of truth for name/avatar/bio ──
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useGetProfileQuery(userId!, { skip: !userId });
  const rawAvatarUrl = profile?.avatar_url ?? null;
  const [signOutMutation, { isLoading: isSigningOut }] = useSignOutMutation();

  const signOut = async () => {
    try {
      // Call Supabase directly — avoids RTK abort race condition entirely
      const { error } = await supabase.auth.signOut();

      if (error) {
        Toast.show({ type: 'error', text1: 'Sign out failed', text2: error.message });
        return;
      }

      // Clear Redux state — this triggers RootNavigation → AuthNavigator
      dispatch(clearAuth());
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Sign out failed',
        text2: err?.message ?? 'Something went wrong',
      });
    }
  };
  return {
    user,
    userId,
    email: user?.email ?? null,

    // ── These now come from profiles TABLE, not user_metadata ────────────
    profile,
    fullName: profile?.full_name ?? null,
    avatarUrl: rawAvatarUrl ? `${rawAvatarUrl}?t=${profile?.updated_at ?? Date.now()}` : null,
    username: profile?.username ?? null,
    bio: profile?.bio ?? null,
    phone: profile?.phone ?? null,
    onboardingCompleted: profile?.onboarding_completed ?? false,

    session,
    accessToken: session?.access_token ?? null,

    isAuthenticated,
    isGuest,
    isLoading: isLoading, // auth session loading only (used by RootNavigation)
    isProfileLoading: profileLoading,
    isSigningOut,
    error,

    signOut,
    refetchProfile,
  };
};
