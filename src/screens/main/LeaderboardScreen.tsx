import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Card } from '@/components/ui/Card';
import { TabView } from '@/components/ui/TabView';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/EmptyState';
import { useAppSelector } from '@/store';
import { analyticsService } from '@/services/analyticsService';
import { mockLeaderboardData } from '@/data/mockData';

type Period = 'daily' | 'weekly' | 'monthly' | 'allTime';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  points: number;
  level: number;
  mushroomsFound: number;
  rareFinds: number;
  isCurrentUser?: boolean;
  trend?: 'up' | 'down' | 'stable';
  previousRank?: number;
}

const PodiumCard = ({ entry, position }: {
  entry: LeaderboardEntry;
  position: 1 | 2 | 3;
}) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      delay: position * 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const getHeightClass = () => {
    switch (position) {
      case 1: return 'h-32';
      case 2: return 'h-24';
      case 3: return 'h-20';
    }
  };

  const getBackgroundColor = () => {
    switch (position) {
      case 1: return ['#FFD700', '#FFA500'];
      case 2: return ['#C0C0C0', '#A8A8A8'];
      case 3: return ['#CD7F32', '#B8860B'];
    }
  };

  const getMedal = () => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
    }
  };

  return (
    <Animated.View 
      className="items-center flex-1 mx-2"
      style={{ transform: [{ scale: scaleValue }] }}
    >
      {/* Avatar */}
      <Avatar
        emoji={entry.avatar}
        size={position === 1 ? 'xlarge' : 'large'}
        style={{ marginBottom: 8 }}
      />
      
      {/* Podium */}
      <LinearGradient
        colors={getBackgroundColor()}
        className={`${getHeightClass()} w-full rounded-t-2xl items-center justify-end pb-4`}
      >
        <Text className="text-3xl mb-2">{getMedal()}</Text>
        <Text className="text-white font-bold text-sm text-center">
          {entry.username}
        </Text>
        <Text className="text-white/80 text-xs">
          {entry.points.toLocaleString()}
        </Text>
      </LinearGradient>
      
      {/* Rank badge */}
      <View className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-lg">
        <Text className="text-xs font-bold text-gray-700">#{entry.rank}</Text>
      </View>
    </Animated.View>
  );
};

const LeaderboardRow = ({ entry, index }: {
  entry: LeaderboardEntry;
  index: number;
}) => {
  const slideValue = React.useRef(new Animated.Value(50)).current;
  const opacityValue = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(slideValue, {
        toValue: 0,
        delay: index * 100,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        delay: index * 100,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getTrendIcon = () => {
    if (!entry.trend || !entry.previousRank) return null;
    
    switch (entry.trend) {
      case 'up':
        return <Ionicons name="trending-up" size={16} color="#22c55e" />;
      case 'down':
        return <Ionicons name="trending-down" size={16} color="#ef4444" />;
      case 'stable':
        return <Ionicons name="remove" size={16} color="#6b7280" />;
    }
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateX: slideValue }],
        opacity: opacityValue,
      }}
    >
      <Card 
        className={`mb-3 ${entry.isCurrentUser ? 'border-2 border-primary-500 bg-primary-50' : ''}`}
      >
        <View className="flex-row items-center p-4">
          {/* Rank */}
          <View className="w-12 items-center">
            <Text className="text-lg font-bold text-gray-600">
              #{entry.rank}
            </Text>
            {getTrendIcon()}
          </View>
          
          {/* Avatar */}
          <Avatar
            emoji={entry.avatar}
            size="medium"
            style={{ marginHorizontal: 12 }}
          />
          
          {/* User Info */}
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="font-semibold text-lg">
                {entry.username}
                {entry.isCurrentUser && ' (Vous)'}
              </Text>
              {entry.isCurrentUser && (
                <Ionicons name="star" size={16} color="#16a34a" style={{ marginLeft: 4 }} />
              )}
            </View>
            <View className="flex-row items-center mt-1">
              <Text className="text-gray-600 text-sm mr-4">
                Niveau {entry.level}
              </Text>
              <Text className="text-gray-600 text-sm">
                {entry.mushroomsFound} trouvés
              </Text>
            </View>
          </View>
          
          {/* Points */}
          <View className="items-end">
            <Text className="font-bold text-lg text-primary-600">
              {entry.points.toLocaleString()}
            </Text>
            <Text className="text-gray-500 text-xs">points</Text>
            
            {entry.rareFinds > 0 && (
              <Badge
                text={`${entry.rareFinds} rares`}
                variant="warning"
                size="small"
                style={{ marginTop: 4 }}
              />
            )}
          </View>
        </View>
      </Card>
    </Animated.View>
  );
};

export function LeaderboardScreen() {
  const { user } = useAppSelector(state => state.auth);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('weekly');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(mockLeaderboardData);
  const [refreshing, setRefreshing] = useState(false);
  const [userPosition, setUserPosition] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    analyticsService.trackScreenView('leaderboard', { period: selectedPeriod });
    loadLeaderboard();
  }, [selectedPeriod]);

  const loadLeaderboard = async () => {
    // In a real app, this would call the API
    // const data = await gameService.getLeaderboard(selectedPeriod);
    
    // Find user position
    const currentUser = leaderboardData.find(entry => entry.isCurrentUser);
    if (currentUser) {
      setUserPosition(currentUser);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    analyticsService.trackUserAction('refresh_leaderboard', { period: selectedPeriod });
    
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [selectedPeriod]);

  const periods = [
    { key: 'daily', label: 'Jour' },
    { key: 'weekly', label: 'Semaine' },
    { key: 'monthly', label: 'Mois' },
    { key: 'allTime', label: 'Global' },
  ];

  const tabs = periods.map(period => ({
    key: period.key,
    title: period.label,
  }));

  const renderTabContent = (tabKey: string) => {
    const topThree = leaderboardData.slice(0, 3);
    const remaining = leaderboardData.slice(3);

    return (
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Podium */}
        {topThree.length >= 3 && (
          <View className="px-6 py-8">
            <Text className="text-2xl font-bold text-center mb-6">🏆 Top 3 🏆</Text>
            <View className="flex-row items-end justify-center h-40">
              {/* 2nd place */}
              <PodiumCard entry={topThree[1]} position={2} />
              {/* 1st place */}
              <View style={{ marginTop: -20 }}>
                <PodiumCard entry={topThree[0]} position={1} />
              </View>
              {/* 3rd place */}
              <PodiumCard entry={topThree[2]} position={3} />
            </View>
          </View>
        )}

        {/* User's position (if not in top 10) */}
        {userPosition && userPosition.rank > 10 && (
          <View className="px-6 mb-4">
            <Text className="text-lg font-bold mb-3">Votre position</Text>
            <LeaderboardRow entry={userPosition} index={0} />
          </View>
        )}

        {/* Rest of leaderboard */}
        <View className="px-6 pb-8">
          <Text className="text-lg font-bold mb-4">
            {topThree.length >= 3 ? 'Classement complet' : 'Classement'}
          </Text>
          
          {remaining.length > 0 ? (
            remaining.map((entry, index) => (
              <LeaderboardRow key={entry.userId} entry={entry} index={index} />
            ))
          ) : (
            <EmptyState
              emoji="📊"
              title="Classement vide"
              description="Soyez le premier à marquer des points !"
            />
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={['#2D5016', '#4A7C2E']}
        className="px-6 pt-4 pb-6"
      >
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-2xl font-bold">Classement</Text>
          <TouchableOpacity className="bg-white/20 p-2 rounded-full">
            <Ionicons name="information-circle-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Current user summary */}
        {userPosition && (
          <Card className="bg-white/10 border-white/20">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Avatar emoji={userPosition.avatar} size="medium" />
                <View className="ml-3">
                  <Text className="text-white font-bold text-lg">
                    #{userPosition.rank}
                  </Text>
                  <Text className="text-white/80">{user?.username}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-white font-bold text-xl">
                  {userPosition.points.toLocaleString()}
                </Text>
                <Text className="text-white/80 text-sm">points</Text>
              </View>
            </View>
          </Card>
        )}
      </LinearGradient>

      {/* Tab Content */}
      <View className="flex-1 -mt-4">
        <TabView
          tabs={tabs}
          initialTab="weekly"
          onTabChange={(tabKey) => {
            setSelectedPeriod(tabKey as Period);
            analyticsService.trackUserAction('change_leaderboard_period', { period: tabKey });
          }}
          renderTabContent={renderTabContent}
        />
      </View>
    </SafeAreaView>
  );
}