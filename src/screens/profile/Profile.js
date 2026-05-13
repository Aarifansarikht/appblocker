// src/screens/profile/Profile.tsx
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Container from '../../layout/Container';
import { Avatar, Switch } from '@rneui/base';
import { Fonts } from '../../utils/typography';
import { useTheme } from '../../context/theme/ThemeContext';
import Icon from '../../utils/icons';
import { CONTAINER_SPACING } from '../../utils/constants';
import LinearGradient from 'react-native-linear-gradient';
import { BagOutlineIcon, BellOutlineIcon, HelpIcon, MoonIcon, ProfileOutlineIcon, ShieldIcon, LogoutIcon, StatesOutlineIcon } from '../../utils/svg';
import { useNavigation } from '@react-navigation/native';
import {
  Navigate_blockScreen_Settings,
  Navigate_Edit_Profile,
  Navigate_Help_Home,
  Navigate_Learning,
  Navigate_Login,
  Navigate_Login_With_ID,
  Navigate_Notification_Settings,
  Navigate_reward,
} from '../../routes/path';
import LogoutConfirm from '../../components/modals/LogoutConfirm';
import Button from '../../components/buttons/Button';

// ── Auth hook ─────────────────────────────────────────────────────────────────
import { useAuth } from '../../hooks/useAuth';

/* ---------- ITEM ---------- */
const ListItem = ({ label, leftIcon, rightIcon, onPress, showSeparator }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.item, showSeparator && { borderBottomWidth: 1, borderBottomColor: colors.borderColor }]}
    >
      <View style={[styles.iconWrap, { borderColor: colors.borderColor }]}>{leftIcon}</View>
      <Text style={[styles.label, { color: colors.blackPrimary }]}>{label}</Text>
      {rightIcon ? rightIcon : <Icon name="chevron-forward" size={20} color={colors.paragraphLight} />}
    </TouchableOpacity>
  );
};

/* ---------- SCREEN ---------- */
const Profile = () => {
  const { colors, toggleTheme, theme } = useTheme();
  const navigation = useNavigation();
  const [isLogoutVisible, setLogoutVisible] = useState(false);

  // ── Pull real user data from Redux (set by authSlice on login/register) ──
  const { user, email, fullName, avatarUrl, isGuest, isSigningOut, signOut, isProfileLoading } = useAuth();

  // Derive display values
  const displayName = isGuest ? 'Guest User' : fullName || email?.split('@')[0] || 'User';
  const displayEmail = isGuest ? null : email;
  const displayAvatar = avatarUrl ?? 'https://cdn-icons-png.magnific.com/512/4122/4122823.png?ga=GA1.1.857803634.1777443901';

  const handleLogoutConfirm = async () => {
    setLogoutVisible(false);
    await signOut(); // clears Redux + AsyncStorage → RootNavigation → AuthNavigator
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={{ padding: CONTAINER_SPACING }}>
        {/* 🔥 PROFILE HEADER */}
        <View style={[styles.profileCard, { alignItems: 'center', justifyContent: 'center' }]}>
          // In Profile.tsx — replace the Avatar component
          <View style={[styles.avatarBorder, { borderColor: colors.accent }]}>
            {isProfileLoading && !avatarUrl ? (
              // Skeleton — only shown on very first load with zero cache
              <View
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  backgroundColor: colors.grayLight,
                }}
              />
            ) : (
              <Image source={{ uri: displayAvatar }} style={{ width: 90, height: 90, borderRadius: 45 }} />
            )}
          </View>
          <View style={{ marginTop: 12, alignItems: 'center' }}>
            {isGuest ? (
              <>
                <Text style={[styles.name, { color: colors.blackPrimary }]}>Guest User</Text>
                <Text style={[styles.sub, { color: colors.paragraphLight, textAlign: 'center' }]}>Login to track your progress and unlock features</Text>
                <View style={{ marginTop: 14 }}>
                  <Button
                    title="Sign In / Sign Up"
                    onPress={() => navigation.navigate(Navigate_Login_With_ID)}
                    buttonStyle={{ backgroundColor: colors.accent, borderRadius: 40, paddingHorizontal: 25 }}
                  />
                </View>
              </>
            ) : (
              <>
                {/* Show skeleton text only if no cache */}
                <Text style={[styles.name, { color: colors.blackPrimary }]}>{isProfileLoading && !fullName ? '...' : displayName}</Text>
                {displayEmail && <Text style={[styles.sub, { color: colors.paragraphLight, textAlign: 'center' }]}>{displayEmail}</Text>}
              </>
            )}
          </View>
        </View>

        {/* PRO BANNER */}
        <TouchableOpacity activeOpacity={0.9} style={styles.premiumWrapper} onPress={() => navigation.navigate('SubscriptionScreen')}>
          <LinearGradient colors={['#22C55E', '#16A34A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.premiumCard}>
            <View style={styles.premiumIconWrap}>
              <Icon name="star" size={18} color="#22C55E" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.premiumTitle}>Explore Pro Membership</Text>
              <Text style={styles.premiumSub}>And get special features</Text>
            </View>
            <View style={styles.arrowCircle}>
              <Icon name="arrow-forward" size={16} color="#22C55E" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ACCOUNT */}
        <View style={[styles.card, { backgroundColor: colors.grayLight, borderColor: colors.borderColor }]}>
          <ListItem
            label="Edit Profile"
            onPress={() => navigation.navigate(Navigate_Edit_Profile)}
            leftIcon={<ProfileOutlineIcon color={colors.accent} />}
            showSeparator
          />
          <ListItem label="Learning Progress" onPress={() => navigation.navigate(Navigate_Learning)} leftIcon={<StatesOutlineIcon color={colors.accent} />} />
        </View>

        {/* SETTINGS */}
        <View style={[styles.card, { backgroundColor: colors.grayLight, borderColor: colors.borderColor }]}>
          <ListItem label="Rewards" onPress={() => navigation.navigate(Navigate_reward)} leftIcon={<BagOutlineIcon color={colors.accent} />} showSeparator />
          <ListItem
            label="Notifications"
            onPress={() => navigation.navigate(Navigate_Notification_Settings)}
            leftIcon={<BellOutlineIcon color={colors.accent} />}
            showSeparator
          />
          <ListItem
            label="Block Screen"
            onPress={() => navigation.navigate(Navigate_blockScreen_Settings)}
            leftIcon={<ShieldIcon color={colors.accent} />}
            showSeparator
          />
          <ListItem
            label="Dark Mode"
            leftIcon={<MoonIcon color={colors.accent} />}
            rightIcon={<Switch value={theme === 'dark'} onChange={toggleTheme} color={colors.paragraphLight} />}
          />
        </View>

        {/* SUPPORT */}
        <View style={[styles.card, { backgroundColor: colors.grayLight, borderColor: colors.borderColor }]}>
          <ListItem label="Help Center" onPress={() => navigation.navigate(Navigate_Help_Home)} leftIcon={<HelpIcon color={colors.accent} />} />
        </View>

        {/* LOGOUT — only for logged-in users */}
        {!isGuest && (
          <TouchableOpacity onPress={() => setLogoutVisible(true)} disabled={isSigningOut} style={styles.logout}>
            <LogoutIcon color="red" />
            <Text style={styles.logoutText}>{isSigningOut ? 'Logging out...' : 'Logout'}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* LOGOUT CONFIRM MODAL */}
      <LogoutConfirm
        isVisible={isLogoutVisible}
        onClose={() => setLogoutVisible(false)}
        onConfirm={handleLogoutConfirm} // ← wire your modal's confirm button to this
      />
    </Container>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileCard: { borderRadius: 20, padding: 16 },
  name: { fontSize: 18, fontFamily: Fonts.primary_SemiBold },
  sub: { fontSize: 14, marginTop: 2, fontFamily: Fonts.primary_Regular },
  card: { borderWidth: 1, borderRadius: 18, marginBottom: 20, paddingVertical: 5 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  avatarBorder: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  iconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1 },
  label: { flex: 1, fontSize: 14, fontFamily: Fonts.primary_Medium },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, gap: 10 },
  logoutText: { color: 'red', fontSize: 15, fontFamily: Fonts.primary_SemiBold },
  premiumWrapper: { width: '100%', marginTop: 18, marginBottom: 20 },
  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  premiumIconWrap: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  premiumTitle: { color: '#fff', fontSize: 15, fontFamily: Fonts.primary_SemiBold },
  premiumSub: { color: '#fff', fontSize: 12, opacity: 0.9, marginTop: 3, fontFamily: Fonts.primary_Regular },
  arrowCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
});
