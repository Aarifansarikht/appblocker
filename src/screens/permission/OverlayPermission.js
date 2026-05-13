import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

import Container from '../../layout/Container';
import { useTheme } from '../../context/theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Navigate_Bottom, Navigate_Home, Navigate_Usage } from '../../routes/path';
import AppService from '../../native/AppService';
import { Fonts } from '../../utils/typography';
import { ImagePath } from '../../utils/images';

import Button from '../../components/buttons/Button';

export default function OverlayPermission() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const handlePress = async () => {
    AppService.requestOverlayPermission();
    setTimeout(() => {
      navigation.replace(Navigate_Usage);
    }, 300);
  };

  return (
    <Container statusBarColor={undefined} barStyle={undefined}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.replace(Navigate_Usage)}
            style={[
              styles.closeBtn,
              {
                borderColor: colors.borderColor,
                backgroundColor: colors.grayLight,
              },
            ]}
          >
            <Text style={[styles.closeText, { color: colors.accent }]}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* ICON CARD */}
        <View
          style={{
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image source={ImagePath.logo} style={{ width: 140, height: 140 }} />
        </View>
        {/* TITLE */}
        <Text style={[styles.title, { color: colors.blackPrimary }]}>Permission Required</Text>

        {/* BADGE */}
        <View style={[styles.badge, { backgroundColor: colors.accent }]}>
          <Text style={[styles.badgeText, { color: colors.whitePrimary }]}>Overlay</Text>
        </View>

        {/* DESCRIPTION */}
        <Text style={[styles.desc, { color: colors.paragraphLight }]}>Allow overlay permission to display lock screen over apps.</Text>

        {/* STEPS */}
        <Step number="1" text="Open display over apps" colors={colors} />
        <Step number="2" text="Find your app" colors={colors} />
        <Step number="3" text="Enable permission" colors={colors} />

        {/* BUTTON */}
        <Button title="Go to Settings" onPress={handlePress} wrapperStyle={{ marginTop: 'auto' }} />
      </View>
    </Container>
  );
}

/* ---------------- STEP ---------------- */

const Step = ({ number, text, colors }) => (
  <View
    style={[
      styles.step,
      {
        backgroundColor: colors.grayLight,
        borderColor: colors.borderColor,
      },
    ]}
  >
    <View style={[styles.circle, { backgroundColor: colors.accent }]}>
      <Text style={{ color: colors.whitePrimary, fontFamily: Fonts.primary_Bold }}>{number}</Text>
    </View>

    <Text
      style={{
        color: colors.blackPrimary,
        fontFamily: Fonts.primary_Medium,
      }}
    >
      {text}
    </Text>
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },

  closeText: {
    fontSize: 16,
    fontFamily: Fonts.primary_SemiBold,
  },

  iconCard: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    textAlign: 'center',
    fontFamily: Fonts.primary_Bold,
  },

  badge: {
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 24,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    fontFamily: Fonts.primary_Medium,
    fontSize: 12,
  },

  desc: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 24,
    fontFamily: Fonts.primary_Regular,
  },

  step: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
  },

  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});
