import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppSelector } from '@/store';
import { useGameProgress } from '@/hooks/useGameProgress';
import { useLocation } from '@/hooks/useLocation';
import { Card } from '@/components/ui/Card';
import { WeatherWidget } from '@/components/WeatherWidget';
import { QuestCard } from '@/components/QuestCard';
import { EmptyState } from '@/components/EmptyState';
import { analyticsService } from '@/services/analyticsService';
import { mockQuests, mockUserStats } from '@/data/mockData';

const { width } = Dimensions.get('window');

export function HomeScreen({ navigation }: any) {
  const { user } = useAppSelector(state => state.auth);
  const { currentLocation } = useAppSelector(state => state.location);
  const { 
    activeQuests, 
    dailyStreak, 
    level, 
    totalPoints 
  } = useGameProgress();
  
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [dailyProgress, setDailyProgress] = useState({
    found: 2,
    target: 5,
  });

  useEffect(() => {
    setGreeting(getGreeting());
    analyticsService.trackScreenView('home');
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const navigateToCamera = () => {
    navigation.navigate('Camera');
    analyticsService.trackUserAction('navigate_to_camera', { source: 'home_hero' });
  };

  const navigateToMap = () => {
    navigation.navigate('Map');
    analyticsService.trackUserAction('navigate_to_map', { source: 'home_nearby' });
  };

  const quickStats = [
    {
      label: 'Trouvés aujourd\'hui',
      value: dailyProgress.found.toString(),
      icon: 'leaf' as keyof typeof Ionicons.glyphMap,
      color: '#22c55e',
    },
    {
      label: 'Série actuelle',
      value: `${dailyStreak} jours`,
      icon: 'flame' as keyof typeof Ionicons.glyphMap,
      color: '#f59e0b',
    },
    {
      label: 'Niveau',
      value: level.toString(),
      icon: 'trophy' as keyof typeof Ionicons.glyphMap,
      color: '#8b5cf6',
    },
    {
      label: 'Points',
      value: totalPoints.toLocaleString(),
      icon: 'star' as keyof typeof Ionicons.glyphMap,
      color: '#06b6d4',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header with greeting */}
        <LinearGradient
          colors={['#2D5016', '#4A7C2E']}
          className="px-6 pb-8 pt-4"
        >
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-1">
              <Text className="text-white/80 text-base">
                {greeting} 👋
              </Text>
              <Text className="text-white text-2xl font-bold">
                {user?.username || 'Chasseur'}
              </Text>
            </View>
            
            <TouchableOpacity
              className="bg-white/20 p-3 rounded-full"
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Daily progress */}
          <Card className="bg-white/10 border-white/20">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white font-semibold text-lg">
                Objectif du jour
              </Text>
              <Text className="text-white/80">
                {dailyProgress.found}/{dailyProgress.target}
              </Text>
            </View>
            
            <View className="bg-white/20 h-3 rounded-full overflow-hidden mb-3">
              <View 
                className="bg-white h-full"
                style={{ 
                  width: `${(dailyProgress.found / dailyProgress.target) * 100}%` 
                }}
              />
            </View>
            
            <Text className="text-white/80 text-sm">
              Plus que {dailyProgress.target - dailyProgress.found} champignons à trouver !
            </Text>
          </Card>
        </LinearGradient>

        {/* Quick stats */}
        <View className="px-6 -mt-4 mb-6">
          <View className="flex-row flex-wrap -mx-2">
            {quickStats.map((stat, index) => (
              <View key={index} className="w-1/2 px-2 mb-4">
                <Card className="items-center p-4">
                  <View 
                    className="p-3 rounded-full mb-2"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Ionicons name={stat.icon} size={24} color={stat.color} />
                  </View>
                  <Text className="text-xl font-bold">{stat.value}</Text>
                  <Text className="text-gray-600 text-sm text-center">
                    {stat.label}
                  </Text>
                </Card>
              </View>
            ))}
          </View>
        </View>

        {/* Quick actions */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold mb-4">Actions rapides</Text>
          
          <View className="flex-row mb-4">
            <TouchableOpacity
              onPress={navigateToCamera}
              className="flex-1 mr-2"
            >
              <Card className="bg-primary-600 p-6 items-center">
                <Ionicons name="camera" size={32} color="white" />
                <Text className="text-white font-semibold mt-2">
                  Identifier
                </Text>
              </Card>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={navigateToMap}
              className="flex-1 ml-2"
            >
              <Card className="bg-blue-600 p-6 items-center">
                <Ionicons name="map" size={32} color="white" />
                <Text className="text-white font-semibold mt-2">
                  Explorer
                </Text>
              </Card>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weather conditions */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold mb-4">Conditions actuelles</Text>
          <WeatherWidget />
        </View>

        {/* Daily quests */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Quêtes du jour</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile', { tab: 'quests' })}
            >
              <Text className="text-primary-600 font-medium">Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          {mockQuests
            .filter(quest => quest.type === 'daily')
            .slice(0, 2)
            .map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onPress={() => {
                  // Navigate to quest details
                }}
              />
          ))}
          
          {mockQuests.filter(quest => quest.type === 'daily').length === 0 && (
            <EmptyState
              emoji="🎯"
              title="Aucune quête disponible"
              description="Revenez plus tard pour de nouvelles quêtes !"
            />
          )}
        </View>

        {/* Recent community activity */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Activité récente</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Community')}
            >
              <Text className="text-primary-600 font-medium">Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <Card className="p-4">
            <View className="flex-row items-center mb-3">
              <View className="bg-primary-100 p-2 rounded-full mr-3">
                <Text className="text-lg">🍄</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold">Marie_Ch a trouvé une Morille</Text>
                <Text className="text-gray-600 text-sm">Il y a 15 minutes • Forêt de Fontainebleau</Text>
              </View>
              <Text className="text-primary-600 font-bold">+120 pts</Text>
            </View>
            
            <TouchableOpacity
              onPress={() => navigation.navigate('Community')}
              className="bg-gray-50 p-3 rounded-lg"
            >
              <Text className="text-center text-gray-600">
                Voir plus d'activités
              </Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Tips of the day */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold mb-4">Conseil du jour</Text>
          <Card className="bg-yellow-50 border-yellow-200 p-4">
            <View className="flex-row items-start">
              <View className="bg-yellow-100 p-2 rounded-full mr-3">
                <Ionicons name="bulb" size={20} color="#f59e0b" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-yellow-800 mb-1">
                  Meilleur moment pour chercher
                </Text>
                <Text className="text-yellow-700 text-sm leading-5">
                  Après une pluie légère, attendez 2-3 jours. L'humidité favorise la croissance des champignons !
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}