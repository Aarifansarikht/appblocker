import React, { useRef, useEffect, useCallback } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../context/theme/ThemeContext';
import { Fonts } from '../utils/typography';

const ITEM_H = 48;
const VISIBLE = 5;
const PAD = Math.floor(VISIBLE / 2); // 2

export default function WheelColumn({ data, selected, onChange }) {
  const { colors } = useTheme();
  const ref = useRef(null);
  const isScrolling = useRef(false);

  // ✅ Set initial position after layout
  useEffect(() => {
    const index = data.indexOf(selected);
    if (index >= 0) {
      setTimeout(() => {
        ref.current?.scrollTo({ y: index * ITEM_H, animated: false });
      }, 50);
    }
  }, []);

  const snapToIndex = useCallback(
    index => {
      const clamped = Math.max(0, Math.min(data.length - 1, index));
      ref.current?.scrollTo({ y: clamped * ITEM_H, animated: true });
      onChange(data[clamped]);
    },
    [data, onChange],
  );

  const onScrollEndDrag = useCallback(
    e => {
      if (isScrolling.current) return;
      const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
      snapToIndex(index);
    },
    [snapToIndex],
  );

  const onMomentumScrollEnd = useCallback(
    e => {
      isScrolling.current = false;
      const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
      snapToIndex(index);
    },
    [snapToIndex],
  );

  return (
    <View style={styles.outer}>
      {/* TOP FADE */}
      <View
        style={[
          styles.fade,
          styles.fadeTop,
          { backgroundColor: colors.grayLight },
        ]}
        pointerEvents="none"
      />

      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        snapToAlignment="start"
        decelerationRate={0.85}
        bounces={false}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => {
          isScrolling.current = true;
        }}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollBegin={() => {
          isScrolling.current = true;
        }}
        onMomentumScrollEnd={onMomentumScrollEnd}
        contentContainerStyle={{ paddingVertical: ITEM_H * PAD }}
        nestedScrollEnabled
      >
        {data.map((item, i) => {
          const active = item === selected;
          const near =
            Math.abs(data.indexOf(item) - data.indexOf(selected)) === 1;
          return (
            <View key={i} style={styles.item}>
              <Text
                style={[
                  styles.itemText,
                  { color: colors.blackPrimary },
                  active && styles.itemActive,
                  near && styles.itemNear,
                  !active && !near && styles.itemFaded,
                ]}
              >
                {item}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* BOTTOM FADE */}
      <View
        style={[
          styles.fade,
          styles.fadeBot,
          { backgroundColor: colors.grayLight },
        ]}
        pointerEvents="none"
      />

      {/* CENTER SELECTOR */}
      <View style={styles.centerLine} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 64,
    height: ITEM_H * VISIBLE,
    overflow: 'hidden',
  },

  item: {
    height: ITEM_H,
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemText: {
    fontSize: 16,
    fontFamily: Fonts.primary_Regular,
  },

  itemActive: {
    fontSize: 24,
    fontFamily: Fonts.primary_SemiBold,
    opacity: 1,
  },

  itemNear: {
    fontSize: 19,
    opacity: 1.9,
  },

  itemFaded: {
    opacity: 0.2,
  },

  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ITEM_H * PAD,
    zIndex: 2,
    opacity: 0.92,
  },
  fadeTop: { top: 0 },
  fadeBot: { bottom: 0 },

  centerLine: {
    position: 'absolute',
    top: ITEM_H * PAD,
    left: 4,
    right: 4,
    height: ITEM_H,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    zIndex: 3,
  },
});
