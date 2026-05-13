import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';

const DATA = [
  { key: 'accessibility', title: 'Accessibility' },
  { key: 'overlay', title: 'Overlay' },
  { key: 'usage', title: 'Usage Access' },
  { key: 'notifications', title: 'Notifications' },
];

export default function PermissionsList({
  permissions,
  onAccessibility,
  onOverlay,
  onUsage,
  onNotification,
}) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const filteredData = DATA.filter(item => !permissions[item.key]);

  useEffect(() => {
    if (filteredData.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,        // 300ms smooth fade — feels instant but not jarring
        useNativeDriver: true,
      }).start();
    }
  }, [filteredData.length]);

  const getButtonText = key => {
    if (permissions[key]) return 'Enabled';
    if (key === 'notifications') return 'Allow';
    return 'Enable';
  };

  const handlePress = key => {
    switch (key) {
      case 'accessibility': onAccessibility(); break;
      case 'overlay':       onOverlay();       break;
      case 'usage':         onUsage();         break;
      case 'notifications': onNotification();  break;
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => handlePress(item.key)}
      style={[
        styles.item,
        {
          borderBottomWidth: index !== filteredData.length - 1 ? 1 : 0,
          borderColor: colors.borderColor,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.blackPrimary }]}>
        {item.title}
      </Text>
      <View
        style={[
          styles.btn,
          {
            backgroundColor: colors.placeholder,
            borderWidth: 1,
            borderColor: colors.error,
          },
        ]}
      >
        <Text style={[styles.btnText, { color: colors.blackPrimary }]}>
          {getButtonText(item.key)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // All permissions granted — render nothing (no flash)
  if (filteredData.length === 0) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.grayLight,
          borderColor: colors.borderColor,
          opacity: fadeAnim,                        
          transform: [{
            translateY: fadeAnim.interpolate({     
              inputRange: [0, 1],
              outputRange: [6, 0],
            }),
          }],
        },
      ]}
    >
      {/* WARNING HEADER */}
      <View
        style={[
          styles.warningCard,
          {
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            borderBottomColor: colors.borderColor,
          },
        ]}
      >
        <Text style={[styles.warningTitle, { color: colors.error }]}>
          ⚠ Attention
        </Text>
        <Text style={[styles.warningText, { color: colors.blackPrimary }]}>
          Grant the following permissions for Stay Focused to work properly.
        </Text>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={item => item.key}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 10,
  },
  warningCard: {
    padding: 14,
    borderBottomWidth: 1,
  },
  warningTitle: {
    fontSize: 13,
    fontFamily: Fonts.primary_Medium,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    fontFamily: Fonts.primary_Regular,
    opacity: 0.8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  title: {
    fontSize: 14,
    fontFamily: Fonts.primary_Medium,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  btnText: {
    fontSize: 12,
    fontFamily: Fonts.primary_Medium,
  },
});
