import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from '../../utils/icons';
import { useTheme } from '../../context/theme/ThemeContext';
import { Fonts } from '../../utils/typography';
import { ImagePath } from '../../utils/images';
import { useNavigation } from '@react-navigation/native';
import { Navigate_notification, Navigate_Edit_Profile } from '../../routes/path';
import { useAuth } from '../../hooks/useAuth';

const DEFAULT_AVATAR = 'https://cdn-icons-png.magnific.com/512/4122/4122823.png';

const MainHeader = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { fullName, email, avatarUrl, isGuest } = useAuth();
  const unreadCount = 3;

  const displayName = fullName || email?.split('@')[0] || 'User';
  const displayAvatar = avatarUrl ?? DEFAULT_AVATAR;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* LEFT — logo+app name for guests, avatar+name for logged-in users */}
      {isGuest ? (
        <View style={styles.left}>
          <Image source={ImagePath.greenLogo} style={styles.logo} />
          <Text style={[styles.title, { color: colors.accent }]} numberOfLines={1}>
            ScreenToSkill
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.left}
          activeOpacity={0.8}
          onPress={() => navigation.navigate(Navigate_Edit_Profile)}
        >
          <Image source={{ uri: displayAvatar }} style={styles.avatar} />
          <View>
            <Text style={[styles.greeting, { color: colors.paragraphLight }]}>
              Welcome back,
            </Text>
            <Text style={[styles.name, { color: colors.blackPrimary }]} numberOfLines={1}>
              {displayName}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* RIGHT — notification bell */}
      <View style={styles.right}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate(Navigate_notification)}
          style={styles.iconWrap}
        >
          <Icon name="bell" type="feather" size={20} color={colors.paragraph} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default MainHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: '2%',
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 38,
    height: 38,
  },
  title: {
    fontFamily: Fonts.primary_Bold,
    fontSize: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greeting: {
    fontSize: 11,
    fontFamily: Fonts.primary_Regular,
  },
  name: {
    fontSize: 15,
    fontFamily: Fonts.primary_SemiBold,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontFamily: Fonts.primary_Bold,
  },
});