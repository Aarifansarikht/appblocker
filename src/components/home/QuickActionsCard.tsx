import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';
import ClockIcon, { BoxOpenIcon, LockIcon } from '../../utils/svg';

type Props = {
  onAppsPress: () => void;
  onRewardsPress: () => void;
};

export default function QuickActionsCard({
  onAppsPress,
  onRewardsPress,
}: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.grayLight,
          borderColor: colors.borderColor,
        },
      ]}
    >
      {/* 🔒 APPS BLOCKED */}
      <TouchableOpacity
        style={styles.item}
        onPress={onAppsPress}
        activeOpacity={0.8}
      >
        <View style={[styles.iconWrap, { borderColor: colors.accent,borderWidth: 1, }]}>
          <LockIcon color={colors.accent} size={18} />
        </View>

        <View style={styles.textWrap}>
          <Text style={[styles.title, { color: colors.blackPrimary }]}>
            Lock Apps to learn
          </Text>
          <Text style={[styles.subtitle, { color: colors.paragraphLight }]}>
            Manage blocked apps
          </Text>
        </View>
      </TouchableOpacity>

      {/* DIVIDER */}
      <View
        style={{
          height: 1,
          backgroundColor: colors.borderColor,
          marginVertical: 10,
        }}
      />

      {/* 🎁 REWARDS */}
      <TouchableOpacity
        style={styles.item}
        onPress={onRewardsPress}
        activeOpacity={0.8}
      >
        <View style={[styles.iconWrap, {  borderColor: colors.accent, borderWidth: 1}]}>
          <BoxOpenIcon color={colors.accent} size={18} />
        </View>

        <View style={styles.textWrap}>
          <Text style={[styles.title, { color: colors.blackPrimary }]}>
            Rewards
          </Text>
          <Text style={[styles.subtitle, { color: colors.paragraphLight }]}>
            Earn focus rewards
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  textWrap: {
    flex: 1,
  },

  title: {
    fontSize: 14,
    fontFamily: Fonts.primary_SemiBold,
  },

  subtitle: {
    fontSize: 11,
    fontFamily: Fonts.primary_Regular,
    marginTop: 2,
  },
});