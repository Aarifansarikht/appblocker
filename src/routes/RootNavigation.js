import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  OnBoardingScreen,
  HomeScreen,
  AppDetailScreen,
  AccessibilityPermission,
  OverlayPermission,
} from './routes';

import BottomNavigation from './BottomNavigation';
import {
  Navigate_OnBoarding,
  Navigate_Bottom,
  Navigate_App_Detail,
  Navigate_Accessibility,
  Navigate_Overlay,
  Navigate_Apps_List,
  Navigate_Blocking_Conditions,
  Navigate_Schedule_Block,
  Navigate_Learning,
} from './path';
import AppsListScreen from '../screens/app-list/AppsListScreen';
import BlockingConditionsScreen from '../screens/blocking/BlockingConditionsScreen';
import ScheduleBlockScreen from '../screens/blocking/ScheduleBlockScreen';
import LearningScreen from '../screens/learning/LearningScreen';

// ─── Constants ────────────────────────────────────────────────────────────────
const ONBOARDING_KEY = '@app:onboarding_complete';

// ─── Hook: determines initial route based on first-launch flag ────────────────
export function useInitialRoute() {
  const [initialRoute, setInitialRoute] = useState(null); // null = loading

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((value) => {
        // If flag exists, user has completed onboarding → go straight to app
        setInitialRoute(value ? Navigate_Bottom : Navigate_OnBoarding);
      })
      .catch(() => {
        // On error, default to onboarding (safe fallback)
        setInitialRoute(Navigate_OnBoarding);
      });
  }, []);

  return initialRoute;
}

// ─── Helper: call this after the user finishes the Overlay screen ─────────────
export async function markOnboardingComplete() {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

// ─── Stack ────────────────────────────────────────────────────────────────────
const Stack = createStackNavigator();

export default function RootNavigation() {
  const initialRoute = useInitialRoute();

  // Show a splash/loader while AsyncStorage is being read
  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      {/* ── ONBOARDING FLOW (shown only on first launch) ── */}
      <Stack.Screen name={Navigate_OnBoarding} component={OnBoardingScreen} />
      <Stack.Screen
        name={Navigate_Accessibility}
        component={AccessibilityPermission}
      />
      <Stack.Screen name={Navigate_Overlay} component={OverlayPermission} />

      {/* ── MAIN APP ── */}
      <Stack.Screen name={Navigate_Bottom} component={BottomNavigation} />
      <Stack.Screen name={Navigate_Apps_List} component={AppsListScreen} />
      <Stack.Screen name={Navigate_App_Detail} component={AppDetailScreen} />
      <Stack.Screen
        name={Navigate_Blocking_Conditions}
        component={BlockingConditionsScreen}
      />
      <Stack.Screen
        name={Navigate_Schedule_Block}
        component={ScheduleBlockScreen}
      />
      <Stack.Screen name={Navigate_Learning} component={LearningScreen} />
    </Stack.Navigator>
  );
}