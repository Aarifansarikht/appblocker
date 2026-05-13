// src/providers/AppProviders.tsx
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store';

interface AppProvidersProps {
  children: React.ReactNode;
  LoadingComponent?: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({
  children,
  LoadingComponent,
}) => {
  useEffect(() => {
    // Import here so the store module is fully evaluated first
    const { initAuthListener } = require('../supabase/authListener');
    const unsubscribe = initAuthListener();
    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={LoadingComponent ?? null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};