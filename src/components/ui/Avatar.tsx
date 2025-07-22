import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AvatarProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  source?: string;
  name?: string;
  emoji?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  badge?: boolean;
  badgeColor?: string;
}

export function Avatar({
  size = 'medium',
  source,
  name,
  emoji,
  icon,
  badge = false,
  badgeColor = '#10B981',
}: AvatarProps) {
  const getSizeStyles = () => {
    const sizes = {
      small: 'w-8 h-8',
      medium: 'w-12 h-12',
      large: 'w-16 h-16',
      xlarge: 'w-24 h-24',
    };
    return sizes[size];
  };

  const getTextSize = () => {
    const sizes = {
      small: 'text-xs',
      medium: 'text-base',
      large: 'text-xl',
      xlarge: 'text-3xl',
    };
    return sizes[size];
  };

  const getIconSize = () => {
    const sizes = {
      small: 16,
      medium: 24,
      large: 32,
      xlarge: 48,
    };
    return sizes[size];
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getBadgeSize = () => {
    const sizes = {
      small: 'w-2 h-2',
      medium: 'w-3 h-3',
      large: 'w-4 h-4',
      xlarge: 'w-5 h-5',
    };
    return sizes[size];
  };

  return (
    <View className="relative">
      <View
        className={`
          ${getSizeStyles()}
          rounded-full bg-gray-200 items-center justify-center overflow-hidden
        `}
      >
        {source ? (
          <Image
            source={{ uri: source }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : emoji ? (
          <Text className={getTextSize()}>{emoji}</Text>
        ) : icon ? (
          <Ionicons name={icon} size={getIconSize()} color="#6B7280" />
        ) : name ? (
          <Text className={`${getTextSize()} font-semibold text-gray-600`}>
            {getInitials(name)}
          </Text>
        ) : (
          <Ionicons name="person" size={getIconSize()} color="#6B7280" />
        )}
      </View>
      
      {badge && (
        <View
          className={`
            ${getBadgeSize()}
            absolute bottom-0 right-0 rounded-full border-2 border-white
          `}
          style={{ backgroundColor: badgeColor }}
        />
      )}
    </View>
  );
}