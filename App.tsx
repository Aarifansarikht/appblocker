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
  Platform,
} from 'react-native';

import AppService from './src/native/AppService';
import { SafeAreaView } from 'react-native-safe-area-context';

type AppType = {
  name: string;
  package: string;
};

const TIMER_OPTIONS = [5, 10, 20, 30, 60, 120];

export default function App() {
  const [apps, setApps] = useState<AppType[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [timers, setTimers] = useState<{ [key: string]: number }>({});
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'android') {
      loadApps();

      const emitter = new NativeEventEmitter(NativeModules.AppLocker);

      const sub = emitter.addListener('APP_UNLOCKED', (pkg) => {
        setUnlocked(prev => [...new Set([...prev, pkg])]);
      });

      return () => sub.remove();
    } else {
      setLoading(false);
    }
  }, []);

  const loadApps = async () => {
    try {
      setLoading(true);
      const data = await AppService.getApps();
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

    if (Platform.OS === 'android') {
      AppService.setTimer(pkg, time); // ✅ IMPORTANT
    }
  };

  const saveApps = () => {
    if (Platform.OS === 'android') {
      if (selected.length === 0) {
        Alert.alert('Select at least one app');
        return;
      }

      AppService.saveApps(selected);

      // ✅ APPLY TIMER FOR EACH APP
      selected.forEach(pkg => {
        const time = timers[pkg] || 10; // default fallback
        AppService.setTimer(pkg, time);
      });

      Alert.alert('Saved Successfully with timer');
    } else {
      AppService.startBlocking(10);
      Alert.alert('Blocking Started');
    }
  };

  const relockApp = (pkg: string) => {
    AppService.relock(pkg);
    setUnlocked(prev => prev.filter(p => p !== pkg));
    Alert.alert('Relocked');
  };

  const renderItem = ({ item }: { item: AppType }) => {
    const isSelected = selected.includes(item.package);
    const isUnlocked = unlocked.includes(item.package);

    return (
      <SafeAreaView style={styles.card}>
        <TouchableOpacity onPress={() => toggleApp(item.package)}>
          <View style={styles.row}>
            <Text style={styles.checkbox}>
              {isSelected ? '☑' : '☐'}
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
            {!isUnlocked && (
              <>
                <Text style={styles.timerTitle}>Select Timer</Text>

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
              </>
            )}

            {/* ✅ ALWAYS ACTIVE BUTTON */}
            <TouchableOpacity
              style={styles.relockBtn}
              onPress={() => relockApp(item.package)}
            >
              <Text style={styles.relockText}>
                {isUnlocked ? 'Relock' : 'Lock Now'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>APP LOCKER</Text>

      <View style={styles.actions}>
        {Platform.OS === 'android' ? (
          <>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => AppService.requestPermission()}
            >
              <Text style={styles.actionText}>Permissions</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => AppService.requestPermission()}
            >
              <Text style={styles.actionText}>Enable Permission</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => AppService.openAppSelector()}
            >
              <Text style={styles.actionText}>Select Apps</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.saveBtn} onPress={saveApps}>
          <Text style={styles.saveText}>
            {Platform.OS === 'android' ? 'Save' : 'Start'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={AppService.openUnlockScreen}>
          <Text style={styles.saveText}>
            {Platform.OS === 'android' ? 'Save' : 'Unlock'}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loaderText}>Loading apps...</Text>
        </View>
      ) : Platform.OS === 'android' ? (
        <FlatList
          data={apps}
          keyExtractor={(item) => item.package}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.iosContainer}>
          <Text style={styles.iosText}>
            Apps are selected using iOS system picker
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    paddingHorizontal: 16,
    // paddingTop: 40,
  },

  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 16,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  actionBtn: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  actionText: {
    color: '#fff',
    fontSize: 12,
  },

  saveBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  saveText: {
    color: '#000',
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#1a1a1a',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    fontSize: 18,
    marginRight: 10,
    color: '#fff',
  },

  appName: {
    color: '#fff',
    fontSize: 15,
  },

  unlockedText: {
    color: '#666',
  },

  timerContainer: {
    marginTop: 12,
  },

  timerTitle: {
    color: '#aaa',
    marginBottom: 8,
    fontSize: 12,
  },

  timerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  timerBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    marginRight: 8,
    marginBottom: 8,
  },

  timerActive: {
    backgroundColor: '#fff',
  },

  timerText: {
    color: '#ccc',
    fontSize: 12,
  },

  timerTextActive: {
    color: '#000',
    fontWeight: '600',
  },

  relockBtn: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  relockText: {
    color: '#000',
    fontWeight: '600',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loaderText: {
    color: '#777',
    marginTop: 10,
  },

  iosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iosText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});