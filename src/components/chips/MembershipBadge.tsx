import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';

export default function MembershipBadge() {
  const { colors } = useTheme();
  const navigation: any = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('SubscriptionScreen')}
      style={[
        styles.container,
        {
  
          borderWidth: 1,
          borderColor: colors.accent,
        },
      ]}
    >
      {/* DOT */}
      <View style={[styles.dot,{backgroundColor: colors.accent}]} />

      <Text style={[styles.text, { color: colors.accent }]}>
        Go Premium
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 999, // 🔥 pill shape
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
   
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontFamily: Fonts.primary_SemiBold,
  },
});