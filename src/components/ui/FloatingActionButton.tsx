import React from 'react';
import { TouchableOpacity, Animated, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FloatingActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

export function FloatingActionButton({
  icon,
  onPress,
  size = 'medium',
  color = 'white',
  backgroundColor = '#16a34a',
  style,
  disabled = false,
}: FloatingActionButtonProps) {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const getSizeStyles = () => {
    const sizes = {
      small: 'w-12 h-12',
      medium: 'w-16 h-16',
      large: 'w-20 h-20',
    };
    return sizes[size];
  };

  const getIconSize = () => {
    const sizes = {
      small: 20,
      medium: 28,
      large: 36,
    };
    return sizes[size];
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleValue }],
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        className={`
          ${getSizeStyles()}
          rounded-full items-center justify-center shadow-lg
          ${disabled ? 'opacity-50' : ''}
        `}
        style={{
          backgroundColor: disabled ? '#9CA3AF' : backgroundColor,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
        }}
        activeOpacity={0.8}
      >
        <Ionicons
          name={icon}
          size={getIconSize()}
          color={color}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}