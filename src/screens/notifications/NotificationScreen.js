import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Container from '../../layout/Container';
import BackButton from '../../components/buttons/BackButton';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';
import { CONTAINER_SPACING } from '../../utils/constants';

import Icon from 'react-native-vector-icons/Feather';

/* ---------------- MOCK DATA ---------------- */

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'App Locked',
    desc: 'Instagram is locked. Solve to unlock.',
    type: 'lock',
    time: '2 min ago',
    read: false,
  },
  {
    id: 2,
    title: 'Reward Earned',
    desc: 'You earned 20 points 🎉',
    type: 'reward',
    time: '10 min ago',
    read: false,
  },
  {
    id: 3,
    title: 'Wrong Answer',
    desc: 'Try again to unlock the app',
    type: 'error',
    time: '1 hr ago',
    read: true,
  },
  {
    id: 4,
    title: 'Focus Mode Active',
    desc: 'Quick block enabled successfully',
    type: 'success',
    time: 'Yesterday',
    read: true,
  },
];

/* ---------------- HELPERS ---------------- */

const getIcon = (type, colors) => {
  switch (type) {
    case 'lock':
      return { name: 'lock', color: colors.accent };
    case 'reward':
      return { name: 'gift', color: '#F59E0B' };
    case 'error':
      return { name: 'x-circle', color: '#EF4444' };
    case 'success':
      return { name: 'check-circle', color: '#10B981' };
    default:
      return { name: 'bell', color: colors.accent };
  }
};

/* ---------------- MAIN ---------------- */

export default function NotificationScreen() {
  const { colors } = useTheme();
  const [data, setData] = useState(NOTIFICATIONS);

  const markAsRead = (id) => {
    setData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, read: true } : item,
      ),
    );
  };

  return (
    <Container>
      <View style={{ flex: 1 }}>
        <BackButton
          title="Notifications"
          wrapperStyle={{ padding: CONTAINER_SPACING }}
        />

        <ScrollView contentContainerStyle={{ padding: CONTAINER_SPACING }}>
          
          {data.length === 0 && (
            <View style={styles.empty}>
              <Icon name="bell-off" size={40} color={colors.paragraphLight} />
              <Text style={[styles.emptyText, { color: colors.paragraphLight }]}>
                No notifications yet
              </Text>
            </View>
          )}

          {data.map(item => {
            const icon = getIcon(item.type, colors);

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => markAsRead(item.id)}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.grayLight,
                    borderColor: colors.borderColor,
                    opacity: item.read ? 0.6 : 1,
                  },
                ]}
              >
                {/* ICON */}
                <View
                  style={[
                    styles.iconWrap,
                    { backgroundColor: icon.color + '20' },
                  ]}
                >
                  <Icon name={icon.name} size={18} color={icon.color} />
                </View>

                {/* CONTENT */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.title,
                      { color: colors.blackPrimary },
                    ]}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={[
                      styles.desc,
                      { color: colors.paragraphLight },
                    ]}
                  >
                    {item.desc}
                  </Text>

                  <Text
                    style={[
                      styles.time,
                      { color: colors.paragraphLight },
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>

                {/* UNREAD DOT */}
                {!item.read && (
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: colors.accent },
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Container>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  title: {
    fontSize: 14,
    fontFamily: Fonts.primary_SemiBold,
  },

  desc: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: Fonts.primary_Regular,
  },

  time: {
    fontSize: 10,
    marginTop: 6,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },

  empty: {
    alignItems: 'center',
    marginTop: 80,
  },

  emptyText: {
    marginTop: 10,
    fontFamily: Fonts.primary_Medium,
  },
});