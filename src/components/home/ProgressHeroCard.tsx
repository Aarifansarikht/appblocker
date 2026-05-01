import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';
import { ShieldIcon } from '../../utils/svg';

type Props = {
  unlocked: number;
  total: number;
};

export default function ProgressHeroCard({ unlocked, total }: Props) {
  const { colors } = useTheme();

  const progress = useRef(new Animated.Value(0)).current;

  // ✅ FIX CALCULATION
  const safeTotal = total <= 0 ? 0 : total;
  let percent = safeTotal === 0 ? 0 : (unlocked / safeTotal) * 100;

  // clamp 0 → 100
  percent = Math.max(0, Math.min(percent, 100));

  // ✅ ANIMATION
  useEffect(() => {
    Animated.timing(progress, {
      toValue: percent,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  const widthInterpolate = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.grayLight,
          borderColor: colors.borderColor,
        },
      ]}
    >
      {/* TOP */}
      <View style={styles.row}>
        <View style={styles.left}>
          <View
            style={[
              styles.icon,
              { borderColor: colors.accent, borderWidth: 1 },
            ]}
          >
            <ShieldIcon color={colors.accent} size={20} />
          </View>

          <View>
            <Text style={[styles.title, { color: colors.blackPrimary }]}>
              Focus Progress
            </Text>
            <Text style={[styles.subtitle, { color: colors.paragraphLight }]}>
              Unlock apps by completing tasks
            </Text>
          </View>
        </View>

        <Text style={[styles.percent, { color: colors.blackPrimary }]}>
          {Math.round(percent)}%
        </Text>
      </View>

      {/* BAR */}
      <View style={[styles.bar, { backgroundColor: colors.borderColor }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthInterpolate,
              backgroundColor: colors.accent,
            },
          ]}
        />
      </View>

      {/* INFO */}
      <Text style={[styles.info, { color: colors.paragraphLight }]}>
        {safeTotal === 0
          ? 'No apps selected'
          : `${unlocked} of ${total} apps unlocked`}
      </Text>
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  title: {
    fontSize: 14,
    fontFamily: Fonts.primary_SemiBold,
  },

  subtitle: {
    fontSize: 11,
    fontFamily: Fonts.primary_Regular,
  },

  percent: {
    fontSize: 16,
    fontFamily: Fonts.primary_Bold,
  },

  bar: {
    height: 8,
    borderRadius: 10,
    marginTop: 14,
    overflow: 'hidden',
  },

  fill: {
    height: 8,
    borderRadius: 10,
  },

  info: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: Fonts.primary_Regular,
  },
});