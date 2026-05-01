import { Platform, NativeModules } from 'react-native';
import AppLocker from './AppLocker';
import ScreenTime from './ScreenTime';

const { ScreenTimeManager } = NativeModules;

const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

const AppService = {
  // 🔐 PERMISSIONS
  requestAccessibilityPermission: () => {
    console.log('Requesting permissions...', { isIOS, isAndroid, ScreenTimeManager });
    if (isAndroid) {
      AppLocker.openAccessibilitySettings();
    } else if (isIOS && ScreenTimeManager) {
      ScreenTimeManager.requestPermission();
    }
  },
  requestOverlayPermission: () => {
    console.log('Requesting permissions...', { isIOS, isAndroid, ScreenTimeManager });
    if (isAndroid) {
      AppLocker.requestOverlayPermission();
    
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
saveSchedule: (pkg: any, days: any) => {
  if (isAndroid) {
    AppLocker.saveSchedule(pkg, days);
  }
},
getSchedule: async (pkg: any) => {
  if (isAndroid) {
    return await AppLocker.getSchedule(pkg);
  }
  return [];
},
  // 🚀 START BLOCKING (IOS SESSION TIMER)
  startBlocking: (time: number, difficulty: string = 'Easy') => {
    if (isIOS && ScreenTimeManager) {
      ScreenTimeManager.setDifficulty(difficulty);
      ScreenTimeManager.startMonitoring(time);
    }
  },
unlockApp: (pkg: string) => {
  if (isAndroid) {
    AppLocker.unlockApp(pkg); // calls native
  }
},
  // 🔓 UNLOCK
  unlock: () => {
    if (isIOS && ScreenTimeManager) {
      ScreenTimeManager.unlockApps();
    }
    // Android handled via overlay button
  },

  // 🔎 LOCK STATE (IOS ONLY)
  isAppsLocked: async () => {
    if (isIOS && ScreenTimeManager?.isAppsLocked) {
      return await ScreenTimeManager.isAppsLocked();
    }
    return false;
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

  // 🛑 STOP BLOCKING (IOS ONLY) — fully stops the interval cycle
  stopBlocking: () => {
    if (isIOS && ScreenTimeManager?.stopBlocking) {
      ScreenTimeManager.stopBlocking();
    }
  },
};

export default AppService;
