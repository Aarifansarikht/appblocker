import { useEffect, useState, useRef } from 'react';
import { NativeEventEmitter, NativeModules, Platform, AppState, Alert } from 'react-native';
import AppService from '../native/AppService';
import { AppType, TimersType } from '../types/app';

export const useAppBlocker = () => {
  const [apps, setApps] = useState<AppType[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [timers, setTimers] = useState<TimersType>({});
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [days, setDays] = useState<Record<string, string[]>>({});
  const [lockedNow, setLockedNow] = useState<string[]>([]);
  const [iosTimer, setIosTimer] = useState(1);
  const [iosDifficulty, setIosDifficulty] = useState('Easy');

  const timersRef = useRef<TimersType>({});
  const selectedRef = useRef<string[]>([]);

  useEffect(() => { timersRef.current = timers; }, [timers]);
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  // ANDROID INIT
  useEffect(() => {
    if (Platform.OS === 'android') {
      loadApps();
      refreshState();
      const emitter = new NativeEventEmitter(NativeModules.AppLocker);
      const sub = emitter.addListener('APP_UNLOCKED', pkg => {
        setUnlocked(prev => [...new Set([...prev, pkg])]);
        const { [pkg]: _, ...restTimers } = timersRef.current;
        timersRef.current = restTimers;
        setTimers({ ...restTimers });
        selectedRef.current = selectedRef.current.filter(p => p !== pkg);
        setSelected([...selectedRef.current]);
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
    const sub = AppState.addEventListener('change', s => { if (s === 'active') check(); });
    return () => sub.remove();
  }, []);

  const refreshState = async () => {
    try {
      const res = await AppService.getFullState();
      const locked = res?.locked || [];
      const lockedNow = res?.lockedNow || [];
      const timers = res?.timers || {};

      setSelected(locked);
      selectedRef.current = locked;
      setTimers(timers);
      timersRef.current = timers;
      setLockedNow(lockedNow);
      setUnlocked(locked.filter((pkg: any) => !lockedNow.includes(pkg)));
    } catch (e) {
      console.log('refresh error', e);
    }
  };

  const getSchedule = async (pkg: any) => {
    if (Platform.OS === 'android') {
      const result = await AppService.getSchedule(pkg);
      const daysList = result?.days || [];
      const from: number = result?.from ?? -1;
      const to: number = result?.to ?? -1;
      setDays(prev => ({ ...prev, [pkg]: daysList }));
      return result;
    }
    return null;
  };

  const loadApps = async () => {
    try {
      setLoading(true);
      const data = await AppService.getApps();
      setApps(data);
      data.forEach((app: { package: any }) => getSchedule(app.package));
    } finally {
      setLoading(false);
    }
  };

  const toggleApp = (pkg: string) => {
    setSelected(prev => prev.includes(pkg) ? prev.filter(p => p !== pkg) : [...prev, pkg]);
  };

  const setTimer = (pkg: string, time: number) => {
    timersRef.current = { ...timersRef.current, [pkg]: time };
    setTimers({ ...timersRef.current });
    if (Platform.OS === 'android') AppService.setTimer(pkg, time);
  };

  const relockApp = (pkg: string) => {
    AppService.relock(pkg);
    setUnlocked(prev => prev.filter(p => p !== pkg));
  };

  const _clearPkg = (pkg: string) => {
    const { [pkg]: _, ...restTimers } = timersRef.current;
    timersRef.current = restTimers;
    setTimers({ ...restTimers });
    setUnlocked(prev => prev.filter(p => p !== pkg));
    selectedRef.current = selectedRef.current.filter(p => p !== pkg);
    setSelected([...selectedRef.current]);
  };

  const saveApps = (pkgList?: string[]) => {
    if (Platform.OS === 'android') {
      const toSave = pkgList ?? selectedRef.current;
      if (!toSave.length) return Alert.alert('Select at least one app');
      AppService.saveApps(toSave);
      toSave.forEach(pkg => {
        const t = timersRef.current[pkg] ?? 10;
        AppService.setTimer(pkg, t);
      });
      setIsBlocking(true);
    } else {
      AppService.startBlocking(iosTimer * 60, iosDifficulty);
      setIsBlocking(true);
    }
  };

  const unlockApp = (pkg: string) => {
    if (Platform.OS === 'android') {
      AppService.unlockApp(pkg);
      _clearPkg(pkg);
    }
  };

  const clearTimer = (pkg: string) => {
    const { [pkg]: _, ...rest } = timersRef.current;
    timersRef.current = rest;
    setTimers({ ...rest });
  };

  const clearSchedule = async (pkg: string) => {
    if (Platform.OS === 'android') {
      await AppService.clearSchedule(pkg);
      setDays(prev => { const n = { ...prev }; delete n[pkg]; return n; });
    }
  };

  const saveSchedule = async (pkg: any, days: any, fromMins?: number, toMins?: number) => {
    if (Platform.OS === 'android') {
      await AppService.saveSchedule(pkg, days, fromMins ?? 0, toMins ?? 0);
      setDays(prev => ({ ...prev, [pkg]: days }));
    }
  };

  const stopBlocking = () => {
    AppService.stopBlocking();
    setIsBlocking(false);
  };

  return {
    apps, selected, timers, unlocked, lockedNow, loading, isBlocking,
    iosTimer, iosDifficulty, days,
    setIosTimer, setIosDifficulty,
    toggleApp, setTimer, relockApp, saveApps, stopBlocking,
    unlockApp, saveSchedule, getSchedule, refreshState,
    clearTimer, clearSchedule,
  };
};