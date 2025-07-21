import React from 'react';
import { View, Text } from 'react-native';
import { Marker } from 'react-native-maps';
import { getRarityColor } from '@/utils/helpers';

interface SpotMarkerProps {
  latitude: number;
  longitude: number;
  mushroomName: string;
  rarity: string;
  isVerified: boolean;
  onPress: () => void;
}

export function SpotMarker({
  latitude,
  longitude,
  mushroomName,
  rarity,
  isVerified,
  onPress,
}: SpotMarkerProps) {
  const color = getRarityColor(rarity);

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      onPress={onPress}
    >
      <View className="items-center">
        <View
          className="p-3 rounded-full shadow-lg relative"
          style={{ backgroundColor: color }}
        >
          <Text className="text-2xl">🍄</Text>
          {isVerified && (
            <View className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
              <Text className="text-xs">✓</Text>
            </View>
          )}
        </View>
        <View className="bg-white px-2 py-1 rounded-full mt-1 shadow-sm">
          <Text className="text-xs font-semibold">{mushroomName}</Text>
        </View>
      </View>
    </Marker>
  );
}