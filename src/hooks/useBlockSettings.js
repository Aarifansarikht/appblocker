// hooks/useBlockSettings.js

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'block_screen_subject';

export const SUBJECTS = {
  math: {
    id: 'math',
    title: 'Math Unlock',
    desc: 'Solve math questions to unlock apps',
    emoji: '🧠',
  },
  english: {
    id: 'english',
    title: 'English Unlock',
    desc: 'Word & grammar challenges',
    emoji: '📚',
  },
  science: {
    id: 'science',
    title: 'Science Unlock',
    desc: 'Answer science-based questions',
    emoji: '🔬',
  },
  history: {
    id: 'history',
    title: 'History Unlock',
    desc: 'Learn history while unlocking',
    emoji: '🏛️',
  },
};

export default function useBlockSettings() {
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [loading, setLoading] = useState(true);

  // Load saved subject on mount
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved && SUBJECTS[saved]) {
          setSelectedSubject(saved);
        }
      } catch (e) {
        console.warn('Failed to load subject:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Save subject to AsyncStorage + Native SharedPrefs
  const saveSubject = useCallback(async (subjectId) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, subjectId);
      setSelectedSubject(subjectId);

      // Sync to native Android SharedPrefs so OverlayService can read it
      const { NativeModules } = require('react-native');
      NativeModules.AppLocker?.saveBlockSubject?.(subjectId);
    } catch (e) {
      console.warn('Failed to save subject:', e);
    }
  }, []);

  return {
    selectedSubject,
    saveSubject,
    loading,
    subjects: Object.values(SUBJECTS),
  };
}