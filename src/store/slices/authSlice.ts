// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session, User } from '@supabase/supabase-js';
import { AuthState } from '../../types/auth.types';
import { authApi } from '../api/authApi';

const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isMutating: false,
  isAuthenticated: false,
  isGuest: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<{ user: User; session: Session } | null>) {
      if (action.payload) {
        state.user            = action.payload.user;
        state.session         = action.payload.session;
        state.isAuthenticated = true;
        state.isGuest         = false; // real session = never guest
      } else {
        state.user            = null;
        state.session         = null;
        state.isAuthenticated = false;
        state.isGuest         = false;
        state.profile         = null;
      }
      state.isLoading = false;
      state.error     = null;
    },

    setProfile(state, action: PayloadAction<AuthState['profile']>) {
      state.profile = action.payload;
    },

    // ── Local guest — no Supabase call needed ──────────────────────────────
    continueAsGuest(state) {
      state.user            = null;
      state.session         = null;
      state.profile         = null;
      state.isAuthenticated = false;
      state.isGuest         = true;  // only flag that matters
      state.isLoading       = false;
      state.isMutating      = false;
      state.error           = null;
    },

    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    clearError(state) {
      state.error = null;
    },

    clearAuth(state) {
      state.user            = null;
      state.session         = null;
      state.profile         = null;
      state.isAuthenticated = false;
      state.isGuest         = false;
      state.isLoading       = false;
      state.isMutating      = false;
      state.error           = null;
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.signOut.matchFulfilled, (state) => {
      state.user            = null;
      state.session         = null;
      state.profile         = null;
      state.isAuthenticated = false;
      state.isGuest         = false;
      state.error           = null;
    });

    const authMutations = [
      authApi.endpoints.loginWithPassword,
      authApi.endpoints.register,
      authApi.endpoints.loginWithGoogle,
      authApi.endpoints.loginWithApple,
    ];

    authMutations.forEach((endpoint) => {
      builder.addMatcher(endpoint.matchFulfilled, (state, action) => {
        state.user            = action.payload.user;
        state.session         = action.payload.session;
        state.isAuthenticated = true;
        state.isGuest         = false; // login always clears guest
        state.error           = null;
        state.isMutating      = false;
      });
      builder.addMatcher(endpoint.matchRejected, (state, action) => {
        state.error      = action.error.message ?? 'An error occurred';
        state.isMutating = false;
      });
      builder.addMatcher(endpoint.matchPending, (state) => {
        state.isMutating = true;
        state.error      = null;
      });
    });
  },
});

export const {
  setSession,
  setProfile,
  setAuthLoading,
  clearError,
  clearAuth,
  continueAsGuest,
} = authSlice.actions;

export default authSlice.reducer;

// ── Selectors ────────────────────────────────────────────────────────────────
import { RootState } from '../store';

export const selectCurrentUser    = (state: RootState) => state.auth.user;
export const selectSession        = (state: RootState) => state.auth.session;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsGuest        = (state: RootState) => state.auth.isGuest;
export const selectAuthLoading    = (state: RootState) => state.auth.isLoading;
export const selectAuthError      = (state: RootState) => state.auth.error;
export const selectAuthMutating   = (state: RootState) => state.auth.isMutating;
export const selectAuthProfile    = (state: RootState) => state.auth.profile;