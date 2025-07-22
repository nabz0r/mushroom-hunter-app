import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  containerClassName = '',
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={containerClassName}>
      {label && (
        <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      )}
      
      <View
        className={`
          flex-row items-center bg-white rounded-lg px-4
          ${error ? 'border-2 border-red-500' : 'border border-gray-300'}
          ${isFocused ? 'border-primary-500' : ''}
        `}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? '#EF4444' : isFocused ? '#16a34a' : '#6B7280'}
            style={{ marginRight: 8 }}
          />
        )}
        
        <TextInput
          className="flex-1 py-3 text-base text-gray-900"
          placeholderTextColor="#9CA3AF"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            className="p-1"
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
}