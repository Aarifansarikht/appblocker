// src/routes/RootNavigation.tsx

import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Easing } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";

import { useAppSelector } from "../store/hooks";
import { selectIsAuthenticated } from "../store/slices/authSlice";

import {
  OnBoardingScreen,
  AppDetailScreen,
  AccessibilityPermission,
  OverlayPermission,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  ResetPasswordScreen,
  LoginWithIdPasswordScreen,
  OTPVerificationScreen,
  EditProfileScreen,
  NotificationSettingsScreen,
  HelpHomeScreen,
  FaqListScreen,
  FaqDetailScreen,
  BlockScreenSettings,
  RewardsScreen,
  ChangePasswordScreen,
  NotificationScreen,
  UsagePermission,
} from "./routes";

import BottomNavigation from "./BottomNavigation";

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
  Navigate_Login,
  Navigate_Register,
  Navigate_ForgotPassword,
  Navigate_ResetPassword,
  Navigate_Login_With_ID,
  Navigate_OTP_Verification,
  Navigate_Edit_Profile,
  Navigate_Notification_Settings,
  Navigate_Help_Home,
  Navigate_Faq_List,
  Navigate_Faq_Detail,
  Navigate_blockScreen_Settings,
  Navigate_reward,
  Navigate_changePassword,
  Navigate_notification,
  Navigate_Usage,
} from "./path";

import AppsListScreen from "../screens/app-list/AppsListScreen";
import BlockingConditionsScreen from "../screens/blocking/BlockingConditionsScreen";
import ScheduleBlockScreen from "../screens/blocking/ScheduleBlockScreen";
import LearningScreen from "../screens/learning/LearningScreen";
import SubscriptionScreen from "../screens/subscription/SubscriptionScreen";

const { Navigator, Screen } = createStackNavigator();

const FIRST_TIME_KEY = "FIRST_TIME_OPENED";
const PERMISSIONS_DONE_KEY = "PERMISSIONS_COMPLETED";
const stackOptions = {
  headerShown: false,
  gestureEnabled: true,
  gestureDirection: "horizontal",
  transitionSpec: {
    open: {
      animation: "timing",
      config: {
        duration: 350,
        easing: Easing.out(Easing.poly(4)),
      },
    },
    close: {
      animation: "timing",
      config: {
        duration: 300,
        easing: Easing.in(Easing.poly(4)),
      },
    },
  },
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      opacity: current.progress,
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width * 0.3, 0],
          }),
        },
      ],
    },
  }),
};

// ── PUBLIC NAVIGATOR ─────────────────────────────────────────

const AuthNavigator = ({ isFirstLaunch, onOnboardingDone }) => (
  <Navigator screenOptions={stackOptions}>
    {isFirstLaunch && (
      <Screen
        name={Navigate_OnBoarding}
        component={OnBoardingScreen}
        listeners={{
          beforeRemove: onOnboardingDone,
        }}
      />
    )}

    <Screen name={Navigate_Login} component={LoginScreen} />
    <Screen name={Navigate_Register} component={RegisterScreen} />
    <Screen name={Navigate_ForgotPassword} component={ForgotPasswordScreen} />
    <Screen name={Navigate_ResetPassword} component={ResetPasswordScreen} />
    <Screen name={Navigate_Login_With_ID} component={LoginWithIdPasswordScreen} />
    <Screen name={Navigate_OTP_Verification} component={OTPVerificationScreen} />
  </Navigator>
);

// ── PRIVATE NAVIGATOR ────────────────────────────────────────

const AppNavigator = ({ isFirstSession, onPermissionsDone }) => (
  <Navigator screenOptions={stackOptions}>
    {isFirstSession && (
      <>
        <Screen name={Navigate_Accessibility} component={AccessibilityPermission} />
        <Screen name={Navigate_Overlay} component={OverlayPermission} />
        <Screen
          name={Navigate_Usage}
          component={UsagePermission}
          listeners={{
            beforeRemove: onPermissionsDone, // ← last permission screen; clear flag here
          }}
        />
      </>
    )}

    <Screen name={Navigate_Bottom} component={BottomNavigation} />

    <Screen name={Navigate_notification} component={NotificationScreen} />

    <Screen name={Navigate_Apps_List} component={AppsListScreen} />

    <Screen name={Navigate_App_Detail} component={AppDetailScreen} />

    <Screen name={Navigate_Blocking_Conditions} component={BlockingConditionsScreen} />

    <Screen name={Navigate_Schedule_Block} component={ScheduleBlockScreen} />

    <Screen name={Navigate_Learning} component={LearningScreen} />

    <Screen name={Navigate_Edit_Profile} component={EditProfileScreen} />

    <Screen name={Navigate_changePassword} component={ChangePasswordScreen} />

    <Screen name="SubscriptionScreen" component={SubscriptionScreen} />

    <Screen name={Navigate_Notification_Settings} component={NotificationSettingsScreen} />

    <Screen name={Navigate_Help_Home} component={HelpHomeScreen} />

    <Screen name={Navigate_Faq_List} component={FaqListScreen} />

    <Screen name={Navigate_Faq_Detail} component={FaqDetailScreen} />

    <Screen name={Navigate_blockScreen_Settings} component={BlockScreenSettings} />

    <Screen name={Navigate_reward} component={RewardsScreen} />
  </Navigator>
);

// ── ROOT NAVIGATION ──────────────────────────────────────────

export default function RootNavigation() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [loading, setLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [isFirstSession, setIsFirstSession] = useState(false);

  useEffect(() => {
    checkFirstLaunch();
  }, [isAuthenticated]); // ← was [], now tracks auth changes

  const checkFirstLaunch = async () => {
    try {
      const launchValue = await AsyncStorage.getItem(FIRST_TIME_KEY);
      const permissionsValue = await AsyncStorage.getItem(PERMISSIONS_DONE_KEY);

      if (launchValue === null) {
        setIsFirstLaunch(true);
        await AsyncStorage.setItem(FIRST_TIME_KEY, "true");
      } else {
        setIsFirstLaunch(false);
      }

      if (permissionsValue === null) {
        setIsFirstSession(true);
      } else {
        setIsFirstSession(false);
      }
    } catch (error) {
      setIsFirstLaunch(true);
      setIsFirstSession(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionsDone = async () => {
    try {
      await AsyncStorage.setItem(PERMISSIONS_DONE_KEY, "true");
    } catch (e) {
      console.log("Permissions storage error:", e);
    } finally {
      setIsFirstSession(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  return isAuthenticated ? (
    <AppNavigator isFirstSession={isFirstSession} onPermissionsDone={handlePermissionsDone} />
  ) : (
    <AuthNavigator isFirstLaunch={isFirstLaunch} onOnboardingDone={() => setIsFirstLaunch(false)} />
  );
}
