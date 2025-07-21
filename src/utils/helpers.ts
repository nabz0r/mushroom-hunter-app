import { Alert, Linking } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - d.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'À l\'instant';
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  if (diffInDays < 7) return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

export const getRarityColor = (rarity: string): string => {
  const colors = {
    common: '#6B7280',
    uncommon: '#10B981',
    rare: '#3B82F6',
    very_rare: '#8B5CF6',
    legendary: '#F59E0B',
  };
  return colors[rarity as keyof typeof colors] || '#6B7280';
};

export const saveImageToGallery = async (imageUri: string): Promise<boolean> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'L\'accès à la galerie est nécessaire pour sauvegarder les photos.'
      );
      return false;
    }

    const asset = await MediaLibrary.createAssetAsync(imageUri);
    await MediaLibrary.createAlbumAsync('Mushroom Hunter', asset, false);
    
    Alert.alert('Succès', 'Photo sauvegardée dans la galerie!');
    return true;
  } catch (error) {
    console.error('Error saving image:', error);
    Alert.alert('Erreur', 'Impossible de sauvegarder la photo.');
    return false;
  }
};

export const openMaps = (latitude: number, longitude: number, label: string = 'Spot') => {
  const scheme = Platform.select({
    ios: 'maps:',
    android: 'geo:',
  });
  
  const url = Platform.select({
    ios: `${scheme}${latitude},${longitude}?q=${label}`,
    android: `${scheme}${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
  });

  if (url) {
    Linking.openURL(url).catch(() => {
      Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application de cartes.');
    });
  }
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getCurrentSeason = (): 'spring' | 'summer' | 'autumn' | 'winter' => {
  const month = new Date().getMonth() + 1;
  
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};

export const isMushroomInSeason = (seasons: string[]): boolean => {
  const currentSeason = getCurrentSeason();
  return seasons.includes(currentSeason);
};

import { Platform } from 'react-native';