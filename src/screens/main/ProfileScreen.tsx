import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { useGameProgress } from '@/hooks/useGameProgress';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TabView } from '@/components/ui/TabView';
import { QuestCard } from '@/components/QuestCard';
import { EmptyState } from '@/components/EmptyState';
import { analyticsService } from '@/services/analyticsService';
import { mockQuests, mockAchievements, mockUserStats } from '@/data/mockData';

const StatCard = ({ icon, label, value, color }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
}) => (
  <Card className="flex-1 items-center p-4 mx-1">
    <View 
      className="p-3 rounded-full mb-2"
      style={{ backgroundColor: `${color}20` }}
    >
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text className="text-xl font-bold">{value}</Text>
    <Text className="text-gray-600 text-xs text-center">{label}</Text>
  </Card>
);

const AchievementCard = ({ achievement }: { achievement: any }) => (
  <Card className="p-4 mb-3">
    <View className="flex-row items-center">
      <Text className="text-3xl mr-3">{achievement.icon}</Text>
      <View className="flex-1">
        <Text className="font-bold text-lg">{achievement.title}</Text>
        <Text className="text-gray-600 text-sm">{achievement.description}</Text>
      </View>
      <View className="items-center">
        <Text className="text-primary-600 font-bold">+{achievement.points}</Text>
        <Text className="text-xs text-gray-500">points</Text>
      </View>
    </View>
  </Card>
);

export function ProfileScreen({ navigation }: any) {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const {
    activeQuests,
    unlockedAchievements,
    dailyStreak,
    level,
    totalPoints,
  } = useGameProgress();
  
  const [activeTab, setActiveTab] = useState('stats');
  const [userStats] = useState(mockUserStats);

  useEffect(() => {
    analyticsService.trackScreenView('profile');
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => {
            analyticsService.trackUserAction('logout');
            dispatch(logout());
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    analyticsService.trackUserAction('edit_profile_start');
  };

  const handleShareProfile = () => {
    // Share profile functionality
    analyticsService.trackUserAction('share_profile');
  };

  const calculateLevelProgress = () => {
    const currentLevelXP = (level - 1) * 1000;
    const nextLevelXP = level * 1000;
    const progress = totalPoints - currentLevelXP;
    const maxProgress = nextLevelXP - currentLevelXP;
    return { progress, maxProgress, percentage: (progress / maxProgress) * 100 };
  };

  const levelProgress = calculateLevelProgress();

  const tabs = [
    { key: 'stats', title: 'Statistiques' },
    { key: 'quests', title: 'Quêtes', badge: activeQuests.length },
    { key: 'achievements', title: 'Succès', badge: unlockedAchievements.length },
    { key: 'collection', title: 'Collection' },
  ];

  const renderTabContent = (tabKey: string) => {
    switch (tabKey) {
      case 'stats':
        return (
          <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
            {/* Detailed Stats */}
            <View className="mb-6">
              <Text className="text-xl font-bold mb-4">Statistiques détaillées</Text>
              
              <View className="flex-row mb-4">
                <StatCard
                  icon="leaf"
                  label="Champignons trouvés"
                  value={userStats.totalMushroomsFound.toString()}
                  color="#22c55e"
                />
                <StatCard
                  icon="search"
                  label="Espèces identifiées"
                  value={userStats.uniqueSpeciesIdentified.toString()}
                  color="#3b82f6"
                />
              </View>
              
              <View className="flex-row mb-4">
                <StatCard
                  icon="location"
                  label="Spots partagés"
                  value={userStats.spotsShared.toString()}
                  color="#8b5cf6"
                />
                <StatCard
                  icon="calendar"
                  label="Jours actifs"
                  value={userStats.daysActive.toString()}
                  color="#f59e0b"
                />
              </View>
            </View>

            {/* Streaks */}
            <View className="mb-6">
              <Text className="text-xl font-bold mb-4">Séries</Text>
              <Card className="p-4">
                <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center">
                    <Ionicons name="flame" size={24} color="#f59e0b" />
                    <Text className="ml-2 font-semibold">Série actuelle</Text>
                  </View>
                  <Text className="text-2xl font-bold text-orange-500">
                    {userStats.currentStreak} jours
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">Record personnel</Text>
                  <Text className="font-semibold">{userStats.longestStreak} jours</Text>
                </View>
              </Card>
            </View>

            {/* Favorite Locations */}
            <View className="mb-6">
              <Text className="text-xl font-bold mb-4">Lieux favoris</Text>
              <Card className="p-4">
                <View className="flex-row items-center">
                  <Ionicons name="location" size={24} color="#16a34a" />
                  <View className="ml-3 flex-1">
                    <Text className="font-semibold">{userStats.favoriteSpot.name}</Text>
                    <Text className="text-gray-600 text-sm">
                      Votre zone de chasse la plus productive
                    </Text>
                  </View>
                </View>
              </Card>
            </View>

            {/* Rare Finds */}
            <View className="mb-6">
              <Text className="text-xl font-bold mb-4">Trouvailles rares</Text>
              {userStats.rareFinds.map((find, index) => (
                <Card key={index} className="p-4 mb-2">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Text className="text-2xl mr-3">💎</Text>
                      <View>
                        <Text className="font-semibold">Espèce rare #{find.mushroomId}</Text>
                        <Text className="text-gray-600 text-sm">
                          Trouvé {find.count} fois
                        </Text>
                      </View>
                    </View>
                    <Text className="text-purple-600 font-bold">Rare</Text>
                  </View>
                </Card>
              ))}
            </View>
          </ScrollView>
        );

      case 'quests':
        return (
          <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
            <Text className="text-xl font-bold mb-4">Quêtes actives</Text>
            {mockQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onPress={() => {
                  // Navigate to quest details
                }}
              />
            ))}
            {mockQuests.length === 0 && (
              <EmptyState
                emoji="🎯"
                title="Aucune quête active"
                description="Revenez plus tard pour de nouvelles quêtes !"
              />
            )}
          </ScrollView>
        );

      case 'achievements':
        return (
          <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
            <Text className="text-xl font-bold mb-4">Vos succès</Text>
            {mockAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
            {mockAchievements.length === 0 && (
              <EmptyState
                emoji="🏆"
                title="Aucun succès débloqué"
                description="Continuez à chasser pour débloquer des succès !"
              />
            )}
          </ScrollView>
        );

      case 'collection':
        return (
          <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
            <EmptyState
              emoji="📚"
              title="Collection de champignons"
              description="Votre collection personnelle de champignons identifiés apparaîtra ici."
            />
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={['#2D5016', '#4A7C2E']}
        className="px-6 pb-8 pt-4"
      >
        <View className="flex-row justify-between items-start mb-6">
          <Text className="text-white text-2xl font-bold">Mon Profil</Text>
          <View className="flex-row">
            <TouchableOpacity
              onPress={handleShareProfile}
              className="bg-white/20 p-2 rounded-full mr-2"
            >
              <Ionicons name="share-outline" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings')}
              className="bg-white/20 p-2 rounded-full"
            >
              <Ionicons name="settings-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Info */}
        <View className="items-center mb-6">
          <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl">🧑‍🌾</Text>
          </View>
          <Text className="text-white text-xl font-bold">
            {user?.username || 'Chasseur'}
          </Text>
          <Text className="text-white/80">{user?.email}</Text>
          
          <TouchableOpacity
            onPress={handleEditProfile}
            className="bg-white/20 px-4 py-2 rounded-full mt-3"
          >
            <Text className="text-white font-medium">Modifier le profil</Text>
          </TouchableOpacity>
        </View>

        {/* Level Progress */}
        <Card className="bg-white/10 border-white/20">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white font-semibold text-lg">
              Niveau {level}
            </Text>
            <Text className="text-white/80">
              {levelProgress.progress}/{levelProgress.maxProgress} XP
            </Text>
          </View>
          
          <View className="bg-white/20 h-3 rounded-full overflow-hidden mb-3">
            <View 
              className="bg-white h-full"
              style={{ width: `${levelProgress.percentage}%` }}
            />
          </View>
          
          <View className="flex-row justify-between items-center">
            <Text className="text-white/80 text-sm">
              {totalPoints.toLocaleString()} points au total
            </Text>
            <Text className="text-white text-lg font-bold">
              #{Math.floor(Math.random() * 1000) + 1}
            </Text>
          </View>
        </Card>
      </LinearGradient>

      {/* Tab Content */}
      <View className="flex-1 -mt-4">
        <TabView
          tabs={tabs}
          initialTab="stats"
          onTabChange={setActiveTab}
          renderTabContent={renderTabContent}
        />
      </View>

      {/* Logout Button */}
      <View className="p-4 border-t border-gray-200">
        <Button
          title="Déconnexion"
          onPress={handleLogout}
          variant="danger"
          icon="log-out-outline"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}