import React, { createContext, useContext } from 'react';
import { useAppBlocker as useAppBlockerHook } from '../hooks/useAppBlocker';

const AppBlockerContext = createContext<any>(null);

export const AppBlockerProvider = ({ children }: any) => {
  const state = useAppBlockerHook();

  return (
    <AppBlockerContext.Provider value={state}>
      {children}
    </AppBlockerContext.Provider>
  );
};

export const useAppBlocker = () => {
  return useContext(AppBlockerContext);
};