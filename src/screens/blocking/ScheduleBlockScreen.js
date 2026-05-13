// ScheduleBlockScreen.jsx — OPTIMIZED

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Congratulation from "../../components/modals/Congratulation";
import Container from "../../layout/Container";
import { useTheme } from "../../context/theme/ThemeContext";
import { useAppBlocker } from "../../context/AppBlockerContext";
import Button from "../../components/buttons/Button";
import { Fonts } from "../../utils/typography";
import BackButton from "../../components/buttons/BackButton";
import WheelColumn from "../../components/WheelColumn";

// ─── Static data outside component — created once, never recreated ───────────
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const AMPM = ["AM", "PM"];
const DAY_MAP = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Pure helpers — defined once at module level ───────────────────────────
const toMinutes = (hour, minute, ampm) => {
  let h = parseInt(hour, 10);
  if (ampm === "AM" && h === 12) h = 0;
  if (ampm === "PM" && h !== 12) h += 12;
  return h * 60 + parseInt(minute, 10);
};

const fromMinutesToPicker = (totalMins) => {
  if (totalMins < 0) return null;
  const h24 = Math.floor(totalMins / 60);
  const minute = String(totalMins % 60).padStart(2, "0");
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 || 12;
  return { hour: String(h12).padStart(2, "0"), minute, ampm };
};

const getToday = () => DAY_MAP[new Date().getDay()];

// ─── TimePicker — memoized, only re-renders when its own props change ────────
const TimePicker = React.memo(function TimePicker({
  label, hour, minute, ampm, onHour, onMinute, onAmpm, colors,
}) {
  return (
    <View style={styles.timePickerFlex}>
      <Text style={[styles.section, { color: colors.blackPrimary }]}>{label}</Text>
      <View style={[styles.timeCard, { borderColor: colors.borderColor, backgroundColor: colors.grayLight }]}>
        <View style={styles.labelsRow}>
          {LABEL_CELLS.map(({ key, label: l }) => (
            <View key={key} style={styles.labelCell}>
              <Text style={[styles.colLabel, { color: colors.paragraphLight }]}>{l}</Text>
            </View>
          ))}
        </View>
        <View style={styles.wheelsRow}>
          <WheelColumn data={HOURS_12} selected={hour} onChange={onHour} />
          <Text style={[styles.sep, { color: colors.blackPrimary }]}>:</Text>
          <WheelColumn data={MINUTES} selected={minute} onChange={onMinute} />
          <View style={styles.ampmCol}>
            {AMPM.map(v => (
              <AmpmButton
                key={v}
                value={v}
                active={ampm === v}
                onPress={onAmpm}
                colors={colors}
              />
            ))}
          </View>
        </View>
        <Text style={[styles.readout, { color: colors.blackPrimary }]}>
          {hour}:{minute} {ampm}
        </Text>
      </View>
    </View>
  );
});

// ─── AmpmButton — memoized, avoids re-render of inactive button ──────────────
const AmpmButton = React.memo(function AmpmButton({ value, active, onPress, colors }) {
  const handlePress = useCallback(() => onPress(value), [onPress, value]);
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.ampmBtn,
        { backgroundColor: active ? colors.accent : "transparent" },
      ]}
    >
      <Text
        style={[
          styles.ampmText,
          { color: active ? colors.whitePrimary : colors.blackPrimary, fontFamily: Fonts.primary_SemiBold },
        ]}
      >
        {value}
      </Text>
    </TouchableOpacity>
  );
});

// ─── DayButton — memoized, avoids re-rendering untouched days ────────────────
const DayButton = React.memo(function DayButton({ day, active, onPress, colors }) {
  const handlePress = useCallback(() => onPress(day), [onPress, day]);
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.dayBtn,
        { backgroundColor: active ? colors.accent : colors.grayLight, borderColor: colors.borderColor },
      ]}
    >
      <Text style={{ color: active ? colors.whitePrimary : colors.blackPrimary, fontFamily: Fonts.primary_Medium }}>
        {day}
      </Text>
    </TouchableOpacity>
  );
});

// Static label config — never recreated
const LABEL_CELLS = [
  { key: "hr",  label: "HR"  },
  { key: "min", label: "MIN" },
  { key: "ap",  label: ""    },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ScheduleBlockScreen({ navigation, route }) {
  const { colors } = useTheme();
  const state = useAppBlocker();
  const app = route.params?.app;

  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDays, setSelectedDays] = useState(() => [getToday()]);
  const [fromHour,   setFromHour]   = useState("01");
  const [fromMinute, setFromMinute] = useState("00");
  const [fromAmpm,   setFromAmpm]   = useState("AM");
  const [toHour,   setToHour]   = useState("02");
  const [toMinute, setToMinute] = useState("00");
  const [toAmpm,   setToAmpm]   = useState("AM");

  // Stable ref to getSchedule — avoids stale-closure / effect dependency issues
  const getScheduleRef = useRef(state.getSchedule);
  useEffect(() => { getScheduleRef.current = state.getSchedule; }, [state.getSchedule]);

  // ── Fetch schedule once on mount ──────────────────────────────────────────
  useEffect(() => {
    if (!app?.package) return;
    let cancelled = false;

    getScheduleRef.current(app.package).then(result => {
      if (cancelled) return;
      const days = result?.days ?? [];
      const from = result?.from ?? -1;
      const to   = result?.to   ?? -1;

      if (days.length > 0) setSelectedDays(days);

      if (from >= 0) {
        const p = fromMinutesToPicker(from);
        setFromHour(p.hour);
        setFromMinute(p.minute);
        setFromAmpm(p.ampm);
      }
      if (to >= 0) {
        const p = fromMinutesToPicker(to);
        setToHour(p.hour);
        setToMinute(p.minute);
        setToAmpm(p.ampm);
      }
    });

    return () => { cancelled = true; };
  }, [app?.package]); // safe: getSchedule via ref, package is stable

  // ── Stable callbacks ──────────────────────────────────────────────────────
  const toggleDay = useCallback((day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }, []);

  // Stable ref to state methods — so handleSave doesn't re-create on every render
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const handleSave = useCallback(() => {
    const { relockApp, clearTimer, selected, toggleApp, saveSchedule, saveApps } = stateRef.current;
    if (!app) return;
    if (!selectedDays.length) return Alert.alert("Select at least one day");

    const fromMins = toMinutes(fromHour, fromMinute, fromAmpm);
    const toMins   = toMinutes(toHour,   toMinute,   toAmpm);

    if (toMins <= fromMins) return Alert.alert("End time must be after start time");

    relockApp(app.package);
    clearTimer(app.package);

    if (!selected.includes(app.package)) toggleApp(app.package);

    saveSchedule(app.package, selectedDays, fromMins, toMins);

    const updatedApps = selected.includes(app.package)
      ? selected
      : [...selected, app.package];
    saveApps(updatedApps);

    setShowSuccess(true);
    navigation.goBack();
  }, [app, selectedDays, fromHour, fromMinute, fromAmpm, toHour, toMinute, toAmpm, navigation]);

  const handleSuccessClose = useCallback(() => {
    setShowSuccess(false);
    navigation.goBack();
  }, [navigation]);

  // ── Derived: memoize selected set for O(1) lookup in DayButton ───────────
  const selectedSet = useMemo(() => new Set(selectedDays), [selectedDays]);

  return (
    <Container>
      <View style={styles.root}>
        <BackButton title="Schedule App Locking" />

        {/* APP CARD */}
        <View style={[styles.appCard, { backgroundColor: colors.grayLight, borderColor: colors.borderColor }]}>
          {app?.icon ? (
            <Image source={{ uri: app.icon }} style={styles.appIcon} />
          ) : (
            <View style={[styles.placeholderIcon, { backgroundColor: colors.placeholder }]} />
          )}
          <Text style={[styles.appName, { color: colors.blackPrimary }]} numberOfLines={1}>
            {app?.name}
          </Text>
        </View>

        {/* DAYS */}
        <Text style={[styles.section, { color: colors.blackPrimary }]}>Select Days</Text>
        <View style={styles.daysRow}>
          {DAYS.map(day => (
            <DayButton
              key={day}
              day={day}
              active={selectedSet.has(day)}
              onPress={toggleDay}
              colors={colors}
            />
          ))}
        </View>

        {/* FROM / TO TIME */}
        <View style={styles.timeRow}>
          <TimePicker
            label="From"
            hour={fromHour} minute={fromMinute} ampm={fromAmpm}
            onHour={setFromHour} onMinute={setFromMinute} onAmpm={setFromAmpm}
            colors={colors}
          />
          <TimePicker
            label="To"
            hour={toHour} minute={toMinute} ampm={toAmpm}
            onHour={setToHour} onMinute={setToMinute} onAmpm={setToAmpm}
            colors={colors}
          />
        </View>

        {/* SAVE */}
        <Button
          title="Save Schedule"
          onPress={handleSave}
          wrapperStyle={styles.saveWrapper}
          buttonStyle={styles.saveButton}
          labelStyle={styles.saveLabel}
        />
      </View>

      <Congratulation
        isVisible={showSuccess}
        onClose={handleSuccessClose}
        title="Schedule Activated"
        description=""
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16 },
  timeRow: { flexDirection: "row", gap: 10 },
  timePickerFlex: { flex: 1 },
  saveWrapper: { marginTop: "auto" },
  saveButton: { height: 50, borderRadius: 14 },
  saveLabel: { fontSize: 15, fontFamily: Fonts.primary_SemiBold },

  appCard: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 20, marginVertical: 16 },
  appIcon: { width: 42, height: 42, borderRadius: 10, marginRight: 12 },
  placeholderIcon: { width: 42, height: 42, borderRadius: 10, marginRight: 12 },
  appName: { fontSize: 15, fontFamily: Fonts.primary_SemiBold, flex: 1 },

  section: { fontFamily: Fonts.primary_SemiBold, marginBottom: 10, fontSize: 14 },
  daysRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 16 },
  dayBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, marginRight: 8, marginBottom: 8, borderWidth: 1 },

  timeCard: { borderRadius: 16, borderWidth: 1, paddingTop: 12, paddingBottom: 14, paddingHorizontal: 8, marginBottom: 20 },
  labelsRow: { flexDirection: "row", justifyContent: "space-evenly", marginBottom: 4 },
  labelCell: { width: "34%", alignItems: "center" },
  colLabel: { fontSize: 10, fontFamily: Fonts.primary_Medium, letterSpacing: 1 },
  wheelsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" },
  sep: { fontSize: 24, fontWeight: "300", marginBottom: 4 },
  readout: { textAlign: "center", marginTop: 10, fontSize: 14, fontFamily: Fonts.primary_SemiBold, letterSpacing: 1 },
  ampmCol: { flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 6, marginLeft: 4 },
  ampmBtn: { paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8 },
  ampmText: { fontSize: 13 },
});
