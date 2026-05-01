import { PermissionsAndroid, Platform, NativeModules } from 'react-native';

const { AppLocker } = NativeModules;

// Overlay
export const checkOverlay = async () => {
  return await AppLocker?.canDrawOverlays();
};

export const openOverlay = () => {
  AppLocker?.requestOverlayPermission();
};

// Accessibility
export const checkAccessibility = async () => {
  return await AppLocker?.isAccessibilityEnabled();
};

export const openAccessibility = () => {
  AppLocker?.openAccessibilitySettings();
};

// Usage
export const checkUsage = async () => {
  return await AppLocker?.hasUsageAccess();
};

export const openUsage = () => {
  AppLocker?.openUsageAccessSettings();
};

// Notifications
export const checkNotifications = async () => {
  if (Platform.Version >= 33) {
    return await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
  }
  return true;
};

export const requestNotifications = async () => {
  if (Platform.Version >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
  }
};