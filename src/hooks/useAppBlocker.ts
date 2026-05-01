import { useEffect, useState, useRef } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  AppState,
  Alert,
} from 'react-native';

import AppService from '../native/AppService';
import { AppType, TimersType } from '../types/app';

export const useAppBlocker = () => {
  const [apps, setApps] = useState<AppType[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [timers, setTimers] = useState<TimersType>({});
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
const [days, setDays] = useState({});

  // iOS
  const [iosTimer, setIosTimer] = useState(1);
  const [iosDifficulty, setIosDifficulty] = useState('Easy');

  // ✅ Ref always holds the latest timers — no stale closure
  const timersRef = useRef<TimersType>({});
  // ✅ Ref always holds the latest selected — no stale closure
  const selectedRef = useRef<string[]>([]);

  // Keep refs in sync with state
  useEffect(() => {
    timersRef.current = timers;
  }, [timers]);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // ANDROID INIT
  useEffect(() => {
    if (Platform.OS === 'android') {
      loadApps();

      const emitter = new NativeEventEmitter(NativeModules.AppLocker);
    const sub = emitter.addListener('APP_UNLOCKED', pkg => {
  console.log('UNLOCKED:', pkg);

  // ✅ mark unlocked
  setUnlocked(prev => [...new Set([...prev, pkg])]);

  // ✅ remove timer
  const { [pkg]: _, ...restTimers } = timersRef.current;
  timersRef.current = restTimers;
  setTimers({ ...restTimers });

  // ✅ 🔥 REMOVE FROM SELECTED (THIS IS YOUR MAIN FIX)
  selectedRef.current = selectedRef.current.filter(p => p !== pkg);
  setSelected([...selectedRef.current]);

  // ✅ optional: update native storage (clean)
  AppService.unlockApp(pkg);
});

      return () => sub.remove();
    }
    
  }, []);

  // IOS LOCK CHECK
  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    let busy = false;

    const check = async () => {
      if (busy) return;
      busy = true;
      try {
        const locked = await AppService.isAppsLocked();
        setIsBlocking(locked);
        if (locked) AppService.openUnlockScreen();
      } finally {
        busy = false;
      }
    };

    check();
    const sub = AppState.addEventListener('change', s => {
      if (s === 'active') check();
    });
    return () => sub.remove();
  }, []);
const getSchedule = async (pkg: any) => {
  if (Platform.OS === 'android') {
    const result = await AppService.getSchedule(pkg);

    setDays(prev => ({
      ...prev,
      [pkg]: result || [],
    }));

    return result;
  }
  return [];
};
  const loadApps = async () => {
    try {
      setLoading(true);
      const data = await AppService.getApps();
      setApps(data);
      data.forEach((app: { package: any; }) => {
  getSchedule(app.package);
});
    } finally {
      setLoading(false);
    }
  };

  const toggleApp = (pkg: string) => {
    setSelected(prev =>
      prev.includes(pkg) ? prev.filter(p => p !== pkg) : [...prev, pkg],
    );
  };

  const setTimer = (pkg: string, time: number) => {
    // ✅ Update both state AND ref immediately
    timersRef.current = { ...timersRef.current, [pkg]: time };
    setTimers({ ...timersRef.current });

    // ✅ Write to native immediately — don't wait for saveApps
    if (Platform.OS === 'android') {
      AppService.setTimer(pkg, time);
    }
  };

  const relockApp = (pkg: string) => {
    AppService.relock(pkg);
    setUnlocked(prev => prev.filter(p => p !== pkg));
  };
  const _clearPkg = (pkg: string) => {
    // 1. Clear from timers ref + state
    const { [pkg]: _, ...restTimers } = timersRef.current;
    timersRef.current = restTimers;
    setTimers({ ...restTimers });

    // 2. Remove from unlocked
    setUnlocked(prev => prev.filter(p => p !== pkg));

    // 3. Remove from selected
    selectedRef.current = selectedRef.current.filter(p => p !== pkg);
    setSelected([...selectedRef.current]);
  };
  const saveApps = (pkgList?: string[]) => {
    if (Platform.OS === 'android') {
      // ✅ Use passed list OR latest from ref — never stale state
      const toSave = pkgList ?? selectedRef.current;

      if (!toSave.length) return Alert.alert('Select at least one app');

      AppService.saveApps(toSave);

      // ✅ Read from ref — always latest timers
      toSave.forEach(pkg => {
        const t = timersRef.current[pkg] ?? 10;
        AppService.setTimer(pkg, t);
        console.log(`Saving ${pkg} with timer: ${t}s`); // verify correct value
      });

      setIsBlocking(true);
    } else {
      AppService.startBlocking(iosTimer * 60, iosDifficulty);
      setIsBlocking(true);
    }
  };
  const unlockApp = (pkg: string) => {
    if (Platform.OS === 'android') {
      // 1. Tell native to remove from locked_apps + clear timer in SharedPrefs
      AppService.unlockApp(pkg);

      // 2. Clean JS state completely
      _clearPkg(pkg);
    }
  };

  const saveSchedule = async (pkg: any, d: any) => {
  if (Platform.OS === 'android') {
    await AppService.saveSchedule(pkg, d);

    // 🔥 update local state immediately
    setDays(prev => ({
      ...prev,
      [pkg]: d,
    }));
  }
};
  const stopBlocking = () => {
    AppService.stopBlocking();
    setIsBlocking(false);
  };

  return {
    apps,
    selected,
    timers,
    unlocked,
    loading,
    isBlocking,
    iosTimer,
    iosDifficulty,
    days,
    setIosTimer,
    setIosDifficulty,
    toggleApp,
    setTimer,
    relockApp,
    saveApps,
    stopBlocking,
    unlockApp,
    saveSchedule,
    getSchedule
  };
};
