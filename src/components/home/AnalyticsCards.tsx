import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';
import ClockIcon, { LockIcon } from '../../utils/svg';

type Props = {
  blockedApps: number;
  scheduledApps: number;      // lockedNow.length
};

export default function AnalyticsCards({ blockedApps, scheduledApps  }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* 🔒 APPS LOCKED */}
      <View style={[styles.card, { backgroundColor: colors.grayLight, borderColor: colors.borderColor }]}>
        <View style={[styles.icon, { borderColor: colors.accent, borderWidth: 1 }]}>
          <LockIcon color={colors.accent} size={16} />
        </View>
        <Text style={[styles.value, { color: colors.blackPrimary }]}>
          {blockedApps}
        </Text>
        <Text style={[styles.label, { color: colors.paragraphLight }]}>
          Apps Locked
        </Text>
      </View>

     <View style={[styles.card, { backgroundColor: colors.grayLight, borderColor: colors.borderColor }]}>
        <View style={[styles.icon, { borderColor: colors.accent, borderWidth: 1 }]}>
          <ClockIcon color={colors.accent} size={20} />
        </View>
        <Text style={[styles.value, { color: colors.blackPrimary }]}>{scheduledApps}</Text>
        <Text style={[styles.label, { color: colors.paragraphLight }]}>Schedules Set</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  value: {
    fontSize: 18,
    fontFamily: Fonts.primary_Bold,
  },
  label: {
    fontSize: 12,
    fontFamily: Fonts.primary_Regular,
    marginTop: 4,
  },
});