import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const cameraRef = useRef<Camera>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
      identifyMushroom(photo.uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      identifyMushroom(result.assets[0].uri);
    }
  };

  const identifyMushroom = async (imageUri: string) => {
    setIsIdentifying(true);
    // TODO: Implement AI identification
    setTimeout(() => {
      setIsIdentifying(false);
      Alert.alert(
        'Champignon identifié!',
        'Cèpe de Bordeaux (Boletus edulis)\nComestible - Excellent\nRareté: Peu commun\nPoints: +85',
        [
          { text: 'Ajouter au spot', onPress: () => {} },
          { text: 'Nouvelle photo', onPress: () => setCapturedImage(null) },
        ]
      );
    }, 2000);
  };

  if (hasPermission === null) {
    return <View />;
  }
  
  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-forest-dark items-center justify-center">
        <Text className="text-white text-center px-8">
          L'accès à la caméra est nécessaire pour identifier les champignons
        </Text>
      </SafeAreaView>
    );
  }

  if (capturedImage) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <Image source={{ uri: capturedImage }} className="flex-1" resizeMode="contain" />
        
        {isIdentifying && (
          <View className="absolute inset-0 bg-black/50 items-center justify-center">
            <View className="bg-white p-6 rounded-2xl">
              <Text className="text-lg font-bold mb-2">Identification en cours...</Text>
              <Text className="text-gray-600">L'IA analyse votre photo</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={() => setCapturedImage(null)}
          className="absolute top-16 left-4 bg-white/20 p-3 rounded-full"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1">
      <Camera 
        ref={cameraRef}
        style={{ flex: 1 }} 
        type={CameraType.back}
      >
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="bg-black/30 px-4 py-2">
            <Text className="text-white text-center font-bold text-lg">
              Photographiez un champignon
            </Text>
            <Text className="text-white/80 text-center text-sm">
              Assurez-vous que le champignon soit bien visible
            </Text>
          </View>

          {/* Controls */}
          <View className="flex-1 justify-end pb-8">
            <View className="flex-row justify-around items-center px-8">
              <TouchableOpacity
                onPress={pickImage}
                className="bg-white/20 p-4 rounded-full"
              >
                <Ionicons name="images" size={30} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={takePicture}
                className="bg-white p-6 rounded-full"
              >
                <Ionicons name="camera" size={40} color="#16a34a" />
              </TouchableOpacity>

              <View className="p-4">
                <View className="w-[30px]" />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Camera>
    </View>
  );
}