import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const times = [30, 60, 120];

export default function TimerScreen() {
  const [selected, setSelected] = useState(60);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Select Timer</Text>

      {times.map(t => (
        <TouchableOpacity
          key={t}
          onPress={() => setSelected(t)}
          style={{
            padding: 15,
            marginTop: 10,
            backgroundColor: selected === t ? 'black' : '#ddd'
          }}>
          <Text style={{ color: selected === t ? '#fff' : '#000' }}>
            {t} seconds
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}