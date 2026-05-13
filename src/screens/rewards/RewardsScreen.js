import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import Container from '../../layout/Container';
import BackButton from '../../components/buttons/BackButton';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';
import { CONTAINER_SPACING } from '../../utils/constants';

import Icon from 'react-native-vector-icons/Feather';
import PointsCard from '../../components/rewards/PointsCard';
import ChallengeCard from '../../components/rewards/ChallengeCard';
import Spacer from '../../components/shared/Spacer';

/* ---------------- LEVEL SYSTEM ---------------- */

const LEVELS = [
  { level: 1, min: 0, max: 100 },
  { level: 2, min: 100, max: 250 },
  { level: 3, min: 250, max: 500 },
  { level: 4, min: 500, max: 1000 },
  { level: 5, min: 1000, max: Infinity },
];

const getLevelData = (points) => {
  const current = LEVELS.find(l => points >= l.min && points < l.max);
  const next = LEVELS.find(l => l.level === current.level + 1);

  const progress = next
    ? ((points - current.min) / (current.max - current.min)) * 100
    : 100;

  return {
    level: current.level,
    progress,
    nextPoints: next ? next.min - points : 0,
  };
};

/* ---------------- DATA ---------------- */

export const REWARDS = [
  {
    id: 1,
    icon: 'codesandbox',
    title: 'Solve 50 Questions',
    desc: 'Improve focus & unlock apps faster',
    progress: 32,
    total: 50,
    points: 100,
  },
  {
    id: 2,
    icon: 'unlock',
    title: 'Unlock Apps 10 Times',
    desc: 'Stay productive & earn rewards',
    progress: 6,
    total: 10,
    points: 50,
  },
  {
    id: 3,
    icon: 'zap',
    title: 'Use Quick Block 5 Times',
    desc: 'Control distractions instantly',
    progress: 3,
    total: 5,
    points: 30,
  },
];

const ACHIEVEMENTS = [
  { title: 'First Unlock', icon: 'award', done: true },
  { title: 'Solved 100 Questions', icon: 'target', done: false },
  { title: 'Focus Master', icon: 'star', done: false },
];

/* ---------------- MAIN ---------------- */

export default function RewardsScreen() {
  const { colors } = useTheme();
  const [points] = useState(240);

  const level = getLevelData(points);

  return (
    <Container>
      <View style={{ flex: 1 }}>
        <BackButton
          title="Rewards"
          wrapperStyle={{ padding: CONTAINER_SPACING }}
        />

        <ScrollView contentContainerStyle={{ padding: CONTAINER_SPACING }}>

          {/* 🔥 POINTS */}
          <PointsCard points={points} />

          {/* 🧠 LEVEL CARD */}
          <View style={[styles.levelCard, { backgroundColor: colors.grayLight }]}>
            <View style={styles.levelRow}>
              <View style={styles.levelLeft}>
                <Icon name="award" size={18} color={colors.accent} />
                <Text style={[styles.levelTitle, { color: colors.blackPrimary }]}>
                  Level {level.level}
                </Text>
              </View>

              <Text style={{ color: colors.paragraphLight, fontSize: 12 }}>
                {level.nextPoints} pts to next
              </Text>
            </View>

            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${level.progress}%`,
                    backgroundColor: colors.accent,
                  },
                ]}
              />
            </View>
          </View>

          {/* 📘 HOW TO LEVEL UP */}
          <Text style={[styles.section, { color: colors.blackPrimary }]}>
            How to Level Up
          </Text>

          <View style={[styles.card, { backgroundColor: colors.grayLight }]}>

            <LevelItem icon="check-circle" text="Solve correct answers" colors={colors} />
            <LevelItem icon="unlock" text="Unlock apps using challenges" colors={colors} />
            <LevelItem icon="zap" text="Use Quick Block to stay focused" colors={colors} />
            <LevelItem icon="target" text="Complete challenges for bonus points" colors={colors} />

          </View>

          <Spacer space={'3%'} />

          {/* 🎯 CHALLENGES */}
          <Text style={[styles.section, { color: colors.blackPrimary }]}>
            Challenges
          </Text>

          {REWARDS.map(item => (
            <ChallengeCard key={item.id} item={item} />
          ))}

          {/* 🏆 ACHIEVEMENTS */}
          <Text style={[styles.section, { color: colors.blackPrimary }]}>
            Achievements
          </Text>

          <View style={[styles.card, { backgroundColor: colors.grayLight }]}>
            {ACHIEVEMENTS.map((a, i) => (
              <View key={i} style={styles.achievementRow}>
                <View
                  style={[
                    styles.achievementIcon,
                    {
                      backgroundColor: a.done
                        ? '#10B98120'
                        : colors.borderColor,
                    },
                  ]}
                >
                  <Icon
                    name={a.icon}
                    size={16}
                    color={a.done ? '#10B981' : '#888'}
                  />
                </View>

                <Text
                  style={{
                    marginLeft: 12,
                    color: colors.blackPrimary,
                    fontFamily: Fonts.primary_Medium,
                  }}
                >
                  {a.title}
                </Text>
              </View>
            ))}
          </View>

        </ScrollView>
      </View>
    </Container>
  );
}

/* ---------------- SMALL COMPONENT ---------------- */

const LevelItem = ({ icon, text, colors }) => (
  <View style={styles.levelItem}>
    <Icon name={icon} size={16} color={colors.accent} />
    <Text style={[styles.levelText, { color: colors.blackPrimary }]}>
      {text}
    </Text>
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({

  section: {
    fontSize: 16,
    fontFamily: Fonts.primary_Bold,
    marginBottom: 12,
  },

  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  /* LEVEL */
  levelCard: {
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    marginBottom: 16,
  },

  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  levelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  levelTitle: {
    fontFamily: Fonts.primary_SemiBold,
  },

  progressBg: {
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginTop: 12,
  },

  progressFill: {
    height: 6,
    borderRadius: 10,
  },

  /* HOW TO LEVEL */
  levelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },

  levelText: {
    fontFamily: Fonts.primary_Medium,
    fontSize: 13,
  },

  /* ACHIEVEMENTS */
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  achievementIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

});