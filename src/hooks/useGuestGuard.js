// src/hooks/useGuestGuard.ts
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './useAuth';
import { Navigate_Login } from '../routes/path';

/**
 * Call at the top of any screen to block guest access entirely.
 * Redirects to login and shows no content.
 *
 * Usage: useGuestGuard(); // at top of component
 */
export const useGuestGuard = () => {
  const { isGuest } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isGuest) {
      navigation.navigate(Navigate_Login);
    }
  }, [isGuest]);

  return isGuest; // true = blocked, component should return null
};