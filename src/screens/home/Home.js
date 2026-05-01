import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, AppState } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Spacer from '../../components/shared/Spacer'

import Container from '../../layout/Container';
import MainHeader from '../../components/headers/MainHeader';
import ProgressHeroCard from '../../components/home/ProgressHeroCard';
import AnalyticsCards from '../../components/home/AnalyticsCards';
import SectionHeading from '../../components/sections/SectionHeading';
import QuickActionsCard from '../../components/home/QuickActionsCard';
import PermissionCard from '../../components/cards/PermissionCard';
import usePermissions from '../../hooks/usePermissions';
import { useAppBlocker } from '../../context/AppBlockerContext';
import { useTheme } from '../../context/theme/ThemeContext';
import { CONTAINER_SPACING } from '../../utils/constants';
import { Navigate_Apps_List } from '../../routes/path';
import PermissionsList from '../../components/permissions/PermissionsList';
export default function Home() {
  const state = useAppBlocker();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const {
    permissions,
    handleOverlay,
    handleAccessibility,
    handleUsage,
    handleNotification,
  } = usePermissions();
  return (
    <Container>
      <KeyboardAwareScrollView
        nestedScrollEnabled
        contentContainerStyle={{ paddingTop: 0, flexGrow: 1 }}
        stickyHeaderIndices={[0, 0]}
      >
        <View
          style={{
            paddingHorizontal: CONTAINER_SPACING,
          }}
        >
          <MainHeader />
        </View>

        <View style={{ flex: 1, padding: 16 }}>
          <PermissionsList
            permissions={permissions}
            onAccessibility={handleAccessibility}
            onOverlay={handleOverlay}
            onUsage={handleUsage}
            onNotification={handleNotification}
          />
        <Spacer space={'3%'} />
          {/* PROGRESS HERO CARD */}
          <ProgressHeroCard
            unlocked={state.unlocked.length}
            total={state.selected.length + state.unlocked.length}
          />
          {/* ANALYTICS */}
          <AnalyticsCards
            blockedApps={state.selected.length}
            timeSaved={Object.values(state.timers || {}).reduce(
              (acc, t) => acc + t,
              0,
            )}
          />
          {/* <Spacer space={'3%'} /> */}
          <SectionHeading title="Quick Actions" label="" />
          <QuickActionsCard
            onAppsPress={() => navigation.navigate(Navigate_Apps_List)}
            onRewardsPress={() => {
              console.log('Rewards Clicked');
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  inlineLoader: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },

  heroCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
  },

  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  heroSubtitle: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
});
