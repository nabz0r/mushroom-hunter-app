import { useState } from 'react';
import { Alert } from 'react-native';
import { aiService } from '@/services/aiService';
import { mushroomService } from '@/services/mushroomService';
import { useAppDispatch, useAppSelector } from '@/store';
import { addSpot } from '@/store/slices/mushroomSlice';
import { updateUserPoints } from '@/store/slices/authSlice';
import { analyticsService } from '@/services/analyticsService';
import { MushroomIdentification } from '@/types';

interface UseMushroomIdentificationOptions {
  onSuccess?: (identification: MushroomIdentification) => void;
  onError?: (error: string) => void;
}

export function useMushroomIdentification(options: UseMushroomIdentificationOptions = {}) {
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identification, setIdentification] = useState<MushroomIdentification | null>(null);
  const dispatch = useAppDispatch();
  const { currentLocation } = useAppSelector(state => state.location);
  const { user } = useAppSelector(state => state.auth);

  const identifyMushroom = async (imageUri: string) => {
    if (!imageUri) {
      options.onError?.('Image requise pour l\'identification');
      return;
    }

    setIsIdentifying(true);
    
    try {
      // Preprocess image
      const base64Image = await aiService.preprocessImage(imageUri);
      
      // Call identification API
      const result = await mushroomService.identifyMushroom({
        image: base64Image,
        location: currentLocation ? {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        } : undefined,
      });

      setIdentification(result);
      
      // Track identification event
      analyticsService.trackMushroomIdentified({
        id: result.id,
        name: result.mushroom.name,
        rarity: 'common', // Would come from result
        points: 0, // Would be calculated
        confidence: result.mushroom.confidence,
      });

      options.onSuccess?.(result);
      
    } catch (error) {
      console.error('Identification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'identification';
      
      Alert.alert(
        'Erreur d\'identification',
        'Impossible d\'identifier le champignon. Veuillez réessayer avec une photo plus claire.',
        [{ text: 'OK' }]
      );
      
      options.onError?.(errorMessage);
    } finally {
      setIsIdentifying(false);
    }
  };

  const confirmIdentification = async (mushroomId: string, imageUri: string) => {
    if (!currentLocation) {
      Alert.alert(
        'Localisation requise',
        'Veuillez activer la localisation pour enregistrer ce spot.'
      );
      return;
    }

    try {
      // Create spot
      const spotData = {
        mushroomId,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        photos: [imageUri],
        notes: `Identifié le ${new Date().toLocaleDateString()}`,
        publicSpot: true,
      };

      const newSpot = await mushroomService.createSpot(spotData);
      dispatch(addSpot(newSpot));
      
      // Award points (this would normally come from the API)
      const points = calculatePoints();
      dispatch(updateUserPoints(points));
      
      // Track spot creation
      analyticsService.trackSpotCreated({
        mushroomId,
        isPublic: true,
        hasPhoto: true,
      });

      Alert.alert(
        'Félicitations !',
        `Champignon ajouté avec succès ! +${points} points`,
        [{ text: 'Super !' }]
      );
      
    } catch (error) {
      console.error('Error creating spot:', error);
      Alert.alert(
        'Erreur',
        'Impossible d\'enregistrer le spot. Veuillez réessayer.'
      );
    }
  };

  const calculatePoints = (): number => {
    // This would be calculated based on rarity, conditions, etc.
    return Math.floor(Math.random() * 100) + 10;
  };

  const resetIdentification = () => {
    setIdentification(null);
  };

  return {
    isIdentifying,
    identification,
    identifyMushroom,
    confirmIdentification,
    resetIdentification,
  };
}