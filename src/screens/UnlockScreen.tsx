import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AppService from '../native/AppService';

const generateQuestion = () => {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;

  const correct = a + b;

  const options = [
    correct,
    correct + 1,
    correct - 1,
  ].sort(() => Math.random() - 0.5);

  return { a, b, correct, options };
};

export default function UnlockScreen() {
  const [q, setQ] = useState(generateQuestion());

  const handleAnswer = (value: number) => {
    if (value === q.correct) {
      AppService.unlock();
      Alert.alert("Unlocked ✅");
    } else {
      Alert.alert("Wrong ❌");
      setQ(generateQuestion());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solve to Unlock</Text>

      <Text style={styles.question}>
        {q.a} + {q.b} = ?
      </Text>

      {q.options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={styles.btn}
          onPress={() => handleAnswer(opt)}
        >
          <Text style={styles.btnText}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, marginBottom: 20 },
  question: { fontSize: 28, marginBottom: 20 },
  btn: { padding: 12, backgroundColor: '#000', marginVertical: 6 },
  btnText: { color: '#fff' },
});