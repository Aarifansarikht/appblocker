import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

import Container from '../../layout/Container';
import BackButton from '../../components/buttons/BackButton';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';
import { CONTAINER_SPACING } from '../../utils/constants';

import { LockIcon } from '../../utils/svg';
import ClockIcon from '../../utils/svg';

export default function NotificationSettingsScreen() {
  const { colors } = useTheme();

  const [blockedNotif, setBlockedNotif] = useState(true);
  const [scheduleNotif, setScheduleNotif] = useState(true);
  const [quickBlockNotif, setQuickBlockNotif] = useState(true);

  return (
    <Container>
      <View style={{ flex: 1 }}>
        
          <BackButton
            title="Notifications"
            wrapperStyle={{ padding: CONTAINER_SPACING }}
          />
        {/* HEADER */}
       

        {/* CARD LIST */}
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.grayLight,
              borderColor: colors.borderColor,
            },
          ]}
        >

          {/* BLOCKED APP */}
          <Row
            title="Blocked App Alerts"
            subtitle="Notify when app gets locked"
            value={blockedNotif}
            onToggle={setBlockedNotif}
            colors={colors}
            icon={<LockIcon color={colors.whitePrimary} size={16} />}
          />

          <Divider colors={colors} />

          {/* SCHEDULE */}
          <Row
            title="Schedule Notifications"
            subtitle="Reminder before blocking starts"
            value={scheduleNotif}
            onToggle={setScheduleNotif}
            colors={colors}
            icon={<ClockIcon color={colors.whitePrimary} size={16} />}
          />

          <Divider colors={colors} />

          {/* QUICK BLOCK */}
          <Row
            title="Quick Block Alerts"
            subtitle="Notify when instant block is triggered"
            value={quickBlockNotif}
            onToggle={setQuickBlockNotif}
            colors={colors}
            icon={<LockIcon color={colors.whitePrimary} size={16} />}
          />

        </View>
      </View>
    </Container>
  );
}

/* ---------------- ROW COMPONENT ---------------- */

const Row = ({ title, subtitle, value, onToggle, colors, icon }) => {
  return (
    <View style={styles.item}>
      
      {/* LEFT */}
      <View style={styles.left}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: colors.blackPrimary },
          ]}
        >
          {icon}
        </View>

        <View>
          <Text style={[styles.title, { color: colors.blackPrimary }]}>
            {title}
          </Text>

          <Text style={[styles.subtitle, { color: colors.paragraphLight }]}>
            {subtitle}
          </Text>
        </View>
      </View>

      {/* RIGHT SWITCH */}
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.borderColor, true: colors.accent }}
        thumbColor={colors.accent}
      />
    </View>
  );
};

/* ---------------- DIVIDER ---------------- */

const Divider = ({ colors }) => (
  <View style={{ height: 1, backgroundColor: colors.borderColor }} />
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    margin: 14,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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