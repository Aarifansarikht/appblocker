import { Platform, NativeModules } from 'react-native';
import AppLocker from './AppLocker';
import ScreenTime from './ScreenTime';

const { ScreenTimeManager } = NativeModules;

const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

const AppService = {
  // 🔐 PERMISSIONS
  requestPermission: () => {
    if (isAndroid) {
      AppLocker.openAccessibilitySettings();

      // small delay to avoid UI clash
      setTimeout(() => {
        AppLocker.requestOverlayPermission();
      }, 800);
    } else if (isIOS && ScreenTimeManager) {
      ScreenTimeManager.requestPermission();
    }
  },

  // 📱 APP SELECTION
  openAppSelector: () => {
    if (isIOS && ScreenTimeManager) {
      ScreenTimeManager.openAppPicker();
    }
  },

  // 📦 GET APPS (ANDROID ONLY)
  getApps: async () => {
    if (isAndroid) {
      return await AppLocker.getInstalledApps();
    }
    return [];
  },

  // 💾 SAVE LOCKED APPS (ANDROID)
  saveApps: (apps: string[]) => {
    if (isAndroid) {
      AppLocker.saveLockedApps(apps);
    }
  },

  // ⏱ TIMER (ANDROID ONLY)
  setTimer: (pkg: string, time: number) => {
    if (isAndroid) {
      AppLocker.setAppTimer(pkg, time);
    }
  },

  // 🚀 START BLOCKING (IOS SESSION TIMER)
  startBlocking: (time: number) => {
    if (isIOS && ScreenTimeManager) {
      ScreenTimeManager.startMonitoring(time);
    }
  },

  // 🔓 UNLOCK
  unlock: () => {
    if (isIOS && ScreenTimeManager) {
      ScreenTimeManager.unlockApps();
    }
    // Android handled via overlay button
  },

  // 🔁 RELOCK (ANDROID ONLY)
  relock: (pkg: string) => {
    if (isAndroid) {
      AppLocker.relockApp(pkg);
    }
  },

  // 🧠 OPEN MCQ SCREEN (IOS ONLY)
  openUnlockScreen: () => {
    if (isIOS && ScreenTimeManager?.openUnlockScreen) {
      ScreenTimeManager.openUnlockScreen();
    }
  },
};

export default AppService;