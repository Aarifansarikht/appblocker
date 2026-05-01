import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import ModalLayout from './ModalLayout';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';
import Icon from '../../utils/icons';

import { useNavigation } from '@react-navigation/native';

const Congratulation = ({
  onClose,
  isVisible,
  title,
  description,
  redirectTo,
  autoClose = true,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isVisible || !autoClose) return;

    const timer = setTimeout(() => {
      onClose?.();
      if (redirectTo) {
        navigation.navigate(redirectTo);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <ModalLayout visible={isVisible} onClose={onClose} transparent>
      <View style={[styles.container, { backgroundColor: colors.background ,borderWidth:2,borderColor:colors.borderColor}]}>
        
        {/* ICON */}
        <View style={styles.iconWrap}>
          <Icon
            name="checkcircle"
            type="antDesign"
            size={90}
            color={'#22C55E'}
          />
        </View>

        {/* TEXT */}
        <View style={{ paddingBottom: '10%' }}>
          <Text style={[styles.heading, { color: colors.blackPrimary }]}>
            {title || 'Success'}
          </Text>

          <Text style={[styles.description, { color: colors.paragraph }]}>
            {description || ''}
          </Text>
        </View>

        {/* LOADER */}
        <View style={{ paddingTop: '10%' }}>
          <ActivityIndicator size={40} />
        </View>

      </View>
    </ModalLayout>
  );
};

export default Congratulation;

const styles = StyleSheet.create({
  container: {
    padding: '11%',
    borderRadius: 20,
    paddingHorizontal: '10%',
    width: '90%',
  },

  iconWrap: {
    alignItems: 'center',
    paddingBottom: '10%',
  },

  heading: {
    fontFamily: Fonts.primary_Bold,
    textAlign: 'center',
    fontSize: 18,
  },

  description: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  },
});