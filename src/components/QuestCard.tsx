import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Quest } from '@/store/slices/gameSlice';

interface QuestCardProps {
  quest: Quest;
  onPress: () => void;
}

export function QuestCard({ quest, onPress }: QuestCardProps) {
  const totalProgress = quest.requirements.reduce(
    (sum, req) => sum + (req.current / req.target),
    0
  ) / quest.requirements.length;

  const isCompleted = quest.requirements.every(req => req.current >= req.target);

  const getQuestIcon = () => {
    switch (quest.type) {
      case 'daily':
        return 'today';
      case 'weekly':
        return 'calendar';
      case 'seasonal':
        return 'leaf';
      default:
        return 'trophy';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`bg-white rounded-2xl p-4 mb-3 shadow-sm ${
        isCompleted ? 'border-2 border-green-500' : ''
      }`}
      disabled={isCompleted}
    >
      <View className="flex-row items-start mb-3">
        <View className="bg-primary-100 p-2 rounded-full mr-3">
          <Ionicons name={getQuestIcon() as any} size={24} color="#16a34a" />
        </View>
        <View className="flex-1">
          <Text className="font-bold text-lg">{quest.title}</Text>
          <Text className="text-gray-600 text-sm mt-1">{quest.description}</Text>
        </View>
      </View>

      {/* Progress bars */}
      <View className="space-y-2">
        {quest.requirements.map((req, index) => (
          <View key={index}>
            <View className="flex-row justify-between mb-1">
              <Text className="text-sm text-gray-600">
                {req.type.replace(/_/g, ' ')}
              </Text>
              <Text className="text-sm font-semibold">
                {req.current}/{req.target}
              </Text>
            </View>
            <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
              <View
                className="bg-primary-500 h-full"
                style={{ width: `${(req.current / req.target) * 100}%` }}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Reward */}
      <View className="flex-row items-center justify-between mt-4">
        <View className="flex-row items-center">
          <Text className="text-primary-600 font-bold">+{quest.reward.points} pts</Text>
          {quest.reward.achievement && (
            <Text className="ml-2 text-sm text-gray-600">+ Achievement</Text>
          )}
        </View>
        {isCompleted && (
          <View className="bg-green-500 px-3 py-1 rounded-full">
            <Text className="text-white text-sm font-bold">Terminé!</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}