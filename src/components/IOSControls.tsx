import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
type Props = {
  iosTimer: number;
  iosDifficulty: string;
  setIosTimer: (t: number) => void;
  setIosDifficulty: (d: string) => void;
};
export default function IOSControls({
  iosTimer,
  iosDifficulty,
  setIosTimer,
  setIosDifficulty
}: Props) {
  return (
    <View style={{ marginTop: 30, alignItems: 'center' }}>
      
      <Text style={{ color: '#aaa' }}>Difficulty</Text>

      <View style={{ flexDirection: 'row' }}>
        {['Easy', 'Medium', 'Hard'].map(d => (
          <TouchableOpacity key={d} onPress={() => setIosDifficulty(d)}>
            <Text style={{ color: iosDifficulty === d ? '#fff' : '#666', margin: 6 }}>
              {d}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ color: '#aaa', marginTop: 20 }}>Timer</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {[1, 5, 10, 15, 30, 60].map(t => (
          <TouchableOpacity key={t} onPress={() => setIosTimer(t)}>
            <Text style={{ color: iosTimer === t ? '#fff' : '#666', margin: 6 }}>
              {t}m
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    </View>
  );
}