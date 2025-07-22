import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/store';
import { MushroomSpot } from '@/store/slices/mushroomSlice';
import { locationService } from '@/services/locationService';

interface ARViewerProps {
  onClose: () => void;
  onSpotSelected: (spot: MushroomSpot) => void;
}

export function ARViewer({ onClose, onSpotSelected }: ARViewerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [heading, setHeading] = useState(0);
  const { spots } = useAppSelector(state => state.mushroom);
  const { currentLocation } = useAppSelector(state => state.location);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      // Start watching compass heading
      const headingSubscription = await Location.watchHeadingAsync((headingData) => {
        setHeading(headingData.trueHeading);
      });

      return () => {
        headingSubscription.remove();
      };
    })();
  }, []);

  const calculateARPosition = (spot: MushroomSpot) => {
    if (!currentLocation) return null;

    const distance = locationService.calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      spot.latitude,
      spot.longitude
    );

    const bearing = locationService.calculateBearing(
      currentLocation.latitude,
      currentLocation.longitude,
      spot.latitude,
      spot.longitude
    );

    // Calculate relative angle
    let relativeAngle = bearing - heading;
    if (relativeAngle < -180) relativeAngle += 360;
    if (relativeAngle > 180) relativeAngle -= 360;

    // Only show spots within 90 degrees field of view
    if (Math.abs(relativeAngle) > 45) return null;

    // Convert to screen position
    const screenX = (relativeAngle / 90 + 0.5) * 100; // Percentage
    const screenY = Math.min(distance / 100, 80); // Closer = lower on screen

    return {
      x: screenX,
      y: screenY,
      distance,
    };
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    Alert.alert(
      'Permission refusée',
      'L\'accès à la caméra est nécessaire pour le mode AR'
    );
    onClose();
    return null;
  }

  return (
    <View className="flex-1">
      <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back}>
        <View className="flex-1">
          {/* AR Overlay */}
          <View className="absolute inset-0">
            {spots.map((spot) => {
              const position = calculateARPosition(spot);
              if (!position) return null;

              return (
                <TouchableOpacity
                  key={spot.id}
                  onPress={() => onSpotSelected(spot)}
                  style={{
                    position: 'absolute',
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: [{ translateX: -50 }, { translateY: -50 }],
                  }}
                  className="items-center"
                >
                  <View className="bg-white/90 rounded-full p-3 shadow-lg">
                    <Text className="text-3xl">🍄</Text>
                  </View>
                  <View className="bg-black/70 rounded-full px-2 py-1 mt-1">
                    <Text className="text-white text-xs font-bold">
                      {Math.round(position.distance)}m
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Controls */}
          <View className="absolute top-16 left-4 right-4">
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={onClose}
                className="bg-black/50 p-3 rounded-full"
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              
              <View className="bg-black/50 rounded-full px-4 py-2">
                <Text className="text-white font-bold">
                  {spots.length} spots à proximité
                </Text>
              </View>
            </View>
          </View>

          {/* Compass */}
          <View className="absolute bottom-8 self-center bg-black/50 rounded-full p-4">
            <View
              style={{
                transform: [{ rotate: `${-heading}deg` }],
              }}
            >
              <Ionicons name="navigate" size={40} color="white" />
            </View>
            <Text className="text-white text-center mt-2 font-bold">
              {Math.round(heading)}°
            </Text>
          </View>
        </View>
      </Camera>
    </View>
  );
}