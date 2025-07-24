import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export function LoadingSpinner({ 
  size = 40, 
  color = '#16a34a',
  backgroundColor = 'transparent' 
}: LoadingSpinnerProps) {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startRotation = () => {
      rotateValue.setValue(0);
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => startRotation());
    };

    startRotation();
  }, []);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View 
      className="items-center justify-center"
      style={{ backgroundColor }}
    >
      <Animated.View
        style={{
          transform: [{ rotate }],
        }}
      >
        <Ionicons 
          name="reload" 
          size={size} 
          color={color} 
        />
      </Animated.View>
    </View>
  );
}

export function LoadingOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 bg-black/50 items-center justify-center z-50">
      <View className="bg-white rounded-2xl p-6 items-center">
        <LoadingSpinner size={48} />
        <Text className="text-gray-700 font-medium mt-4">
          Chargement...
        </Text>
      </View>
    </View>
  );
}