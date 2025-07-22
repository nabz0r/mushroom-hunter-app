import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export function Card({
  variant = 'elevated',
  padding = 'medium',
  children,
  className = '',
  ...props
}: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-white shadow-md';
      case 'outlined':
        return 'bg-white border border-gray-200';
      case 'filled':
        return 'bg-gray-50';
      default:
        return 'bg-white shadow-md';
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'small':
        return 'p-3';
      case 'medium':
        return 'p-4';
      case 'large':
        return 'p-6';
      default:
        return 'p-4';
    }
  };

  return (
    <View
      className={`rounded-2xl ${getVariantStyles()} ${getPaddingStyles()} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}