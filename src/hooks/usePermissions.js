import { useState, useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  checkOverlay,
  openOverlay,
  checkAccessibility,
  openAccessibility,
  checkUsage,
  openUsage,
  checkNotifications,
  requestNotifications,
} from '../utils/permissions';

export default function usePermissions() {
  const [permissions, setPermissions] = useState({
    overlay: false,
    accessibility: false,
    usage: false,
    notifications: false,
  });

  // 🔥 Load all permissions
  const loadPermissions = async () => {
    try {
      const overlay = await checkOverlay();
      const accessibility = await checkAccessibility();
      const usage = await checkUsage();
      const notifications = await checkNotifications();

      setPermissions({ overlay, accessibility, usage, notifications });
    } catch (e) {
      console.log('Permission error:', e);
    }
  };

  // 🔥 Auto refresh when screen focused
  useFocusEffect(
    useCallback(() => {
      loadPermissions();
    }, [])
  );

  // 🔥 Auto refresh when app returns from settings
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        loadPermissions();
      }
    });

    return () => sub.remove();
  }, []);

  // 🔥 Handlers
  const handleOverlay = () => {
    openOverlay();
    setTimeout(loadPermissions, 1000);
  };

  const handleAccessibility = () => {
    openAccessibility();
    setTimeout(loadPermissions, 1000);
  };

  const handleUsage = () => {
    openUsage();
    setTimeout(loadPermissions, 1000);
  };

  const handleNotification = async () => {
    await requestNotifications();
    loadPermissions();
  };

  return {
    permissions,
    handleOverlay,
    handleAccessibility,
    handleUsage,
    handleNotification,
  };
}