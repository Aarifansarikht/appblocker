import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function  PermissionCard ({ title, enabled, onPress }) {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 14,
      borderRadius: 12,
      backgroundColor: '#F3F4F6',
      marginBottom: 10,
      borderWidth: 1,
      borderColor: enabled ? '#22C55E' : '#EF4444'
    }}>
      <Text style={{ fontWeight: '600' }}>{title}</Text>

      <TouchableOpacity
        onPress={onPress}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 8,
          backgroundColor: enabled ? '#9CA3AF' : '#22C55E'
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>
          {enabled ? 'Disable' : 'Enable'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

