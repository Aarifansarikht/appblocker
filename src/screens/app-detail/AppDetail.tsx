import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function AppDetail() {
  const [timer, setTimer] = useState(10);
  const [challenge, setChallenge] = useState('math');

  return (
    <View style={{ flex: 1, backgroundColor: '#0d0d0d', padding: 16 }}>
      
      <Text style={{ color: '#fff', fontSize: 22 }}>Instagram</Text>

      <Text style={{ color: '#aaa', marginTop: 10 }}>TIME LIMIT</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {[10, 30, 60].map(t => (
          <TouchableOpacity
            key={t}
            onPress={() => setTimer(t)}
            style={{
              backgroundColor: timer === t ? '#8A2BE2' : '#222',
              padding: 14,
              borderRadius: 10,
              margin: 6
            }}
          >
            <Text style={{ color: '#fff' }}>{t}s</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ color: '#aaa', marginTop: 20 }}>CHALLENGE</Text>

      {['math', 'memory', 'pattern'].map(c => (
        <TouchableOpacity
          key={c}
          onPress={() => setChallenge(c)}
          style={{
            padding: 14,
            borderRadius: 10,
            marginTop: 10,
            borderWidth: 1,
            borderColor: challenge === c ? '#8A2BE2' : '#333'
          }}
        >
          <Text style={{ color: '#fff' }}>{c}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}