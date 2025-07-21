import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const communityPosts = [
  {
    id: '1',
    user: { name: 'Marie_Ch', avatar: '👩‍🌾' },
    type: 'find',
    mushroom: 'Morilles',
    rarity: 'rare',
    points: 120,
    location: 'Forêt de Fontainebleau',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400',
    time: 'Il y a 2h',
    likes: 45,
    comments: 12,
  },
  {
    id: '2',
    user: { name: 'Paul_Expert', avatar: '🧑‍🏫' },
    type: 'tip',
    title: 'Conseil du jour',
    content: 'Après la pluie, attendez 2-3 jours pour une cueillette optimale!',
    time: 'Il y a 5h',
    likes: 89,
    comments: 23,
  },
  {
    id: '3',
    user: { name: 'ForestLover', avatar: '🌲' },
    type: 'warning',
    title: 'Attention!',
    content: 'Zone de chênes près du lac - Nombreuses amanites tué-mouches repérées',
    location: 'Bois de Vincennes',
    time: 'Il y a 8h',
    likes: 156,
    comments: 34,
  },
];

export function CommunityScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-forest-dark px-6 pt-4 pb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-2xl font-bold">Communauté</Text>
          <TouchableOpacity className="bg-forest-medium p-2 rounded-full">
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Quick stats */}
        <View className="flex-row justify-around bg-forest-medium rounded-xl p-3">
          <View className="items-center">
            <Text className="text-white font-bold">1.2k</Text>
            <Text className="text-forest-light text-xs">En ligne</Text>
          </View>
          <View className="items-center">
            <Text className="text-white font-bold">45</Text>
            <Text className="text-forest-light text-xs">Nouvelles trouvailles</Text>
          </View>
          <View className="items-center">
            <Text className="text-white font-bold">12</Text>
            <Text className="text-forest-light text-xs">Events actifs</Text>
          </View>
        </View>
      </View>

      {/* Posts */}
      <ScrollView className="flex-1">
        {communityPosts.map((post) => (
          <View key={post.id} className="bg-white mx-4 mt-4 rounded-2xl shadow-sm overflow-hidden">
            {/* Post header */}
            <View className="flex-row items-center p-4">
              <Text className="text-2xl mr-3">{post.user.avatar}</Text>
              <View className="flex-1">
                <Text className="font-semibold">{post.user.name}</Text>
                <Text className="text-gray-500 text-sm">{post.time}</Text>
              </View>
              {post.type === 'find' && (
                <View className="bg-primary-100 px-3 py-1 rounded-full">
                  <Text className="text-primary-700 text-sm font-semibold">+{post.points} pts</Text>
                </View>
              )}
            </View>

            {/* Post content */}
            {post.type === 'find' && (
              <>
                {post.image && (
                  <Image source={{ uri: post.image }} className="w-full h-48" />
                )}
                <View className="p-4">
                  <Text className="font-bold text-lg">{post.mushroom} trouvées!</Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location" size={16} color="#6B7280" />
                    <Text className="text-gray-600 ml-1">{post.location}</Text>
                  </View>
                </View>
              </>
            )}

            {post.type === 'tip' && (
              <View className="p-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="bulb" size={20} color="#F59E0B" />
                  <Text className="font-bold text-lg ml-2">{post.title}</Text>
                </View>
                <Text className="text-gray-700">{post.content}</Text>
              </View>
            )}

            {post.type === 'warning' && (
              <View className="p-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="warning" size={20} color="#EF4444" />
                  <Text className="font-bold text-lg ml-2 text-red-600">{post.title}</Text>
                </View>
                <Text className="text-gray-700">{post.content}</Text>
                {post.location && (
                  <View className="flex-row items-center mt-2">
                    <Ionicons name="location" size={16} color="#6B7280" />
                    <Text className="text-gray-600 ml-1">{post.location}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Post actions */}
            <View className="flex-row border-t border-gray-100 p-2">
              <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2">
                <Ionicons name="heart-outline" size={20} color="#6B7280" />
                <Text className="text-gray-600 ml-1">{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2">
                <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
                <Text className="text-gray-600 ml-1">{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 flex-row items-center justify-center py-2">
                <Ionicons name="share-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}