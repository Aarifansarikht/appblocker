// src/types/auth.types.ts
import { Session, User } from '@supabase/supabase-js';

// src/types/auth.types.ts
export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
    username: string | null;
    bio: string | null;
    phone: string | null;
    onboarding_completed: boolean;
    updated_at: string | null;
  } | null;
  isLoading: boolean;
  isMutating: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  error: string | null;
}

// ── Request payloads ────────────────────────────────────────────────────────
export interface LoginWithPasswordPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  username?: string;
}

export interface ResetPasswordPayload {
  email: string;
}

export interface UpdatePasswordPayload {
  new_password: string;
}

export interface VerifyOtpPayload {
  email: string;
  token: string;
  type: 'signup' | 'recovery' | 'email_change';
}

export interface GoogleAuthPayload {
  idToken: string;
  accessToken?: string;
}

export interface AppleAuthPayload {
  idToken: string;
  nonce: string;
}

// ── Response shapes ─────────────────────────────────────────────────────────
export interface AuthResponse {
  user: User;
  session: Session;
}