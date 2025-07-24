import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './ui/Card';

interface PermissionRequestProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onGrant: () => void;
  onSkip?: () => void;
  required?: boolean;
}

export function PermissionRequest({
  icon,
  title,
  description,
  onGrant,
  onSkip,
  required = false,
}: PermissionRequestProps) {
  const handleOpenSettings = () => {
    Alert.alert(
      'Ouvrir les paramètres',
      'Vous pouvez activer les permissions dans les paramètres de votre téléphone.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Paramètres', onPress: () => Linking.openSettings() },
      ]
    );
  };

  return (
    <View className="flex-1 items-center justify-center px-6">
      <Card className="w-full items-center p-8">
        <View className="bg-primary-100 p-6 rounded-full mb-6">
          <Ionicons name={icon} size={48} color="#16a34a" />
        </View>
        
        <Text className="text-2xl font-bold text-center mb-4">
          {title}
        </Text>
        
        <Text className="text-gray-600 text-center mb-8 leading-6">
          {description}
        </Text>
        
        <View className="w-full space-y-3">
          <TouchableOpacity
            onPress={onGrant}
            className="bg-primary-600 py-4 rounded-full"
          >
            <Text className="text-white font-semibold text-center text-lg">
              Autoriser l'accès
            </Text>
          </TouchableOpacity>
          
          {!required && onSkip && (
            <TouchableOpacity
              onPress={onSkip}
              className="py-3"
            >
              <Text className="text-gray-600 text-center">
                Passer pour le moment
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={handleOpenSettings}
            className="py-3"
          >
            <Text className="text-primary-600 text-center font-medium">
              Ouvrir les paramètres
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    </View>
  );
}