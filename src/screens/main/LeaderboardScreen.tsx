import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type Period = 'daily' | 'weekly' | 'allTime';

const mockLeaderboard = [
  { rank: 1, username: 'MycoMaster', points: 15420, avatar: '🥇' },
  { rank: 2, username: 'ForestExplorer', points: 14200, avatar: '🥈' },
  { rank: 3, username: 'TruffleHunter', points: 13850, avatar: '🥉' },
  { rank: 4, username: 'MushroomPro', points: 12300, avatar: '😎' },
  { rank: 5, username: 'NatureLover', points: 11000, avatar: '🌱' },
  { rank: 6, username: 'Chasseur123', points: 9500, avatar: '🤨', isCurrentUser: true },
  { rank: 7, username: 'BoisMystique', points: 8700, avatar: '🌲' },
  { rank: 8, username: 'CueilleurFou', points: 7200, avatar: '🍄' },
];

export function LeaderboardScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('weekly');

  const periods = [
    { key: 'daily', label: 'Jour' },
    { key: 'weekly', label: 'Semaine' },
    { key: 'allTime', label: 'Global' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-forest-dark px-6 pt-4 pb-6">
        <Text className="text-white text-2xl font-bold mb-4">Classement</Text>
        
        {/* Period selector */}
        <View className="flex-row bg-forest-medium rounded-full p-1">
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              onPress={() => setSelectedPeriod(period.key as Period)}
              className={`flex-1 py-2 rounded-full ${
                selectedPeriod === period.key ? 'bg-white' : ''
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  selectedPeriod === period.key ? 'text-forest-dark' : 'text-white'
                }`}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Leaderboard */}
      <ScrollView className="flex-1">
        {/* Top 3 */}
        <View className="px-6 py-4">
          <View className="flex-row justify-around items-end mb-6">
            {/* 2nd place */}
            <View className="items-center">
              <Text className="text-3xl mb-2">{mockLeaderboard[1].avatar}</Text>
              <View className="bg-gray-300 rounded-2xl p-4 items-center" style={{ height: 100 }}>
                <Text className="font-bold">{mockLeaderboard[1].username}</Text>
                <Text className="text-sm text-gray-600">{mockLeaderboard[1].points}</Text>
              </View>
              <Text className="text-2xl mt-2">🥈</Text>
            </View>

            {/* 1st place */}
            <View className="items-center -mt-4">
              <Text className="text-4xl mb-2">{mockLeaderboard[0].avatar}</Text>
              <View className="bg-yellow-400 rounded-2xl p-4 items-center" style={{ height: 120 }}>
                <Text className="font-bold">{mockLeaderboard[0].username}</Text>
                <Text className="text-sm">{mockLeaderboard[0].points}</Text>
              </View>
              <Text className="text-3xl mt-2">🥇</Text>
            </View>

            {/* 3rd place */}
            <View className="items-center">
              <Text className="text-3xl mb-2">{mockLeaderboard[2].avatar}</Text>
              <View className="bg-orange-300 rounded-2xl p-4 items-center" style={{ height: 90 }}>
                <Text className="font-bold">{mockLeaderboard[2].username}</Text>
                <Text className="text-sm text-gray-700">{mockLeaderboard[2].points}</Text>
              </View>
              <Text className="text-2xl mt-2">🥉</Text>
            </View>
          </View>
        </View>

        {/* Rest of leaderboard */}
        <View className="px-6">
          {mockLeaderboard.slice(3).map((player) => (
            <View
              key={player.rank}
              className={`flex-row items-center bg-white rounded-xl p-4 mb-3 ${
                player.isCurrentUser ? 'border-2 border-primary-500' : ''
              }`}
            >
              <Text className="text-lg font-bold text-gray-600 w-12">
                {player.rank}
              </Text>
              <Text className="text-2xl mr-3">{player.avatar}</Text>
              <View className="flex-1">
                <Text className="font-semibold">
                  {player.username}
                  {player.isCurrentUser && ' (Vous)'}
                </Text>
                <Text className="text-sm text-gray-600">{player.points} points</Text>
              </View>
              {player.isCurrentUser && (
                <Ionicons name="star" size={20} color="#16a34a" />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}