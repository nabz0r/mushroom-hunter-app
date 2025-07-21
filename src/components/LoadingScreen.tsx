import React from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function LoadingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-forest-dark">
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-8">
          {/* Placeholder for mushroom logo */}
          <View className="w-32 h-32 bg-mushroom-brown rounded-full items-center justify-center">
            <Text className="text-6xl">🍄</Text>
          </View>
        </View>
        
        <ActivityIndicator size="large" color="#6B8E23" />
        
        <Text className="text-white text-2xl font-bold mt-6 mb-2">
          Mushroom Hunter
        </Text>
        
        <Text className="text-forest-light text-center">
          Chargement de votre aventure mycologique...
        </Text>
      </View>
    </SafeAreaView>
  );
}