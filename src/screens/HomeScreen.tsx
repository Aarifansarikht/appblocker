import React from 'react';
import { View, Button } from 'react-native';
import AppLocker from '../native/AppLocker';

export default function App() {
  return (
    <View style={{ marginTop: 100 }}>
      <Button
        title="Enable Accessibility"
        onPress={() => AppLocker.openAccessibilitySettings()}
      />
    </View>
  );
}