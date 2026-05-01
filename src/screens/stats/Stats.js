import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Container from '../../layout/Container';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';
import { StatesOutlineIcon } from '../../utils/svg';

export default function Stats() {
  const { colors } = useTheme();

  return (
    <Container>
      <View style={styles.wrapper}>
        {/* ICON */}
        <View
          style={[styles.iconCircle, { backgroundColor: colors.grayLight }]}
        >
          <StatesOutlineIcon color={colors.accent} size={32} />
        </View>

        {/* TITLE */}
        <Text style={[styles.title, { color: colors.blackPrimary }]}>
          Stats & Insights
        </Text>

        {/* SUBTITLE */}
        <Text style={[styles.subtitle, { color: colors.paragraphLight }]}>
          Your productivity analytics is coming soon
        </Text>

        {/* DESCRIPTION */}
        <Text style={[styles.desc, { color: colors.paragraphLight }]}>
          Track your screen time, blocked apps, and focus improvements with
          detailed insights.
        </Text>

        {/* BADGE */}
        <View
          style={[styles.badge, { backgroundColor: 'rgba(34,197,94,0.15)' }]}
        >
          <Text style={[styles.badgeText, { color: '#22C55E' }]}>
            Coming Soon
          </Text>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  icon: {
    fontSize: 40,
  },

  title: {
    fontSize: 24,
    fontFamily: Fonts.primary_Bold,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.primary_Medium,
    marginBottom: 12,
    textAlign: 'center',
  },

  desc: {
    fontSize: 13,
    textAlign: 'center',
    fontFamily: Fonts.primary_Regular,
    lineHeight: 18,
    marginBottom: 20,
  },

  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeText: {
    fontSize: 12,
    fontFamily: Fonts.primary_Medium,
  },
});
