// components/rewards/ChallengeCard.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';

export default function ChallengeCard({
  item,
  onClaim,
}) {
  const { colors } = useTheme();

  const percent = (item.progress / item.total) * 100;
  const isCompleted = item.progress >= item.total;

  return (
    <View style={[styles.card, { backgroundColor: colors.grayLight }]}>

      {/* HEADER */}
      <View style={styles.row}>
        <View style={styles.left}>
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: colors.grayLight,borderWidth:1, borderColor: colors.accent },
            ]}
          >
            <Icon name={item.icon} size={18} color={colors.accent} />
          </View>

          <View>
            <Text style={[styles.title, { color: colors.blackPrimary }]}>
              {item.title}
            </Text>

            <Text style={[styles.desc, { color: colors.paragraphLight }]}>
              {item.desc}
            </Text>
          </View>
        </View>

        <Text style={{ color: colors.accent }}>
          +{item.points}
        </Text>
      </View>

      {/* PROGRESS */}
      <View style={styles.progressBar}>
        <View
          style={{
            width: `${percent}%`,
            backgroundColor: colors.accent,
            height: 6,
            borderRadius: 10,
          }}
        />
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={[styles.progressText, { color: colors.paragraphLight }]}>
          {item.progress}/{item.total}
        </Text>

        {isCompleted ? (
          <TouchableOpacity
            style={[styles.claimBtn, { backgroundColor: colors.accent }]}
            onPress={() => onClaim?.(item)}
          >
            <Text style={{ color: '#fff' }}>Claim</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.status}>In Progress</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  left: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },

  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontFamily: Fonts.primary_SemiBold,
    fontSize: 14,
  },

  desc: {
    fontSize: 11,
    marginTop: 2,
    fontFamily: Fonts.primary_Regular,
  },

  progressBar: {
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginTop: 12,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },

  progressText: {
    fontSize: 12,
  },

  claimBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  status: {
    fontSize: 12,
    color: '#999',
  },
});