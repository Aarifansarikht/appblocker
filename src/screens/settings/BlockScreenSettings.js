// screens/BlockScreenSettings.js

import React, { useState, useEffect } from 'react';  // ← add useEffect
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Container from '../../layout/Container';
import BackButton from '../../components/buttons/BackButton';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';
import { CONTAINER_SPACING } from '../../utils/constants';
import Button from '../../components/buttons/Button';
import useBlockSettings from '../../hooks/useBlockSettings';
import OrderConfirm from '../../components/modals/OrderConfirm';

export default function BlockScreenSettings() {
  const { colors } = useTheme();
  const { selectedSubject, saveSubject, subjects, loading } = useBlockSettings();

  const [localSelected, setLocalSelected] = useState(selectedSubject);
  const [showModal, setShowModal] = useState(false);

  // ✅ Sync localSelected whenever selectedSubject loads or changes
  useEffect(() => {
    if (selectedSubject) {
      setLocalSelected(selectedSubject);
    }
  }, [selectedSubject]);

  const handleConfirm = async () => {
    await saveSubject(localSelected);
    setShowModal(true);
  };

  if (loading) return null;

  return (
    <Container>
      <View style={{ flex: 1 }}>
        <BackButton
          title="Block Screen Setting"
          wrapperStyle={{ padding: CONTAINER_SPACING }}
        />

        <View style={{ flex: 1 }}>
          <Text style={[styles.sectionLabel, { color: colors.paragraphLight }]}>
            Choose question subject shown on the lock screen
          </Text>

          <View
            style={[
              styles.list,
              {
                backgroundColor: colors.grayLight,
                borderColor: colors.borderColor,
              },
            ]}
          >
            {subjects.map((item, index) => {
              const isActive = localSelected === item.id;

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => setLocalSelected(item.id)}
                  style={[
                    styles.card,
                    {
                      borderBottomWidth: index !== subjects.length - 1 ? 1 : 0,
                      borderColor: colors.borderColor,
                      backgroundColor: isActive ? colors.accentLight : 'transparent',
                    },
                  ]}
                >
                  <View style={styles.left}>
                    <Text style={styles.icon}>{item.emoji}</Text>
                    <View>
                      <Text style={[styles.title, { color: colors.blackPrimary }]}>
                        {item.title}
                      </Text>
                      <Text style={[styles.desc, { color: colors.paragraphLight }]}>
                        {item.desc}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.radio,
                      {
                        borderColor: isActive ? colors.accent : colors.borderColor,
                      },
                    ]}
                  >
                    {isActive && (
                      <View style={[styles.dot, { backgroundColor: colors.accent }]} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View
          style={[
            styles.bottomContainer,
            {
              backgroundColor: colors.whitePrimary,
              borderTopColor: colors.borderColor,
            },
          ]}
        >
          <Button title="Confirm Selection" onPress={handleConfirm} />
        </View>
      </View>

      <OrderConfirm
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        title="Subject Saved!"
        description={`Your lock screen will now show ${
          subjects.find(s => s.id === localSelected)?.title ?? ''
        } questions.`}
        primaryText="Got it"
        onPrimaryPress={() => setShowModal(false)}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 12,
    fontFamily: Fonts.primary_Regular,
    marginHorizontal: CONTAINER_SPACING,
    marginBottom: 8,
    marginTop: 4,
  },
  list: {
    marginHorizontal: CONTAINER_SPACING,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: { fontSize: 28 },
  title: {
    fontSize: 14,
    fontFamily: Fonts.primary_SemiBold,
  },
  desc: {
    fontSize: 11,
    marginTop: 2,
    fontFamily: Fonts.primary_Regular,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,

  },
});