import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRarityColor } from '@/utils/helpers';

interface MushroomCardProps {
  name: string;
  scientificName: string;
  rarity: string;
  points: number;
  imageUrl: string;
  isEdible: boolean;
  onPress: () => void;
}

export function MushroomCard({
  name,
  scientificName,
  rarity,
  points,
  imageUrl,
  isEdible,
  onPress,
}: MushroomCardProps) {
  const rarityColor = getRarityColor(rarity);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4"
      activeOpacity={0.8}
    >
      {/* Image */}
      <Image source={{ uri: imageUrl }} className="w-full h-48" resizeMode="cover" />
      
      {/* Rarity badge */}
      <View
        className="absolute top-2 right-2 px-3 py-1 rounded-full"
        style={{ backgroundColor: rarityColor }}
      >
        <Text className="text-white text-xs font-bold capitalize">{rarity}</Text>
      </View>

      {/* Content */}
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-lg font-bold">{name}</Text>
            <Text className="text-gray-500 text-sm italic">{scientificName}</Text>
          </View>
          <View className="items-end">
            <Text className="text-primary-600 font-bold">+{points} pts</Text>
          </View>
        </View>

        {/* Edibility indicator */}
        <View className="flex-row items-center mt-2">
          <Ionicons
            name={isEdible ? 'checkmark-circle' : 'close-circle'}
            size={20}
            color={isEdible ? '#10B981' : '#EF4444'}
          />
          <Text className={`ml-1 text-sm ${isEdible ? 'text-green-600' : 'text-red-600'}`}>
            {isEdible ? 'Comestible' : 'Non comestible'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}