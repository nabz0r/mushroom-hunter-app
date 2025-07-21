import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { MapScreen } from '@/screens/main/MapScreen';
import { CameraScreen } from '@/screens/main/CameraScreen';
import { ProfileScreen } from '@/screens/main/ProfileScreen';
import { LeaderboardScreen } from '@/screens/main/LeaderboardScreen';
import { CommunityScreen } from '@/screens/main/CommunityScreen';

export type MainTabParamList = {
  Map: undefined;
  Camera: undefined;
  Community: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Map':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Camera':
              iconName = focused ? 'camera' : 'camera-outline';
              break;
            case 'Community':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Leaderboard':
              iconName = focused ? 'trophy' : 'trophy-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'alert-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Carte' }} />
      <Tab.Screen name="Camera" component={CameraScreen} options={{ title: 'Identifier' }} />
      <Tab.Screen name="Community" component={CommunityScreen} options={{ title: 'Communauté' }} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: 'Classement' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}