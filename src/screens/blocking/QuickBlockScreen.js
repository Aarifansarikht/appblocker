import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Container from '../../layout/Container';
import { useTheme } from '../../context/theme/ThemeContext';
import { useAppBlocker } from '../../hooks/useAppBlocker';
import { Fonts } from '../../utils/typography';
import BackButton from '../../components/buttons/BackButton';
import Slider from '@react-native-community/slider';

export default function QuickBlockScreen({ navigation }) {
  const { colors } = useTheme();
  const state = useAppBlocker();

  const [minutes, setMinutes] = useState(10);

  const handleSave = () => {
    state.selected.forEach(pkg => {
      state.setTimer(pkg, minutes * 60);
    });

    state.saveApps();
    navigation.goBack();
  };

  return (
    <Container>
      <View style={{ flex: 1, padding: 16 }}>

        <BackButton title="Quick Block" />

        {/* SELECTED APPS */}
        <Text style={[styles.section, { color: colors.blackPrimary }]}>
          Selected Apps
        </Text>

        <View style={styles.appRow}>
          {state.selected.map(pkg => (
            <Text key={pkg} style={{ color: colors.paragraphLight }}>
              • {pkg}
            </Text>
          ))}
        </View>

        {/* SLIDER */}
        <Text style={[styles.section, { color: colors.blackPrimary }]}>
          Block Duration: {minutes} min
        </Text>

        <Slider
          minimumValue={1}
          maximumValue={120}
          step={1}
          value={minutes}
          onValueChange={setMinutes}
        />

        {/* SAVE */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.blackPrimary }]}
          onPress={handleSave}
        >
          <Text style={{ color: colors.whitePrimary }}>
            Start Blocking
          </Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  section: {
    fontFamily: Fonts.primary_SemiBold,
    marginTop: 20,
    marginBottom: 10,
  },

  appRow: {
    marginBottom: 20,
  },

  button: {
    marginTop: 'auto',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
});