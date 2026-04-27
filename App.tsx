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
  SafeAreaView
} from 'react-native';

import AppService from './src/native/AppService';


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
  const [iosTimer, setIosTimer] = useState<number>(1);
  const [iosDifficulty, setIosDifficulty] = useState<string>('Easy');
  const [isBlocking, setIsBlocking] = useState(false);

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

      setIsBlocking(true);
      Alert.alert(
        '✅ Saved & Active',
        'Timer-based blocking is now active. Apps will auto-lock after their set time.',
      );
    } else {
      AppService.startBlocking(iosTimer * 60, iosDifficulty);
      setIsBlocking(true);
      Alert.alert(
        '✅ Interval Blocking Started',
        `Selected apps will be blocked after ${iosTimer} minute(s). After solving the challenge, the timer restarts automatically.`,
      );
    }
  };

  const handleUnlock = () => {
    if (Platform.OS === 'ios') {
      AppService.openUnlockScreen();
    }
  };

  const handleStop = () => {
    AppService.stopBlocking();
    setIsBlocking(false);
    Alert.alert('🛑 Stopped', 'App blocking has been completely stopped.');
  };

  const relockApp = (pkg: string) => {
    AppService.relock(pkg);
    setUnlocked(prev => prev.filter(p => p !== pkg));
    Alert.alert('🔒 Relocked', 'App has been relocked.');
  };

  const renderItem = ({ item }: { item: AppType }) => {
    const isSelected = selected.includes(item.package);
    const isUnlocked = unlocked.includes(item.package);
    const currentTimer = timers[item.package] || 10;

    return (
      <SafeAreaView style={styles.card}>
        <TouchableOpacity onPress={() => toggleApp(item.package)}>
          <View style={styles.row}>
            <Text style={styles.checkbox}>
              {isSelected ? '☑' : '☐'}
            </Text>

            <View style={styles.appInfo}>
              <Text
                style={[
                  styles.appName,
                  isUnlocked && styles.unlockedText,
                ]}
              >
                {item.name}
              </Text>

              {isSelected && (
                <View style={styles.statusRow}>
                  {isUnlocked ? (
                    <View style={[styles.statusBadge, styles.statusUnlocked]}>
                      <Text style={styles.statusText}>🟢 Unlocked</Text>
                    </View>
                  ) : isBlocking ? (
                    <View style={[styles.statusBadge, styles.statusTimer]}>
                      <Text style={styles.statusText}>⏳ {currentTimer}s timer</Text>
                    </View>
                  ) : (
                    <View style={[styles.statusBadge, styles.statusReady]}>
                      <Text style={styles.statusText}>⚙️ Ready</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {isSelected && (
          <View style={styles.timerContainer}>
            {!isUnlocked && (
              <>
                <Text style={styles.timerTitle}>⏱ Select Timer (seconds)</Text>

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
              style={[styles.relockBtn, isUnlocked && styles.relockBtnActive]}
              onPress={() => relockApp(item.package)}
            >
              <Text style={styles.relockText}>
                {isUnlocked ? '🔒 Relock' : '🔒 Lock Now'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <Text style={styles.title}>APP LOCKER</Text>

        {/* Blocking Status Banner */}
        {isBlocking && (
          <View style={styles.statusBanner}>
            <Text style={styles.statusBannerText}>
              🛡️ App blocking is active
            </Text>
          </View>
        )}

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
              {Platform.OS === 'android' ? '💾 Save' : '▶️ Start'}
            </Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity style={styles.unlockBtn} onPress={handleUnlock}>
              <Text style={styles.unlockText}>🔓 Unlock</Text>
            </TouchableOpacity>
          )}

          {Platform.OS === 'ios' && isBlocking && (
            <TouchableOpacity style={styles.stopBtn} onPress={handleStop}>
              <Text style={styles.stopText}>🛑 Stop</Text>
            </TouchableOpacity>
          )}
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

                <View style={{ marginTop: 30, width: '100%', alignItems: 'center' }}>
                  <Text style={styles.timerTitle}>🎯 Select Math Difficulty</Text>
                  <View style={[styles.timerRow, { justifyContent: 'center' }]}>
                    {['Easy', 'Medium', 'Hard'].map(d => (
                      <TouchableOpacity
                        key={d}
                        style={[styles.timerBtn, iosDifficulty === d && styles.timerActive]}
                        onPress={() => setIosDifficulty(d)}
                      >
                        <Text style={[styles.timerText, iosDifficulty === d && styles.timerTextActive]}>{d}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.timerTitle, { marginTop: 20 }]}>⏱ Select Session Timer</Text>
                  <View style={[styles.timerRow, { justifyContent: 'center' }]}>
                    {[1, 5, 10, 15, 30, 60].map(t => (
                      <TouchableOpacity
                        key={t}
                        style={[styles.timerBtn, iosTimer === t && styles.timerActive]}
                        onPress={() => setIosTimer(t)}
                      >
                        <Text style={[styles.timerText, iosTimer === t && styles.timerTextActive]}>{t}m</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* How it works info */}
                  <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>📋 How it works</Text>
                    <Text style={styles.infoText}>1. Select apps to block using "Select Apps"</Text>
                    <Text style={styles.infoText}>2. Choose difficulty & timer duration</Text>
                    <Text style={styles.infoText}>3. Tap "Start" to begin the interval session</Text>
                    <Text style={styles.infoText}>4. After the timer expires, apps will be blocked</Text>
                    <Text style={styles.infoText}>5. Solve the math challenge to unlock</Text>
                    <Text style={styles.infoText}>6. Timer auto-restarts → repeating cycle!</Text>
                    <Text style={styles.infoText}>7. Tap "Stop" to end the cycle completely</Text>
                  </View>
            </View>
          </View>
        )}
      </View>
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
    marginBottom: 12,
  },

  statusBanner: {
    backgroundColor: '#1a3a1a',
    borderWidth: 1,
    borderColor: '#2d5a2d',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  statusBannerText: {
    color: '#66bb6a',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
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

  unlockBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  unlockText: {
    color: '#fff',
    fontWeight: '600',
  },

  stopBtn: {
    backgroundColor: '#FF1744',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  stopText: {
    color: '#fff',
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

  appInfo: {
    flex: 1,
  },

  appName: {
    color: '#fff',
    fontSize: 15,
  },

  unlockedText: {
    color: '#666',
  },

  statusRow: {
    marginTop: 4,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },

  statusUnlocked: {
    backgroundColor: '#1b3a1b',
  },

  statusTimer: {
    backgroundColor: '#3a3a1b',
  },

  statusReady: {
    backgroundColor: '#1b1b3a',
  },

  statusText: {
    color: '#ccc',
    fontSize: 10,
    fontWeight: '600',
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
    backgroundColor: '#2a2a2a',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },

  relockBtnActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },

  relockText: {
    color: '#fff',
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

  infoBox: {
    marginTop: 24,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },

  infoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  infoText: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
});