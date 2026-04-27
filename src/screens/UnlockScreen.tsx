import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import AppService from '../native/AppService';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

const generateQuestion = (difficulty: Difficulty = 'Easy') => {
  let a: number, b: number, correct: number;
  let op = '+';

  if (difficulty === 'Easy') {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
    correct = a + b;
  } else if (difficulty === 'Medium') {
    const isSub = Math.random() > 0.5;
    a = Math.floor(Math.random() * 90) + 10;
    b = Math.floor(Math.random() * 90) + 10;
    if (isSub) {
      if (a < b) [a, b] = [b, a];
      correct = a - b;
      op = '-';
    } else {
      correct = a + b;
    }
  } else {
    // Hard: multiplication
    a = Math.floor(Math.random() * 30) + 10;
    b = Math.floor(Math.random() * 9) + 2;
    correct = a * b;
    op = '×';
  }

  const wrong1 = correct + Math.floor(Math.random() * 10) + 1;
  const wrong2 = correct - Math.floor(Math.random() * 5) - 1;

  const options = [correct, wrong1, wrong2].sort(() => Math.random() - 0.5);

  return { a, b, correct, options, op };
};

export default function UnlockScreen() {
  const [difficulty] = useState<Difficulty>('Easy');
  const [q, setQ] = useState(generateQuestion(difficulty));
  const [shakeAnim] = useState(new Animated.Value(0));
  const [feedbackColor, setFeedbackColor] = useState<string | null>(null);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleAnswer = (value: number) => {
    if (value === q.correct) {
      setFeedbackColor('#00C853');
      AppService.unlock();
      Alert.alert('✅ Unlocked!', 'App has been unlocked successfully.', [
        { text: 'OK' },
      ]);
    } else {
      setFeedbackColor('#FF1744');
      triggerShake();
      setTimeout(() => {
        setFeedbackColor(null);
        setQ(generateQuestion(difficulty));
      }, 600);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.lockIcon}>🔐</Text>
        <Text style={styles.title}>Solve to Unlock</Text>
        <Text style={styles.subtitle}>Answer correctly to regain access</Text>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>{difficulty}</Text>
        </View>
      </View>

      {/* Question Card */}
      <Animated.View
        style={[
          styles.questionCard,
          { transform: [{ translateX: shakeAnim }] },
          feedbackColor && { borderColor: feedbackColor, borderWidth: 2 },
        ]}
      >
        <Text style={styles.question}>
          {q.a} {q.op} {q.b} = ?
        </Text>
      </Animated.View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {q.options.map((opt, index) => (
          <TouchableOpacity
            key={`${opt}-${index}`}
            style={styles.optionBtn}
            onPress={() => handleAnswer(opt)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer hint */}
      <Text style={styles.hint}>
        {Platform.OS === 'ios'
          ? 'Correct answer removes the app restriction'
          : 'Correct answer removes the overlay lock'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  lockIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  difficultyBadge: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  difficultyText: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '600',
  },
  questionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 40,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  question: {
    fontSize: 36,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
  },
  optionBtn: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  optionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  hint: {
    color: '#555',
    fontSize: 12,
    marginTop: 24,
    textAlign: 'center',
  },
});