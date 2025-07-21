import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WEATHER_MULTIPLIERS } from '@/utils/constants';

interface WeatherData {
  condition: keyof typeof WEATHER_MULTIPLIERS;
  temperature: number;
  humidity: number;
  lastRain?: string;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    condition: 'cloudy',
    temperature: 18,
    humidity: 75,
    lastRain: 'Il y a 2 jours',
  });

  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return 'sunny';
      case 'cloudy':
        return 'cloud';
      case 'rainy':
        return 'rainy';
      case 'foggy':
        return 'cloudy-night';
      default:
        return 'partly-sunny';
    }
  };

  const multiplier = WEATHER_MULTIPLIERS[weather.condition];
  const isGoodConditions = multiplier >= 1.3;

  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Ionicons name={getWeatherIcon() as any} size={32} color="#6B7280" />
          <View className="ml-3">
            <Text className="text-2xl font-bold">{weather.temperature}°C</Text>
            <Text className="text-gray-600">{weather.humidity}% humidité</Text>
          </View>
        </View>
        <View className={`px-3 py-1 rounded-full ${
          isGoodConditions ? 'bg-green-100' : 'bg-gray-100'
        }`}>
          <Text className={`font-semibold ${
            isGoodConditions ? 'text-green-700' : 'text-gray-700'
          }`}>
            x{multiplier}
          </Text>
        </View>
      </View>
      
      {weather.lastRain && (
        <Text className="text-sm text-gray-600">
          <Ionicons name="water" size={14} /> Dernière pluie: {weather.lastRain}
        </Text>
      )}
      
      {isGoodConditions && (
        <View className="mt-3 bg-green-50 rounded-lg p-2">
          <Text className="text-green-700 text-sm font-medium">
            🎯 Conditions idéales pour la cueillette!
          </Text>
        </View>
      )}
    </View>
  );
}