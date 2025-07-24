import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  emoji?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  emoji,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      {emoji ? (
        <Text className="text-6xl mb-6">{emoji}</Text>
      ) : (
        icon && (
          <View className="bg-gray-100 p-6 rounded-full mb-6">
            <Ionicons name={icon} size={48} color="#6B7280" />
          </View>
        )
      )}
      
      <Text className="text-xl font-bold text-center mb-3 text-gray-900">
        {title}
      </Text>
      
      <Text className="text-base text-center text-gray-600 mb-8 leading-6">
        {description}
      </Text>
      
      {actionText && onAction && (
        <TouchableOpacity
          onPress={onAction}
          className="bg-primary-600 px-6 py-3 rounded-full"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}