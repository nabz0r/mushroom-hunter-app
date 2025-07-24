import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, Dimensions, Animated } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { useMushroomIdentification } from '@/hooks/useMushroomIdentification';
import { useGameProgress } from '@/hooks/useGameProgress';
import { MushroomIdentificationModal } from '@/components/MushroomIdentificationModal';
import { PermissionRequest } from '@/components/PermissionRequest';
import { EmptyState } from '@/components/EmptyState';
import { useCamera } from '@/hooks/useCamera';
import { analyticsService } from '@/services/analyticsService';

const { width } = Dimensions.get('window');

export function CameraScreen() {
  const {
    hasPermission,
    isReady,
    cameraType,
    cameraRef,
    requestPermissions,
    takePicture,
    pickImageFromGallery,
    toggleCameraType,
    setIsReady,
  } = useCamera();
  
  const {
    isIdentifying,
    identification,
    identifyMushroom,
    confirmIdentification,
    resetIdentification,
  } = useMushroomIdentification({
    onSuccess: (result) => {
      setShowIdentificationModal(true);
      analyticsService.trackEvent('mushroom_identified_success', {
        confidence: result.mushroom.confidence,
        hasAlternatives: result.alternativeSuggestions.length > 0,
      });
    },
    onError: (error) => {
      analyticsService.trackEvent('mushroom_identification_failed', {
        error,
      });
    },
  });
  
  const { trackMushroomFound } = useGameProgress();
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showIdentificationModal, setShowIdentificationModal] = useState(false);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.auto);
  const [isFlashOn, setIsFlashOn] = useState(false);
  
  const flashAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (hasPermission === null) {
      requestPermissions();
    }
  }, [hasPermission]);

  const handleTakePicture = async () => {
    // Flash animation
    setIsFlashOn(true);
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => setIsFlashOn(false));

    // Scale animation for camera button
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const imageUri = await takePicture();
    if (imageUri) {
      setCapturedImage(imageUri);
      identifyMushroom(imageUri);
      
      analyticsService.trackEvent('photo_taken', {
        source: 'camera',
        hasFlash: flashMode !== Camera.Constants.FlashMode.off,
      });
    }
  };

  const handlePickImage = async () => {
    const imageUri = await pickImageFromGallery();
    if (imageUri) {
      setCapturedImage(imageUri);
      identifyMushroom(imageUri);
      
      analyticsService.trackEvent('photo_taken', {
        source: 'gallery',
      });
    }
  };

  const handleConfirmIdentification = async (mushroomId: string) => {
    if (capturedImage) {
      await confirmIdentification(mushroomId, capturedImage);
      trackMushroomFound(mushroomId, 'common'); // Would get actual rarity from API
      
      // Reset state
      setCapturedImage(null);
      resetIdentification();
      setShowIdentificationModal(false);
    }
  };

  const handleRetakePhoto = () => {
    setCapturedImage(null);
    resetIdentification();
    setShowIdentificationModal(false);
  };

  const toggleFlash = () => {
    const modes = [
      Camera.Constants.FlashMode.off,
      Camera.Constants.FlashMode.on,
      Camera.Constants.FlashMode.auto,
    ];
    const currentIndex = modes.indexOf(flashMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setFlashMode(nextMode);
  };

  const getFlashIcon = () => {
    switch (flashMode) {
      case Camera.Constants.FlashMode.off:
        return 'flash-off';
      case Camera.Constants.FlashMode.on:
        return 'flash';
      case Camera.Constants.FlashMode.auto:
        return 'flash-outline';
      default:
        return 'flash-outline';
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <EmptyState
          emoji="📸"
          title="Initialisation de la caméra..."
          description="Veuillez patienter"
        />
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <PermissionRequest
          icon="camera"
          title="Accès à la caméra requis"
          description="Mushroom Hunter a besoin d'accéder à votre caméra pour identifier les champignons. Cette fonctionnalité est essentielle pour l'expérience de l'application."
          onGrant={requestPermissions}
          required
        />
      </SafeAreaView>
    );
  }

  if (capturedImage && !isIdentifying) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1">
          <Image source={{ uri: capturedImage }} className="flex-1" resizeMode="contain" />
          
          {/* Photo review controls */}
          <View className="absolute bottom-0 left-0 right-0">
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              className="p-6"
            >
              <View className="flex-row justify-around items-center">
                <TouchableOpacity
                  onPress={handleRetakePhoto}
                  className="flex-1 bg-white/20 mx-2 py-4 rounded-full"
                >
                  <Text className="text-white text-center font-semibold">
                    Reprendre
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => identifyMushroom(capturedImage)}
                  className="flex-1 bg-primary-600 mx-2 py-4 rounded-full"
                  disabled={isIdentifying}
                >
                  <Text className="text-white text-center font-semibold">
                    {isIdentifying ? 'Identification...' : 'Identifier'}
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        type={cameraType}
        flashMode={flashMode}
        onCameraReady={() => setIsReady(true)}
      >
        <SafeAreaView className="flex-1">
          {/* Flash overlay */}
          {isFlashOn && (
            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'white',
                opacity: flashAnim,
                zIndex: 1000,
              }}
            />
          )}
          
          {/* Header */}
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent']}
            className="px-4 pt-4 pb-8"
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-white text-lg font-bold">
                Photographiez un champignon
              </Text>
              
              <View className="flex-row">
                <TouchableOpacity
                  onPress={toggleFlash}
                  className="bg-black/30 p-2 rounded-full mr-2"
                >
                  <Ionicons name={getFlashIcon() as any} size={24} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={toggleCameraType}
                  className="bg-black/30 p-2 rounded-full"
                >
                  <Ionicons name="camera-reverse" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            
            <Text className="text-white/80 text-sm mt-2">
              Centrez le champignon et assurez-vous qu'il soit bien éclairé
            </Text>
          </LinearGradient>

          {/* Camera guide overlay */}
          <View className="flex-1 items-center justify-center">
            <View 
              className="border-2 border-white/50 rounded-2xl"
              style={{
                width: width * 0.8,
                height: width * 0.8,
                borderStyle: 'dashed',
              }}
            >
              <View className="flex-1 items-center justify-center">
                <Ionicons name="camera-outline" size={48} color="rgba(255,255,255,0.5)" />
                <Text className="text-white/50 text-center mt-2">
                  Placez le champignon ici
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom controls */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            className="pb-8 pt-8"
          >
            <View className="flex-row justify-around items-center px-8">
              <TouchableOpacity
                onPress={handlePickImage}
                className="bg-white/20 p-4 rounded-full"
              >
                <Ionicons name="images" size={30} color="white" />
              </TouchableOpacity>

              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  onPress={handleTakePicture}
                  className="bg-white p-2 rounded-full"
                  disabled={!isReady}
                >
                  <View className="bg-transparent border-4 border-gray-300 p-6 rounded-full">
                    <Ionicons name="camera" size={32} color="#16a34a" />
                  </View>
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity
                onPress={() => {
                  // Navigate to help/guide
                }}
                className="bg-white/20 p-4 rounded-full"
              >
                <Ionicons name="help-circle" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </SafeAreaView>
      </Camera>

      {/* Identification Modal */}
      <MushroomIdentificationModal
        isVisible={showIdentificationModal}
        onClose={() => setShowIdentificationModal(false)}
        identification={identification}
        imageUri={capturedImage || ''}
        onConfirm={handleConfirmIdentification}
        onReject={handleRetakePhoto}
      />
    </View>
  );
}