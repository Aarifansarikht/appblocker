import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';

import Container from '../../layout/Container';
import BackButton from '../../components/buttons/BackButton';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';
import { CONTAINER_SPACING } from '../../utils/constants';

import Icon from 'react-native-vector-icons/Feather';

/* ---------------- DATA ---------------- */

const HISTORY = [
  { q: '12 × 4 = ?', correct: true },
  { q: '5 + 9 = ?', correct: false },
  { q: '15 ÷ 3 = ?', correct: true },
];

const GRAPH_DATA = [
  { label: 'Mon', correct: 50, wrong: 50 },
  { label: 'Tue', correct: 30, wrong: 20 },
  { label: 'Wed', correct: 80, wrong: 10 },
  { label: 'Thu', correct: 40, wrong: 30 },
  { label: 'Fri', correct: 60, wrong: 20 },
  { label: 'Sat', correct: 70, wrong: 10 },
  { label: 'Sun', correct: 120, wrong: 120 },
];

const SUBJECTS = [
  { title: 'Math', progress: 80, color: '#3B82F6' },
  { title: 'Science', progress: 60, color: '#10B981' },
  { title: 'English', progress: 45, color: '#F59E0B' },
  { title: 'History', progress: 30, color: '#EF4444' },
];

/* ---------------- ANIMATED BAR ---------------- */

function AnimatedBar({ height, color, glowColor, delay = 0 }) {
  const anim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: height,
      duration: 600,
      delay,
      useNativeDriver: false,
    }).start();
  }, [height]);

  return (
    <Animated.View
      style={{
        height: anim,
        width: 13,
        backgroundColor: color,
        borderRadius: 99,
        // Outer pill border glow
        shadowColor: glowColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 6,
        elevation: 6,
        marginTop: 2,
        // Inner highlight strip via border
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.25)',
      }}
    />
  );
}

/* ---------------- MAIN ---------------- */

export default function LearningScreen() {
  const { colors } = useTheme();

  const [tab, setTab] = useState('Weekly');
  const [activeBar, setActiveBar] = useState(null);
  const [tooltipX, setTooltipX] = useState(0);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const barPositions = useRef({});

  const maxValue = useMemo(() => {
    return Math.max(...GRAPH_DATA.map(i => i.correct + i.wrong));
  }, []);

  const MAX_HEIGHT = 120;

  const showTooltip = (index, x) => {
    setActiveBar(index);
    setTooltipX(x);

    scaleAnim.setValue(0.8);
    opacityAnim.setValue(0);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Container>
      <View style={{ flex: 1 }}>

        <BackButton
          title="Learning Progress"
          wrapperStyle={{ padding: CONTAINER_SPACING }}
        />

        <ScrollView
          contentContainerStyle={{ padding: CONTAINER_SPACING }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onTouchStart={() => {
            if (activeBar !== null) setActiveBar(null);
          }}
        >

          {/* FILTER */}
          <View style={[styles.tabs, { backgroundColor: colors.grayLight }]}>
            {['Daily', 'Weekly', 'Monthly'].map(t => {
              const active = tab === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTab(t)}
                  style={[
                    styles.tabBtn,
                    {
                      backgroundColor: active ? colors.whitePrimary : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: active ? colors.blackPrimary : colors.paragraphLight,
                      fontFamily: Fonts.primary_SemiBold,
                    }}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── GRAPH CARD ── */}
          <View style={[styles.graphCard, { backgroundColor: colors.grayLight }]}>

            {/* Header row */}
            <View style={styles.graphHeader}>
              <Text style={[styles.graphTitle, { color: colors.blackPrimary }]}>
                Correct vs Wrong
              </Text>

              {/* Legend */}
              <View style={styles.legend}>
                <View style={[styles.legendDot, { backgroundColor: '#10B981', shadowColor: '#10B981' }]} />
                <Text style={[styles.legendText, { color: colors.paragraphLight }]}>Correct</Text>
                <View style={[styles.legendDot, { backgroundColor: '#EF4444', shadowColor: '#EF4444', marginLeft: 10 }]} />
                <Text style={[styles.legendText, { color: colors.paragraphLight }]}>Wrong</Text>
              </View>
            </View>

            {/* Horizontal guide lines */}
            <View style={styles.graphWrapper}>
              {[0, 1, 2, 3].map(i => (
                <View
                  key={i}
                  style={[
                    styles.guideLine,
                    {
                      bottom: (MAX_HEIGHT / 3) * i + 28,
                      borderColor: colors.borderColor,
                    },
                  ]}
                />
              ))}

              {/* BARS */}
              <View style={styles.graphBars}>
                {GRAPH_DATA.map((item, i) => {
                  const correctHeight = (item.correct / maxValue) * MAX_HEIGHT;
                  const wrongHeight = (item.wrong / maxValue) * MAX_HEIGHT;
                  const isActive = activeBar === i;

                  return (
                    <TouchableOpacity
                      key={i}
                      activeOpacity={0.8}
                      onLayout={e => {
                        barPositions.current[i] = e.nativeEvent.layout.x;
                      }}
                      onPress={() => showTooltip(i, barPositions.current[i] || 0)}
                      style={[
                        styles.barItem,
                        {
                          // Outer pill container highlight when active
                          backgroundColor: isActive
                            ? 'rgba(255,255,255,0.07)'
                            : 'transparent',
                          borderRadius: 20,
                          paddingHorizontal: 4,
                          paddingVertical: 4,
                        },
                      ]}
                    >
                      {/* Outer pill wrapper — the unique "border around both bars" */}
                      <View
                        style={[
                          styles.pillWrapper,
                          {
                            borderColor: isActive
                              ? 'rgba(255,255,255,0.3)'
                              : 'rgba(255,255,255,0.08)',
                            backgroundColor: isActive
                              ? 'rgba(255,255,255,0.05)'
                              : 'rgba(0,0,0,0.04)',
                          },
                        ]}
                      >
                        <AnimatedBar
                          height={wrongHeight}
                          color="#EF4444"
                          glowColor="#EF4444"
                          delay={i * 60}
                        />
                        <AnimatedBar
                          height={correctHeight}
                          color="#10B981"
                          glowColor="#10B981"
                          delay={i * 60 + 80}
                        />
                      </View>

                      <Text
                        style={[
                          styles.barLabel,
                          {
                            color: isActive
                              ? colors.blackPrimary
                              : colors.paragraphLight,
                            fontFamily: isActive
                              ? Fonts.primary_SemiBold
                              : Fonts.primary_Medium,
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* TOOLTIP */}
              {activeBar !== null && (
                <Animated.View
                  style={[
                    styles.tooltip,
                    {
                      left: Math.min(tooltipX - 10, 220),
                      opacity: opacityAnim,
                      transform: [{ scale: scaleAnim }],
                    },
                  ]}
                >
                  {/* Tooltip arrow */}
                  <View style={styles.tooltipArrow} />

                  <Text style={styles.tooltipTitle}>
                    {GRAPH_DATA[activeBar].label}
                  </Text>

                  <View style={styles.tooltipRow}>
                    <View style={[styles.tooltipDot, { backgroundColor: '#10B981' }]} />
                    <Text style={[styles.tooltipText, { color: '#10B981' }]}>
                      Correct: {GRAPH_DATA[activeBar].correct}
                    </Text>
                  </View>

                  <View style={styles.tooltipRow}>
                    <View style={[styles.tooltipDot, { backgroundColor: '#EF4444' }]} />
                    <Text style={[styles.tooltipText, { color: '#EF4444' }]}>
                      Wrong: {GRAPH_DATA[activeBar].wrong}
                    </Text>
                  </View>
                </Animated.View>
              )}
            </View>
          </View>

          {/* SUBJECTS */}
          <Text style={[styles.section, { color: colors.blackPrimary }]}>
            Subjects
          </Text>

          <View style={styles.grid}>
            {SUBJECTS.map((item, i) => (
              <View
                key={i}
                style={[styles.subjectCard, { backgroundColor: colors.grayLight }]}
              >
                <Text style={[styles.subjectTitle, { color: colors.blackPrimary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.percent, { color: colors.blackPrimary }]}>
                  {item.progress}%
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={{
                      width: `${item.progress}%`,
                      backgroundColor: item.color,
                      height: 6,
                      borderRadius: 10,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* HISTORY */}
          <Text style={[styles.section, { color: colors.blackPrimary }]}>
            Recent Activity
          </Text>

          {HISTORY.map((item, i) => (
            <View
              key={i}
              style={[
                styles.historyCard,
                { backgroundColor: colors.grayLight, borderColor: colors.borderColor },
              ]}
            >
              <View style={styles.historyRow}>
                <Icon
                  name={item.correct ? 'check-circle' : 'x-circle'}
                  size={20}
                  color={item.correct ? '#10B981' : '#EF4444'}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.question, { color: colors.blackPrimary }]}>
                    {item.q}
                  </Text>
                  <Text style={{ color: item.correct ? '#10B981' : '#EF4444', fontFamily: Fonts.primary_Medium }}>
                    {item.correct ? 'Correct' : 'Wrong'}
                  </Text>
                </View>
              </View>
            </View>
          ))}

        </ScrollView>
      </View>
    </Container>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },

  // ── Graph ──
  graphCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
  },
  graphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  graphTitle: {
    fontFamily: Fonts.primary_SemiBold,
    fontSize: 14,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  legendText: {
    fontSize: 11,
    fontFamily: Fonts.primary_Medium,
    marginLeft: 4,
  },
  graphWrapper: {
    position: 'relative',
    paddingTop: 10,
  },
  guideLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
  },
  graphBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 4,
  },
  barItem: {
    alignItems: 'center',
  },

  // The outer pill border wrapping both bars
  pillWrapper: {
    height: 140,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 3,
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 5,
    paddingBottom: 6,
  },

  barLabel: {
    fontSize: 10,
    marginTop: 6,
  },

  // ── Tooltip ──
  tooltip: {
    position: 'absolute',
    bottom: 155,
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minWidth: 110,
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -7,
    left: 18,
    width: 14,
    height: 14,
    backgroundColor: '#1a1a2e',
    transform: [{ rotate: '45deg' }],
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tooltipTitle: {
    color: '#fff',
    fontSize: 12,
    fontFamily: Fonts.primary_SemiBold,
    marginBottom: 6,
  },
  tooltipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  tooltipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tooltipText: {
    fontSize: 11,
    fontFamily: Fonts.primary_Medium,
  },

  // ── Rest ──
  section: {
    fontFamily: Fonts.primary_Bold,
    fontSize: 16,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subjectCard: {
    width: '48%',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  subjectTitle: {
    fontFamily: Fonts.primary_SemiBold,
  },
  percent: {
    fontSize: 18,
    fontFamily: Fonts.primary_Bold,
    marginVertical: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  historyCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  question: {
    fontFamily: Fonts.primary_SemiBold,
  },
});