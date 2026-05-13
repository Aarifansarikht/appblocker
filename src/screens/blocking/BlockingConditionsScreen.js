import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Alert,
} from 'react-native';

import Container from '../../layout/Container';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';
import { CONTAINER_SPACING } from '../../utils/constants';
import BackButton from '../../components/buttons/BackButton';
import { formatDays } from '../../helper/formatDays';
import ClockIcon, { LockIcon } from '../../utils/svg';
import { useAppBlocker } from '../../context/AppBlockerContext';
import OrderConfirm from '../../components/modals/OrderConfirm';
import Button from '../../components/buttons/Button';
import usePermissions from '../../hooks/usePermissions';
import { Navigate_Bottom, Navigate_Home } from '../../routes/path';
export default function BlockingConditionsScreen({ navigation, route }) {
  const { colors } = useTheme();
  const state = useAppBlocker();
  const { app } = route.params;
  const appDays = state.days[app.package] || [];
  const timer = state.timers?.[app.package] ?? 0;
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const { permissions } = usePermissions();
  const hasAllPermissions = () => {
    return (
      permissions.overlay &&
      permissions.accessibility &&
      permissions.usage &&
      permissions.notifications
    );
  };
  const isLocked = state.selected.includes(app.package);
  const isUnlocked = state.unlocked.includes(app.package);
  const [quickBlockVisible, setQuickBlockVisible] = useState(false);
  const handlePermissionCheck = () => {
    if (!hasAllPermissions()) {
      Alert.alert(
        'Permissions Required',
        'Please enable all permissions to use blocking features.',
        [
          {
            text: 'Go to Permissions',
            onPress: () => navigation.navigate(Navigate_Bottom),
          },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
      return false;
    }
    return true;
  };
  const formatTime = sec => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h > 0 ? `${h}h ` : ''}${m}m ${s}s`;
  };

  const handleUnlock = () => {
    setConfirmVisible(true);
  };
  const confirmUnlock = () => {
    state.unlockApp(app.package);
    setSuccessVisible(true);

    setTimeout(() => {
      setSuccessVisible(false);
    }, 1500);
  };
  const confirmQuickBlock = () => {
    const pkg = app.package;

    // 🔥 FULL RESET BEFORE BLOCK
    state.unlockApp(pkg); // reset everything

    setTimeout(() => {
      if (!state.selected.includes(pkg)) {
        state.toggleApp(pkg);
      }

      state.setTimer(pkg, 0);

      const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      state.saveSchedule(pkg, ALL_DAYS);

      const updatedApps = state.selected.includes(pkg)
        ? state.selected
        : [...state.selected, pkg];

      state.saveApps(updatedApps);

      state.relockApp(pkg);
    }, 100); // small delay ensures clean state

    setQuickBlockVisible(false);
  };
  return (
    <Container>
      <View style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={{ paddingHorizontal: CONTAINER_SPACING }}>
          <BackButton
            title="Blocking Options"
            wrapperStyle={{ padding: CONTAINER_SPACING }}
          />
        </View>

        {/* APP CARD */}
        <View
          style={[
            styles.appCard,
            {
              backgroundColor: colors.grayLight,
              borderColor: colors.borderColor,
            },
          ]}
        >
          {app?.icon && (
            <Image source={{ uri: app.icon }} style={styles.appIcon} />
          )}
          <Text style={[styles.appName, { color: colors.blackPrimary }]}>
            {app?.name}
          </Text>
        </View>

        {/*  ENHANCED BLOCKING CARD */}
        <View
          style={[
            styles.blockCard,
            {
              backgroundColor: colors.grayLight,
              borderColor: colors.borderColor,
            },
          ]}
        >
          <View style={styles.blockHeader}>
            <View
              style={[styles.iconCircle, { backgroundColor: colors.accent }]}
            >
              <ClockIcon color={colors.whitePrimary} size={18} />
            </View>
            <Text style={[styles.blockTitle, { color: colors.blackPrimary }]}>
              Blocking Time
            </Text>
          </View>

          <Text style={[styles.timeText, { color: colors.blackPrimary }]}>
            {timer === 0
              ? 'Instant Block'
              : timer
              ? formatTime(timer)
              : 'Not Set'}
          </Text>

          <Text
            style={{
              marginTop: 6,
              fontSize: 13,
              fontFamily: Fonts.primary_Medium,
              color: colors.paragraphLight,
            }}
          >
            {formatDays(appDays)}
          </Text>

          <View style={styles.statusRow}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: !isLocked ? colors.error : colors.accent,
                },
              ]}
            />
            <Text style={[styles.statusText, { color: colors.paragraphLight }]}>
              {isUnlocked
                ? 'Unlocked'
                : isLocked
                ? 'App is Locked'
                : 'Not Active'}
            </Text>
          </View>
        </View>

        {/* OPTIONS */}
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.grayLight,
              borderColor: colors.borderColor,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              if (!handlePermissionCheck()) return;
              setQuickBlockVisible(true);
            }}
          >
            <View style={styles.left}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: colors.blackPrimary },
                ]}
              >
                <LockIcon color={colors.whitePrimary} size={18} />
              </View>

              <View>
                <Text style={[styles.title, { color: colors.blackPrimary }]}>
                  Quick Block
                </Text>
                <Text
                  style={[styles.subtitle, { color: colors.paragraphLight }]}
                >
                  Instantly block selected apps
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={{ height: 1, backgroundColor: colors.borderColor }} />

          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              if (!handlePermissionCheck()) return;
              navigation.navigate('ScheduleBlockScreen', { app });
            }}
          >
            <View style={styles.left}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: colors.blackPrimary },
                ]}
              >
                <ClockIcon color={colors.whitePrimary} size={18} />
              </View>

              <View>
                <Text style={[styles.title, { color: colors.blackPrimary }]}>
                  Specific Time
                </Text>
                <Text
                  style={[styles.subtitle, { color: colors.paragraphLight }]}
                >
                  Schedule app blocking
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {isLocked && !isUnlocked && (
          <View
            style={[
              styles.bottomContainer,
              {
                backgroundColor: colors.whitePrimary,
                borderTopColor: colors.borderColor,
              },
            ]}
          >
            <Button
              title="Unlock App"
              onPress={handleUnlock}
              wrapperStyle={{ marginTop: 'auto' }}
              buttonStyle={{
                height: 50,
                borderRadius: 14,
              }}
              labelStyle={{
                fontSize: 15,
                fontFamily: Fonts.primary_SemiBold,
              }}
            />
          </View>
        )}

        <OrderConfirm
          isVisible={confirmVisible}
          onClose={() => setConfirmVisible(false)}
          title="Unlock App?"
          description={`Unlocking ${app.name} will stop blocking.`}
          primaryText="Yes, Unlock"
          secondaryText="Cancel"
          onPrimaryPress={confirmUnlock}
        />

        {/* SUCCESS MODAL */}
        <OrderConfirm
          isVisible={successVisible}
          onClose={() => setSuccessVisible(false)}
          title="Unlocked"
          description={`${app.name} is now accessible`}
          primaryText="OK"
        />
        <OrderConfirm
          isVisible={quickBlockVisible}
          onClose={() => setQuickBlockVisible(false)}
          title="Block App Instantly?"
          description={`This will lock ${app.name} immediately until you unlock it.`}
          primaryText="Block App"
          secondaryText="Cancel"
          onPrimaryPress={confirmQuickBlock}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  appCard: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  appIcon: { width: 40, height: 40, borderRadius: 10, marginRight: 12 },
  appName: { fontFamily: Fonts.primary_SemiBold },

  blockCard: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },

  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  blockTitle: {
    fontFamily: Fonts.primary_SemiBold,
    fontSize: 14,
  },

  timeText: {
    fontSize: 22,
    fontFamily: Fonts.primary_SemiBold,
    marginBottom: 10,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 12,
    fontFamily: Fonts.primary_Regular,
  },

  container: {
    margin: 16,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },

  item: { padding: 16 },

  left: { flexDirection: 'row', alignItems: 'center' },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  title: { fontSize: 14, fontFamily: Fonts.primary_SemiBold },

  subtitle: {
    fontSize: 11,
    fontFamily: Fonts.primary_Regular,
    marginTop: 2,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },

  unlockBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  unlockText: {
    color: '#fff',
    fontFamily: Fonts.primary_SemiBold,
  },

  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000040',
  },

  modalCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },

  modalText: {
    fontFamily: Fonts.primary_SemiBold,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },

  bottomButton: {
    height: 52,
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomButtonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: Fonts.primary_SemiBold,
  },
});
