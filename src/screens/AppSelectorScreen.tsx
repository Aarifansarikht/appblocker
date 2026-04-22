import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import AppLocker from '../native/AppLocker';

export default function App() {
  const [apps, setApps] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    AppLocker.getInstalledApps().then(setApps);
  }, []);

  const toggle = (pkg: string) => {
    setSelected(prev =>
      prev.includes(pkg)
        ? prev.filter(p => p !== pkg)
        : [...prev, pkg]
    );
  };

  return (
    <View style={{ marginTop: 50 }}>
      <Button title="Enable Accessibility" onPress={() => AppLocker.openAccessibilitySettings()} />
      <Button title="Overlay Permission" onPress={() => AppLocker.requestOverlayPermission()} />
      <Button title="Save" onPress={() => AppLocker.saveLockedApps(selected)} />

      <FlatList
        data={apps}
        keyExtractor={(item) => item.package}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggle(item.package)}>
            <Text style={{ padding: 10 }}>
              {selected.includes(item.package) ? '✅' : '⬜'} {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}