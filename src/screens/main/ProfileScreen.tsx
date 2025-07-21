import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';

export function ProfileScreen() {
  const { user } = useAppSelector(state => state.auth);
  const { totalPoints, level, experience, experienceToNextLevel } = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();

  const stats = [
    { label: 'Champignons trouvés', value: '127', icon: 'leaf' },
    { label: 'Espèces identifiées', value: '23', icon: 'search' },
    { label: 'Spots partagés', value: '15', icon: 'location' },
    { label: 'Jours actifs', value: '45', icon: 'calendar' },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-forest-dark px-6 pt-6 pb-10">
          <View className="flex-row justify-between items-start mb-6">
            <Text className="text-white text-2xl font-bold">Mon Profil</Text>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="settings-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* User info */}
          <View className="items-center">
            <View className="w-24 h-24 bg-gray-300 rounded-full mb-4 items-center justify-center">
              <Text className="text-4xl">🤨</Text>
            </View>
            <Text className="text-white text-xl font-bold">{user?.username || 'Chasseur'}</Text>
            <Text className="text-forest-light">{user?.email}</Text>
          </View>
        </View>

        {/* Level Progress */}
        <View className="px-6 -mt-6">
          <View className="bg-white rounded-2xl p-4 shadow-md">
            <View className="flex-row justify-between mb-2">
              <Text className="font-semibold">Niveau {level}</Text>
              <Text className="text-gray-600">{experience}/{experienceToNextLevel} XP</Text>
            </View>
            <View className="bg-gray-200 h-3 rounded-full overflow-hidden">
              <View 
                className="bg-primary-500 h-full"
                style={{ width: `${(experience / experienceToNextLevel) * 100}%` }}
              />
            </View>
            <Text className="text-center text-primary-600 font-bold text-2xl mt-3">
              {totalPoints} points
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-bold mb-4">Statistiques</Text>
          <View className="flex-row flex-wrap -mx-2">
            {stats.map((stat, index) => (
              <View key={index} className="w-1/2 px-2 mb-4">
                <View className="bg-white rounded-xl p-4 shadow-sm">
                  <Ionicons name={stat.icon as any} size={24} color="#16a34a" />
                  <Text className="text-2xl font-bold mt-2">{stat.value}</Text>
                  <Text className="text-gray-600 text-sm">{stat.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Achievements */}
        <View className="px-6 mt-6 mb-8">
          <Text className="text-lg font-bold mb-4">Achievements récents</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Première Morille', 'Chasseur Nocturne', '7 jours consécutifs'].map((achievement, index) => (
              <View key={index} className="bg-primary-100 rounded-xl p-4 mr-3 items-center" style={{ width: 120 }}>
                <Text className="text-3xl mb-2">🏅</Text>
                <Text className="text-sm text-center font-medium">{achievement}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="mx-6 mb-8 bg-red-500 py-3 rounded-full"
        >
          <Text className="text-white text-center font-semibold">Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}