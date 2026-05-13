// src/supabase/authListener.ts
import { supabase } from './client';

export function initAuthListener() {
  // Lazy import — avoids circular dependency at module load time
  const { store } = require('../store/store');
  const { setSession, setAuthLoading } = require('../store/slices/authSlice');
  const { baseApi } = require('../store/api/baseApi');

  store.dispatch(setAuthLoading(true));

  supabase.auth.getSession().then(({ data: { session } }: any) => {
    store.dispatch(
      setSession(session ? { user: session.user, session } : null)
    );
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
    store.dispatch(
      setSession(session ? { user: session.user, session } : null)
    );
    if (!session) {
      store.dispatch(baseApi.util.resetApiState());
    }
  });

  return () => subscription.unsubscribe();
}