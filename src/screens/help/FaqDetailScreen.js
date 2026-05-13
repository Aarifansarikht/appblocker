import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Container from '../../layout/Container';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';
import BackButton from '../../components/buttons/BackButton';
import { useRoute } from '@react-navigation/native';
import { CONTAINER_SPACING } from '../../utils/constants';

export default function FaqDetailScreen() {
  const { colors } = useTheme();
  const route = useRoute();

  const question = route.params?.question;

  return (
    <Container>
      <BackButton wrapperStyle={{ padding: CONTAINER_SPACING }} />
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={[styles.title, { color: colors.blackPrimary }]}>
          {question}
        </Text>

        <Text style={[styles.desc, { color: colors.paragraphLight }]}>
          In case your settings app is blocked, you must have enabled this
          option in Strict Mode. When you activate Strict Mode and select “block
          device settings”, it restricts access.
          {'\n\n'}
          If you cannot wait, contact support and choose “I need help with
          unlocking”.
          {'\n\n'}
          You can also disable this option before enabling Strict Mode again 🙂
        </Text>
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

  desc: {
    marginTop: 20,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: Fonts.primary_Regular,
  },
});
