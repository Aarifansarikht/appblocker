import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ModalLayout from './ModalLayout';
import { useTheme } from '../../context/theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Icon from '../../utils/icons';
import { Fonts } from '../../utils/typography';
import Button from '../buttons/Button';

const OrderConfirm = ({
  isVisible,
  onClose,
  title,
  description,
  primaryText,
  secondaryText,
  onPrimaryPress,
  onSecondaryPress,
}) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <ModalLayout visible={isVisible} onClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background,borderWidth:2,borderColor: colors.borderColor }]}>
        
        <View style={{ alignItems: 'center', paddingBottom: '10%' }}>
          <Icon name='warning-outline' type='ionicons' size={90} color={colors.error} />
        </View>

        <View style={{ paddingBottom: '10%' }}>
          <Text style={[styles.heading, { color: colors.blackPrimary }]}>
            {title || 'Success'}
          </Text>

          <Text style={[styles.description, { color: colors.paragraph }]}>
            {description || ''}
          </Text>
        </View>

        <View style={{ gap: 10 }}>
          <Button
            title={primaryText || 'OK'}
            onPress={() => {
              onPrimaryPress?.();
              onClose?.();
            }}
          />

          {secondaryText && (
            <Button
              title={secondaryText}
              isOutLine
              onPress={() => {
                onSecondaryPress?.();
                onClose?.();
              }}
            />
          )}
        </View>
      </View>
    </ModalLayout>
  );
};

export default OrderConfirm;

const styles = StyleSheet.create({
  container: {
    padding: '11%',
    borderRadius: 20,
    paddingHorizontal: '10%',
    width: '90%',
  },
  heading: {
    fontFamily: Fonts.primary_Bold,
    textAlign: 'center',
    fontSize: 22,
  },
  description: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  },
});