import { useState, useCallback, useEffect } from 'react';
import { AppState, Linking } from 'react-native';
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

  const [loading, setLoading] = useState(true); // ✅ ADD

  // 🔥 Load all permissions (OPTIMIZED)
  const loadPermissions = useCallback(async () => {
    try {
      // ✅ run in parallel (faster + less flicker)
      const [overlay, accessibility, usage, notifications] =
        await Promise.all([
          checkOverlay(),
          checkAccessibility(),
          checkUsage(),
          checkNotifications(),
        ]);

      setPermissions(prev => {
        // ✅ prevent unnecessary re-render (important)
        if (
          prev.overlay === overlay &&
          prev.accessibility === accessibility &&
          prev.usage === usage &&
          prev.notifications === notifications
        ) {
          return prev;
        }
        return { overlay, accessibility, usage, notifications };
      });
    } catch (e) {
      console.log('Permission error:', e);
    } finally {
      setLoading(false); // ✅ stop loading once
    }
  }, []);

  // 🔥 First load
  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  // 🔥 Refresh when screen focused
  useFocusEffect(
    useCallback(() => {
      loadPermissions();
    }, [loadPermissions])
  );

  // 🔥 Refresh when returning from settings
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        loadPermissions();
      }
    });

    return () => sub.remove();
  }, [loadPermissions]);

  // 🔥 Handlers (no spam reload)
  const handleOverlay = () => {
    openOverlay();
  };

  const handleAccessibility = () => {
    openAccessibility();
  };

  const handleUsage = () => {
    openUsage();
  };

const handleNotification = async () => {
  const isGranted = await checkNotifications();

  if (isGranted) return;

  const result = await requestNotifications();

  // 🔥 If still not granted → user denied → open settings
  const finalStatus = await checkNotifications();

  if (!finalStatus) {
    // 👉 Open app settings manually
    Linking.openSettings();
  }

  loadPermissions();
};

  return {
    permissions,
    loading, // ✅ RETURN THIS
    handleOverlay,
    handleAccessibility,
    handleUsage,
    handleNotification,
  };
}