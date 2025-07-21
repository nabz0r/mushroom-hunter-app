import { useState, useRef } from 'react';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export function useCamera() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const cameraRef = useRef<Camera>(null);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
    
    const granted = cameraStatus === 'granted' && mediaStatus === 'granted';
    setHasPermission(granted);
    
    if (!granted) {
      Alert.alert(
        'Permissions requises',
        'L\'accès à la caméra et à la galerie est nécessaire pour cette fonctionnalité.'
      );
    }
    
    return granted;
  };

  const takePicture = async (): Promise<string | null> => {
    if (!cameraRef.current || !isReady) return null;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        base64: false,
        exif: true,
      });
      
      return photo.uri;
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Erreur', 'Impossible de prendre la photo.');
      return null;
    }
  };

  const pickImageFromGallery = async (): Promise<string | null> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      
      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image.');
      return null;
    }
  };

  const toggleCameraType = () => {
    setCameraType(current => 
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  return {
    hasPermission,
    isReady,
    cameraType,
    cameraRef,
    requestPermissions,
    takePicture,
    pickImageFromGallery,
    toggleCameraType,
    setIsReady,
  };
}