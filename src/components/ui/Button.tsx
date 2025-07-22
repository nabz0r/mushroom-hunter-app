import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const getVariantStyles = (): string => {
    const variants = {
      primary: 'bg-primary-600 active:bg-primary-700',
      secondary: 'bg-gray-200 active:bg-gray-300',
      danger: 'bg-red-500 active:bg-red-600',
      ghost: 'bg-transparent',
    };
    return variants[variant];
  };

  const getSizeStyles = (): string => {
    const sizes = {
      small: 'px-3 py-2',
      medium: 'px-4 py-3',
      large: 'px-6 py-4',
    };
    return sizes[size];
  };

  const getTextColor = (): string => {
    if (variant === 'secondary') return 'text-gray-900';
    if (variant === 'ghost') return 'text-primary-600';
    return 'text-white';
  };

  const getTextSize = (): string => {
    const sizes = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
    };
    return sizes[size];
  };

  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        rounded-full flex-row items-center justify-center
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50' : ''}
      `}
      style={style}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' ? '#1F2937' : '#FFFFFF'}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={variant === 'secondary' ? '#1F2937' : variant === 'ghost' ? '#16a34a' : '#FFFFFF'}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            className={`${getTextColor()} ${getTextSize()} font-semibold`}
            style={textStyle}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={variant === 'secondary' ? '#1F2937' : variant === 'ghost' ? '#16a34a' : '#FFFFFF'}
              style={{ marginLeft: 8 }}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}