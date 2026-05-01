import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  HomeScreen,
  StatsScreen,
  SettingsScreen
} from './routes';
import { useTheme } from '../context/theme/ThemeContext';
import {
  HomeFillIcon,
  HomeOutlineIcon,
  SearchFillIcon,
  SearchOutlineIcon,
  StatesOutlineIcon,
  ProfileFillIcon,
  ProfileOutlineIcon,
  StatesFillIcon
} from '../utils/svg';
const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
       screenOptions={{
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBackground,
          borderTopColor:colors.borderColor
        }
      }}
    >
      <Tab.Screen
        name="Block"
        component={HomeScreen}
          options={{
            
          tabBarIcon: ({ focused, color, size }) => {
            return focused ? <HomeFillIcon color={color} /> : <HomeOutlineIcon color={color} />
          },
          tabBarLabel: "Home"
        }}
      />

      <Tab.Screen
        name="Stats"
        component={StatsScreen}
          options={{
          lazy: true,
          tabBarIcon: ({ focused, color, size }) => {
            return focused ? <StatesFillIcon color={color} /> : <StatesOutlineIcon color={color} />
          },
          tabBarLabel: "Stats"
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
          options={{
          lazy: true,
          tabBarIcon: ({ focused, color, size }) => {
            return focused ? <ProfileFillIcon color={color} /> : <ProfileOutlineIcon Icon color={color} />
          },
          tabBarLabel: "Profile"
        }}
      />
    </Tab.Navigator>
  );
}