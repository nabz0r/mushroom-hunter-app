import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from './ui/BottomSheet';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { getRarityColor } from '@/utils/helpers';
import { MushroomIdentification } from '@/types';

interface MushroomIdentificationModalProps {
  isVisible: boolean;
  onClose: () => void;
  identification: MushroomIdentification | null;
  imageUri: string;
  onConfirm: (mushroomId: string) => void;
  onReject: () => void;
}

export function MushroomIdentificationModal({
  isVisible,
  onClose,
  identification,
  imageUri,
  onConfirm,
  onReject,
}: MushroomIdentificationModalProps) {
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  if (!identification) {
    return (
      <BottomSheet
        isVisible={isVisible}
        onClose={onClose}
        height={300}
      >
        <View className="flex-1 items-center justify-center p-8">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="text-lg font-semibold mt-4">Identification en cours...</Text>
          <Text className="text-gray-600 text-center mt-2">
            Notre IA analyse votre photo pour identifier l'espèce
          </Text>
        </View>
      </BottomSheet>
    );
  }

  const mainSuggestion = identification.mushroom;
  const allSuggestions = [
    mainSuggestion,
    ...identification.alternativeSuggestions,
  ];
  const selectedMushroom = allSuggestions[selectedSuggestionIndex];

  return (
    <BottomSheet
      isVisible={isVisible}
      onClose={onClose}
      height={600}
      title="Résultat de l'identification"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image */}
        <Image
          source={{ uri: imageUri }}
          className="w-full h-48"
          resizeMode="cover"
        />

        {/* Main Result */}
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold">{selectedMushroom.name}</Text>
              <Text className="text-gray-600 italic">{selectedMushroom.scientificName}</Text>
            </View>
            <View className="items-end">
              <Badge
                text={`${Math.round(selectedMushroom.confidence * 100)}%`}
                variant={selectedMushroom.confidence > 0.8 ? 'success' : 'warning'}
                icon="analytics"
              />
            </View>
          </View>

          {/* Edibility Warning */}
          {identification.edibility && (
            <Card
              variant={identification.edibility.isEdible ? 'filled' : 'outlined'}
              className={identification.edibility.isEdible ? 'bg-green-50' : 'bg-red-50 border-red-200'}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name={identification.edibility.isEdible ? 'checkmark-circle' : 'warning'}
                  size={24}
                  color={identification.edibility.isEdible ? '#10B981' : '#EF4444'}
                />
                <Text
                  className={`ml-2 font-semibold ${
                    identification.edibility.isEdible ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {identification.edibility.isEdible ? 'Comestible' : 'Non comestible'}
                </Text>
              </View>
              
              {identification.edibility.warnings.length > 0 && (
                <View className="mt-2">
                  {identification.edibility.warnings.map((warning, index) => (
                    <Text key={index} className="text-sm text-gray-700 mt-1">
                      • {warning}
                    </Text>
                  ))}
                </View>
              )}
              
              {identification.edibility.preparationNotes && (
                <Text className="text-sm text-gray-700 mt-2">
                  {identification.edibility.preparationNotes}
                </Text>
              )}
            </Card>
          )}

          {/* Alternative Suggestions */}
          {identification.alternativeSuggestions.length > 0 && (
            <View className="mt-6">
              <Text className="text-lg font-semibold mb-3">Autres possibilités</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {allSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedSuggestionIndex(index)}
                    className={`mr-3 p-3 rounded-xl border ${
                      selectedSuggestionIndex === index
                        ? 'bg-primary-50 border-primary-500'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text className="font-medium">{suggestion.name}</Text>
                    <Text className="text-sm text-gray-600">
                      {Math.round(suggestion.confidence * 100)}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row mt-6 space-x-3">
            <View className="flex-1">
              <Button
                title="Autre espèce"
                onPress={onReject}
                variant="secondary"
                icon="close-circle"
              />
            </View>
            <View className="flex-1">
              <Button
                title="Confirmer"
                onPress={() => onConfirm(selectedMushroom.name)}
                variant="primary"
                icon="checkmark-circle"
              />
            </View>
          </View>

          {/* Disclaimer */}
          <View className="mt-6 p-4 bg-yellow-50 rounded-xl">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#F59E0B" />
              <Text className="flex-1 ml-2 text-sm text-gray-700">
                Cette identification est fournie à titre indicatif. En cas de doute,
                consultez un expert mycologue avant toute consommation.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </BottomSheet>
  );
}