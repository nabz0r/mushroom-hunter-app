import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'medium';
  icon?: keyof typeof Ionicons.glyphMap;
  dot?: boolean;
}

export function Badge({
  text,
  variant = 'default',
  size = 'medium',
  icon,
  dot = false,
}: BadgeProps) {
  const getVariantStyles = () => {
    const variants = {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
    };
    return variants[variant];
  };

  const getSizeStyles = () => {
    return size === 'small' ? 'px-2 py-1' : 'px-3 py-1.5';
  };

  const getTextSize = () => {
    return size === 'small' ? 'text-xs' : 'text-sm';
  };

  const getDotColor = () => {
    const colors = {
      default: '#6B7280',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#3B82F6',
    };
    return colors[variant];
  };

  return (
    <View
      className={`
        flex-row items-center rounded-full
        ${getVariantStyles()}
        ${getSizeStyles()}
      `}
    >
      {dot && (
        <View
          className="w-2 h-2 rounded-full mr-1.5"
          style={{ backgroundColor: getDotColor() }}
        />
      )}
      {icon && (
        <Ionicons
          name={icon}
          size={size === 'small' ? 12 : 14}
          color={getDotColor()}
          style={{ marginRight: 4 }}
        />
      )}
      <Text className={`${getTextSize()} font-medium`}>
        {text}
      </Text>
    </View>
  );
}