import React, { useCallback } from "react";
import { View, StyleSheet, InteractionManager } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import Spacer from "../../components/shared/Spacer";

import Container from "../../layout/Container";
import MainHeader from "../../components/headers/MainHeader";
import AnalyticsCards from "../../components/home/AnalyticsCards";
import SectionHeading from "../../components/sections/SectionHeading";
import QuickActionsCard from "../../components/home/QuickActionsCard";
import usePermissions from "../../hooks/usePermissions";
import { useAppBlocker } from "../../context/AppBlockerContext";
import { useTheme } from "../../context/theme/ThemeContext";
import { CONTAINER_SPACING } from "../../utils/constants";
import { Navigate_Apps_List, Navigate_reward } from "../../routes/path";
import PermissionsList from "../../components/permissions/PermissionsList";
import PointsCard from "../../components/rewards/PointsCard";
import ChallengeCard from "../../components/rewards/ChallengeCard";
import { REWARDS } from "../rewards/RewardsScreen";

export default function Home() {
  const state = useAppBlocker();
  const { colors } = useTheme();
  const navigation = useNavigation();

  const totalTime = Object.values(state.timers || {}).reduce((acc, t) => acc + Number(t || 0), 0);

  const { permissions, loading, handleOverlay, handleAccessibility, handleUsage, handleNotification } = usePermissions();
const scheduledApps = Object.keys(state.days || {}).filter(
  pkg => state.days[pkg]?.length > 0
).length;
  return (
    <Container>
      <KeyboardAwareScrollView nestedScrollEnabled contentContainerStyle={{ paddingTop: 0, flexGrow: 1 }} stickyHeaderIndices={[0]}>
        <View style={{ paddingHorizontal: CONTAINER_SPACING }}>
          <MainHeader />
        </View>

        <View style={{ flex: 1, padding: 16, paddingTop: 0 }}>
          <PermissionsList
            permissions={permissions}
            onAccessibility={handleAccessibility}
            onOverlay={handleOverlay}
            onUsage={handleUsage}
            onNotification={handleNotification}
          />

          <Spacer space={"3%"} />

          <PointsCard points={240} />

          <Spacer space={"3%"} />

          <AnalyticsCards blockedApps={state.selected.length} scheduledApps={scheduledApps} />

          <SectionHeading title="Quick Actions" label="" />
          <QuickActionsCard
            onAppsPress={() => {
              InteractionManager.runAfterInteractions(() => {
                navigation.navigate(Navigate_Apps_List);
              });
            }}
            onRewardsPress={() => {
              navigation.navigate(Navigate_reward);
            }}
          />

          <SectionHeading title="Daily Challenges" label="" />
          <ChallengeCard item={REWARDS[0]} />
          <ChallengeCard item={REWARDS[1]} />
          <ChallengeCard item={REWARDS[2]} />
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  // kept minimal — layout handled inline above
});
