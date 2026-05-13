import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

import Container from '../../layout/Container';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';
import BackButton from '../../components/buttons/BackButton';
import { CONTAINER_SPACING } from '../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { Navigate_Faq_List } from '../../routes/path';

const DATA = [
  'FAQs',
  'Premium',
  'Strict Mode',
  'Troubleshoot',
  'Unblock',
  'Blocking',
  'Settings',
  'Schedules',
  'Blocking conditions',
];

export default function HelpHomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <Container>
      <BackButton
        title={'Help Center'}
        wrapperStyle={{ padding: CONTAINER_SPACING }}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: CONTAINER_SPACING,
          flexGrow: 1,
          paddingBottom: CONTAINER_SPACING,
        }}
      >
        {/* 🔥 HERO */}
        <View style={styles.hero}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.blackPrimary }]}>
              Hello,
            </Text>
            <Text style={[styles.title, { color: colors.blackPrimary }]}>
              how can I help?
            </Text>
          </View>

          {/* optional image */}
          {/* <Image source={...} style={styles.heroImage} /> */}
        </View>

        {/* 🔍 SEARCH */}
        {/* <View
          style={[
            styles.search,
            { backgroundColor: colors.grayLight },
          ]}
        >
          <TextInput
            placeholder="Search"
            placeholderTextColor={colors.paragraphLight}
            style={{ color: colors.blackPrimary, flex: 1 }}
          />
        </View> */}

        {/* 🔥 CATEGORY LIST */}
        <View style={{ marginTop: 20 }}>
          {DATA.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() =>
                navigation.navigate(Navigate_Faq_List, { title: item })
              }
              style={[styles.card, { backgroundColor: colors.grayLight }]}
            >
              <Text style={[styles.cardText, { color: colors.blackPrimary }]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },

  title: {
    fontSize: 28,
    fontFamily: Fonts.primary_Bold,
  },

  search: {
    marginTop: 20,
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
  },

  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
  },

  cardText: {
    fontSize: 14,
    fontFamily: Fonts.primary_Medium,
  },
});
