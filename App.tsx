import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  ActivityIndicator,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import AppLocker from './src/native/AppLocker';

type AppType = {
  name: string;
  package: string;
};

const TIMER_OPTIONS = [10, 20, 30, 60, 120];

export default function App() {
  const [apps, setApps] = useState<AppType[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [timers, setTimers] = useState<{ [key: string]: number }>({});
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApps();

    // ✅ listen for native unlock event
    const emitter = new NativeEventEmitter(NativeModules.AppLocker);

    const sub = emitter.addListener('APP_UNLOCKED', (pkg) => {
      setUnlocked(prev => [...new Set([...prev, pkg])]);
    });

    return () => sub.remove();
  }, []);

  const loadApps = async () => {
    try {
      setLoading(true);
      const data = await AppLocker.getInstalledApps();
      setApps(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleApp = (pkg: string) => {
    setSelected(prev =>
      prev.includes(pkg)
        ? prev.filter(p => p !== pkg)
        : [...prev, pkg]
    );
  };

  const setTimer = (pkg: string, time: number) => {
    setTimers(prev => ({ ...prev, [pkg]: time }));
  };

  const saveApps = () => {
    AppLocker.saveLockedApps(selected);

    selected.forEach(pkg => {
      const time = timers[pkg] || 60;
      AppLocker.setAppTimer(pkg, time);
    });

    Alert.alert('Saved Successfully');
  };

  const relockApp = (pkg: string) => {
    AppLocker.relockApp(pkg);
    setUnlocked(prev => prev.filter(p => p !== pkg));
    Alert.alert('Relocked');
  };

  const renderItem = ({ item }: { item: AppType }) => {
    const isSelected = selected.includes(item.package);
    const isUnlocked = unlocked.includes(item.package);

    // ✅ FINAL STATE
    const isLocked = isSelected && !isUnlocked;

    return (
      <View style={[styles.card, isUnlocked && styles.unlockedCard]}>
        <TouchableOpacity onPress={() => toggleApp(item.package)}>
          <View style={styles.row}>
            <Text style={styles.checkbox}>
              {isLocked ? '☑' : '☐'}
            </Text>

            <Text
              style={[
                styles.appName,
                isUnlocked && styles.unlockedText,
              ]}
            >
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>

        {isSelected && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerTitle}>
              {isLocked ? 'Locked' : 'Unlocked'}
            </Text>

            {isLocked && (
              <View style={styles.timerRow}>
                {TIMER_OPTIONS.map(t => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setTimer(item.package, t)}
                    style={[
                      styles.timerBtn,
                      timers[item.package] === t &&
                        styles.timerActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.timerText,
                        timers[item.package] === t &&
                          styles.timerTextActive,
                      ]}
                    >
                      {t}s
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.relockBtn}
              onPress={() => relockApp(item.package)}
            >
              <Text style={styles.relockText}>
                {isLocked ? 'Force Lock' : 'Relock'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>APP BLOCKER</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => AppLocker.openAccessibilitySettings()}
        >
          <Text style={styles.actionText}>Accessibility</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => AppLocker.requestOverlayPermission()}
        >
          <Text style={styles.actionText}>Overlay</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={saveApps}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 LOADER */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loaderText}>Loading apps...</Text>
        </View>
      ) : apps.length === 0 ? (
        <Text style={styles.emptyText}>No apps found</Text>
      ) : (
        <FlatList
          data={apps}
          keyExtractor={(item) => item.package}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 16,
    paddingTop: 50,
  },

  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 20,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  actionBtn: {
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  actionText: {
    color: '#AAA',
    fontSize: 12,
  },

  saveBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  saveText: {
    color: '#000',
    fontWeight: '600',
  },

  loaderContainer: {
    marginTop: 100,
    alignItems: 'center',
  },

  loaderText: {
    marginTop: 10,
    color: '#888',
  },

  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 100,
  },

  card: {
    backgroundColor: '#121212',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1F1F1F',
  },

  unlockedCard: {
    opacity: 0.4,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    color: '#fff',
    fontSize: 18,
    marginRight: 10,
  },

  appName: {
    color: '#FFF',
    fontSize: 16,
  },

  unlockedText: {
    color: '#777',
  },

  timerContainer: {
    marginTop: 12,
  },

  timerTitle: {
    color: '#777',
    fontSize: 12,
    marginBottom: 8,
  },

  timerRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  timerBtn: {
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },

  timerActive: {
    backgroundColor: '#FFF',
  },

  timerText: {
    color: '#AAA',
    fontSize: 12,
  },

  timerTextActive: {
    color: '#000',
    fontWeight: '600',
  },

  relockBtn: {
    borderWidth: 1,
    borderColor: '#444',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },

  relockText: {
    color: '#CCC',
  },
});