import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Congratulation from '../../components/modals/Congratulation';
import Container from '../../layout/Container';
import { useTheme } from '../../context/theme/ThemeContext';
import { useAppBlocker } from '../../context/AppBlockerContext';

import { Fonts } from '../../utils/typography';
import BackButton from '../../components/buttons/BackButton';
import WheelColumn from '../../components/WheelColumn';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ✅ 12-hour format data
const HOURS = Array.from({ length: 12 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, '0'),
);
const SECONDS = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, '0'),
);

export default function ScheduleBlockScreen({ navigation, route }) {
  const { colors } = useTheme();
  const state = useAppBlocker();
  const app = route.params?.app;
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDays, setSelectedDays] = useState(['Mon']);
  const [hour, setHour] = useState('00');
  const [minute, setMinute] = useState('00');
  const [second, setSecond] = useState('01');

  const toggleDay = day =>
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day],
    );

  const handleSave = () => {
    if (!app) return;
    if (!selectedDays.length) return Alert.alert('Select at least one day');
    state.relockApp(app.package);

    const h = parseInt(hour, 10);
    const m = parseInt(minute, 10);
    const s = parseInt(second, 10);

    const finalTime = h * 3600 + m * 60 + s;
    if (finalTime <= 0) return Alert.alert('Select valid time');

    //  ensure selected
    if (!state.selected.includes(app.package)) {
      state.toggleApp(app.package);
    }

    // set timer
    state.setTimer(app.package, finalTime);
    state.saveSchedule(app.package, selectedDays);
    state.saveApps([app.package]);

    setShowSuccess(true);
    navigation.goBack();
  };

  return (
    <Container>
      <View style={{ flex: 1, padding: 16 }}>
        <BackButton title="Schedule App Locking" />

        {/* APP CARD */}
        <View
          style={[
            styles.appCard,
            {
              backgroundColor: colors.grayLight,
              borderColor: colors.borderColor,
            },
          ]}
        >
          {app?.icon ? (
            <Image source={{ uri: app.icon }} style={styles.appIcon} />
          ) : (
            <View
              style={[
                styles.placeholderIcon,
                { backgroundColor: colors.placeholder },
              ]}
            />
          )}
          <Text
            style={[styles.appName, { color: colors.blackPrimary }]}
            numberOfLines={1}
          >
            {app?.name}
          </Text>
        </View>

        {/* DAYS */}
        <Text style={[styles.section, { color: colors.blackPrimary }]}>
          Select Days
        </Text>
        <View style={styles.daysRow}>
          {DAYS.map(day => {
            const active = selectedDays.includes(day);
            return (
              <TouchableOpacity
                key={day}
                onPress={() => toggleDay(day)}
                style={[
                  styles.dayBtn,
                  {
                    backgroundColor: active ? colors.accent : colors.grayLight,
                    borderColor: colors.borderColor,
                  },
                ]}
              >
                <Text
                  style={{
                    color: active ? colors.whitePrimary : colors.blackPrimary,
                    fontFamily: Fonts.primary_Medium,
                  }}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* TIME */}
        <Text style={[styles.section, { color: colors.blackPrimary }]}>
          Select Time
        </Text>

        <View
          style={[
            styles.timeCard,
            {
              borderColor: colors.borderColor,
              backgroundColor: colors.grayLight,
            },
          ]}
        >
          {/* COLUMN LABELS */}
          <View style={styles.labelsRow}>
            {['HR', 'MIN', 'SEC', ''].map((label, i) => (
              <View key={i} style={styles.labelCell}>
                <Text
                  style={[styles.colLabel, { color: colors.paragraphLight }]}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>

          {/* WHEELS */}
          <View style={styles.wheelsRow}>
            <WheelColumn data={HOURS} selected={hour} onChange={setHour} />
            <Text style={[styles.sep, { color: colors.blackPrimary }]}>:</Text>
            <WheelColumn
              data={MINUTES}
              selected={minute}
              onChange={setMinute}
            />
            <Text style={[styles.sep, { color: colors.blackPrimary }]}>:</Text>
            <WheelColumn
              data={SECONDS}
              selected={second}
              onChange={setSecond}
            />
          </View>

          {/* LIVE READOUT */}
          <Text style={[styles.readout, { color: colors.blackPrimary }]}>
            {hour}:{minute}:{second}
          </Text>
        </View>

        {/* SAVE */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.accent, marginTop: 'auto' },
          ]}
          onPress={handleSave}
        >
          <Text
            style={{
              color: colors.whitePrimary,
              fontFamily: Fonts.primary_SemiBold,
              fontSize: 15,
            }}
          >
            Save Schedule
          </Text>
        </TouchableOpacity>
      </View>
      <Congratulation
        isVisible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigation.goBack();
        }}
        title="Schedule Activated"
        description={``}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    marginVertical: 16,
  },
  appIcon: { width: 42, height: 42, borderRadius: 10, marginRight: 12 },
  placeholderIcon: { width: 42, height: 42, borderRadius: 10, marginRight: 12 },
  appName: { fontSize: 15, fontFamily: Fonts.primary_SemiBold, flex: 1 },

  section: {
    fontFamily: Fonts.primary_SemiBold,
    marginBottom: 10,
    fontSize: 14,
  },

  daysRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  dayBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },

  timeCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 8,
    marginBottom: 20,
  },

  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 4,
  },
  labelCell: { width: '34%', alignItems: 'center' },
  colLabel: {
    fontSize: 10,
    fontFamily: Fonts.primary_Medium,
    letterSpacing: 1,
  },

  wheelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  sep: { fontSize: 24, fontWeight: '300', marginBottom: 4 },

  divider: { width: 1, height: 48, marginHorizontal: 4 },

  readout: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 18,
    fontFamily: Fonts.primary_SemiBold,
    letterSpacing: 1,
  },

  button: { padding: 14, borderRadius: 12, alignItems: 'center' },
});
