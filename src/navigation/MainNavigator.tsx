import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

import { HomeScreen } from '@/screens/main/HomeScreen';
import { MapScreen } from '@/screens/main/MapScreen';
import { CameraScreen } from '@/screens/main/CameraScreen';
import { ProfileScreen } from '@/screens/main/ProfileScreen';
import { LeaderboardScreen } from '@/screens/main/LeaderboardScreen';
import { CommunityScreen } from '@/screens/main/CommunityScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { NetworkStatus } from '@/components/NetworkStatus';

export type MainTabParamList = {
  Home: undefined;
  Map: undefined;
  Camera: undefined;
  Community: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabBarBadgeProps {
  count: number;
}

function TabBarBadge({ count }: TabBarBadgeProps) {
  if (count === 0) return null;
  
  return (
    <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center">
      <Text className="text-white text-xs font-bold">
        {count > 99 ? '99+' : count.toString()}
      </Text>
    </View>
  );
}

export default function MainNavigator() {
  return (
    <ErrorBoundary>
      <NetworkStatus />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
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

            const IconComponent = () => (
              <View>
                <Ionicons name={iconName} size={size} color={color} />
                {/* Add badges for specific tabs */}
                {route.name === 'Community' && <TabBarBadge count={3} />}
                {route.name === 'Profile' && <TabBarBadge count={1} />}
              </View>
            );

            return <IconComponent />;
          },
          tabBarActiveTintColor: '#16a34a',
          tabBarInactiveTintColor: '#6B7280',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            paddingBottom: 8,
            paddingTop: 8,
            height: 88,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
          // Special styling for camera tab
          ...(route.name === 'Camera' && {
            tabBarButton: (props) => (
              <View className="flex-1 items-center justify-center">
                <View className="bg-primary-600 rounded-full p-3 shadow-lg">
                  <Ionicons 
                    name={focused ? 'camera' : 'camera-outline'} 
                    size={28} 
                    color="white" 
                  />
                </View>
                <Text className={`text-xs mt-1 font-semibold ${
                  focused ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  Identifier
                </Text>
              </View>
            ),
          }),
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'Accueil',
            tabBarLabel: 'Accueil',
          }} 
        />
        <Tab.Screen 
          name="Map" 
          component={MapScreen} 
          options={{ 
            title: 'Carte',
            tabBarLabel: 'Carte',
          }} 
        />
        <Tab.Screen 
          name="Camera" 
          component={CameraScreen} 
          options={{ 
            title: 'Identifier',
            tabBarLabel: 'Identifier',
          }} 
        />
        <Tab.Screen 
          name="Community" 
          component={CommunityScreen} 
          options={{ 
            title: 'Communauté',
            tabBarLabel: 'Communauté',
          }} 
        />
        <Tab.Screen 
          name="Leaderboard" 
          component={LeaderboardScreen} 
          options={{ 
            title: 'Classement',
            tabBarLabel: 'Classement',
          }} 
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ 
            title: 'Profil',
            tabBarLabel: 'Profil',
          }} 
        />
      </Tab.Navigator>
    </ErrorBoundary>
  );
}