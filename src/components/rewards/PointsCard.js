// components/rewards/PointsCard.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';

export default function PointsCard({
  points = 0,
  level = 3,
  progress = 60,
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.banner, { backgroundColor: colors.accent }]}>

      {/* GLOW EFFECTS */}
      <View style={styles.glow1} />
      <View style={styles.glow2} />

      {/* TOP ROW */}
      <View style={styles.topRow}>

        {/* LEFT ICON */}
        <View style={styles.iconWrap}>
          <Icon name="zap" size={20} color="#fff" />
        </View>

        {/* MID: XP value + subtitle */}
        <View style={styles.mid}>
          <View style={styles.ptsRow}>
            <Text style={styles.ptsValue}>{points.toLocaleString()}</Text>
            <Text style={styles.ptsUnit}> XP</Text>
          </View>
          <Text style={styles.sub} numberOfLines={1}>
            Earn XP by solving & unlocking apps
          </Text>
        </View>

        {/* RIGHT: Level pill + next level */}
        <View style={styles.rightCol}>
          <View style={styles.levelPill}>
            <Icon name="award" size={11} color="#fff" />
            <Text style={styles.levelText}>Level {level}</Text>
          </View>
          <Text style={styles.nextLevel}>Next: Level {level + 1}</Text>
        </View>

      </View>

      {/* PROGRESS BAR — BOTTOM */}
      <View style={styles.progWrap}>
        <View style={styles.progHeader}>
          <Text style={styles.progLabel}>XP Progress</Text>
          <View style={styles.pctBadge}>
            <Text style={styles.pctText}>{progress}%</Text>
          </View>
        </View>
        <View style={styles.progBg}>
          <View style={[styles.progFill, { width: `${progress}%` }]} />
        </View>
      </View>

    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({

  banner: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    overflow: 'hidden',
  },

  /* GLOW */
  glow1: {
    position: 'absolute',
    width: 130,
    height: 130,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 999,
    top: -50,
    right: -30,
  },
  glow2: {
    position: 'absolute',
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 999,
    bottom: -30,
    left: -20,
  },

  /* TOP ROW */
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },

  /* LEFT ICON */
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* MID */
  mid: {
    flex: 1,
  },
  ptsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ptsValue: {
    color: '#fff',
    fontSize: 24,
    fontFamily: Fonts.primary_Bold,
    lineHeight: 28,
  },
  ptsUnit: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontFamily: Fonts.primary_Regular,
  },
  sub: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11,
    marginTop: 3,
    fontFamily: Fonts.primary_Regular,
  },

  /* RIGHT COL */
  rightCol: {
    alignItems: 'flex-end',
    gap: 5,
  },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  levelText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: Fonts.primary_SemiBold,
  },
  nextLevel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 10,
    fontFamily: Fonts.primary_Regular,
  },

  /* PROGRESS */
  progWrap: {},
  progHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  progLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontFamily: Fonts.primary_Medium,
  },
  pctBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 10,
  },
  pctText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: Fonts.primary_SemiBold,
  },
  progBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progFill: {
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
  },

});