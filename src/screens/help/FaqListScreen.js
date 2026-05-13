import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Container from '../../layout/Container';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';
import BackButton from '../../components/buttons/BackButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Navigate_Faq_Detail } from '../../routes/path';
import { CONTAINER_SPACING } from '../../utils/constants';

const FAQS = [
  'I have a premium subscription on Android, how can I make it work on iOS?',
  'Why are you blocking my settings?',
  'Why is my UI Home and Recent apps blocked?',
  'Why are apps I didn’t block being blocked?',
  'Why can I still access apps/websites that should be blocked?',
];

export default function FaqListScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <Container>
        <BackButton wrapperStyle={{ padding: CONTAINER_SPACING }}/>
      <View style={{ flex: 1, padding: 16 }}>

        <Text style={[styles.title, { color: colors.blackPrimary }]}>
          {route.params?.title || 'FAQs'}
        </Text>

       
        <View style={{ marginTop: 20 }}>
          {FAQS.map((q, i) => (
            <TouchableOpacity
              key={i}
              onPress={() =>
                navigation.navigate(Navigate_Faq_Detail, { question: q })
              }
              style={[
                styles.card,
                { backgroundColor: colors.grayLight },
              ]}
            >
              <Text style={[styles.qText, { color: colors.blackPrimary }]}>
                {q}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: Fonts.primary_Bold,
    marginTop: 10,
  },

  subtitle: {
    marginTop: 10,
    fontFamily: Fonts.primary_Medium,
  },

  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
  },

  qText: {
    fontSize: 14,
    fontFamily: Fonts.primary_Medium,
  },
});