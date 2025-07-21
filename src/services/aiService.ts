import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import api from './api';

interface AIIdentificationResult {
  predictions: Array<{
    species: string;
    scientificName: string;
    confidence: number;
    edible: boolean;
    warnings: string[];
  }>;
  metadata: {
    processingTime: number;
    modelVersion: string;
  };
}

export const aiService = {
  async preprocessImage(imageUri: string): Promise<string> {
    // Resize and compress image for faster processing
    const manipulatedImage = await manipulateAsync(
      imageUri,
      [
        { resize: { width: 800 } }, // Max width 800px
      ],
      { compress: 0.8, format: SaveFormat.JPEG }
    );

    // Convert to base64
    const base64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return base64;
  },

  async identifyMushroom(imageBase64: string): Promise<AIIdentificationResult> {
    try {
      const response = await api.post<AIIdentificationResult>('/ai/identify', {
        image: imageBase64,
        model: 'mushroom-classifier-v2',
        includeMetadata: true,
      });

      return response.data;
    } catch (error) {
      console.error('AI identification error:', error);
      throw new Error('Failed to identify mushroom');
    }
  },

  async validateIdentification(
    imageBase64: string,
    userSuggestion: string
  ): Promise<boolean> {
    try {
      const response = await api.post<{ isCorrect: boolean; confidence: number }>(
        '/ai/validate',
        {
          image: imageBase64,
          suggestion: userSuggestion,
        }
      );

      return response.data.isCorrect;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  },

  async getSimilarSpecies(speciesId: string): Promise<string[]> {
    try {
      const response = await api.get<string[]>(`/ai/similar/${speciesId}`);
      return response.data;
    } catch (error) {
      console.error('Get similar species error:', error);
      return [];
    }
  },
};