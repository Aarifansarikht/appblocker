import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AppService from '../../native/AppService';


export default function LearningScreen({ route, navigation }) {

  const pkg = route.params?.pkg;

  const [progress, setProgress] = useState(0);
  const [question, setQuestion] = useState(generateQuestion());

  function generateQuestion() {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    return {
      text: `${a} + ${b}`,
      correct: a + b,
      options: shuffle([a + b, a + b + 1, a + b - 1])
    };
  }

  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  const handleAnswer = (ans) => {
    if (ans === question.correct) {

      const newProgress = progress + 1;
      setProgress(newProgress);

      if (newProgress >= 3) {
        AppService.unlockApp(pkg);
        navigation.goBack();
      } else {
        setQuestion(generateQuestion());
      }

    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#FFFFFF' }}>

      {/* PROGRESS */}
      <View style={{
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 10,
        marginBottom: 30
      }}>
        <View style={{
          width: `${(progress / 3) * 100}%`,
          height: '100%',
          backgroundColor: '#22C55E'
        }}/>
      </View>

      {/* TITLE */}
      <Text style={{
        fontSize: 18,
        color: '#111827',
        marginBottom: 20
      }}>
        Solve to Unlock
      </Text>

      {/* QUESTION */}
      <Text style={{
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 20
      }}>
        {question.text}
      </Text>

      {/* OPTIONS */}
      {question.options.map((opt, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => handleAnswer(opt)}
          style={{
            backgroundColor: '#F3F4F6',
            padding: 16,
            borderRadius: 12,
            marginBottom: 10
          }}
        >
          <Text style={{ fontSize: 18, color: '#111827' }}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}

    </View>
  );
}