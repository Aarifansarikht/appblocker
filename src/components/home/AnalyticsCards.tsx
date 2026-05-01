import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';
import ClockIcon, { LockIcon } from '../../utils/svg';

type Props = {
  blockedApps: number;
  timeSaved: number; // in seconds
};

export default function AnalyticsCards({ blockedApps, timeSaved }: Props) {
  const { colors } = useTheme();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);

    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    if (mins > 0) return `${mins}m`;
    return `${seconds}s`;
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.grayLight,
            borderColor: colors.borderColor,
          },
        ]}
      >
        <View
          style={[styles.icon, { borderColor: colors.accent, borderWidth: 1 }]}
        >
          <LockIcon color={colors.accent} size={16} />
        </View>

        <Text style={[styles.value, { color: colors.blackPrimary }]}>
          {blockedApps}
        </Text>

        <Text style={[styles.label, { color: colors.paragraphLight }]}>
          Apps Locked
        </Text>
      </View>

      {/* ⏱️ TIME SAVED */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.grayLight,
            borderColor: colors.borderColor,
          },
        ]}
      >
        <View
          style={[styles.icon, { borderColor: colors.accent, borderWidth: 1 }]}
        >
          <ClockIcon color={colors.accent} size={20} />
        </View>

        <Text style={[styles.value, { color: colors.blackPrimary }]}>
          {formatTime(timeSaved)}
        </Text>

        <Text style={[styles.label, { color: colors.paragraphLight }]}>
          Time Saved
        </Text>
      </View>
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12, // ✅ BEST way (RN 0.71+)
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
