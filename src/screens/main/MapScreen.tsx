import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/store';

export function MapScreen() {
  const { currentLocation } = useAppSelector(state => state.location);
  const { spots } = useAppSelector(state => state.mushroom);
  
  const [mapRegion, setMapRegion] = useState({
    latitude: currentLocation?.latitude || 48.8566,
    longitude: currentLocation?.longitude || 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleCenterOnUser = () => {
    if (currentLocation) {
      setMapRegion({
        ...mapRegion,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {/* User location circle */}
        {currentLocation && (
          <Circle
            center={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            radius={100}
            fillColor="rgba(34, 197, 94, 0.2)"
            strokeColor="rgba(34, 197, 94, 0.5)"
          />
        )}

        {/* Mushroom spots */}
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{
              latitude: spot.latitude,
              longitude: spot.longitude,
            }}
            title="Spot de champignons"
            description={spot.notes}
          >
            <View className="bg-white p-2 rounded-full shadow-lg">
              <Text className="text-2xl">🍄</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Map controls */}
      <View className="absolute top-16 right-4">
        <TouchableOpacity
          onPress={handleCenterOnUser}
          className="bg-white p-3 rounded-full shadow-lg mb-4"
        >
          <Ionicons name="locate" size={24} color="#16a34a" />
        </TouchableOpacity>
      </View>

      {/* Info bar */}
      <View className="absolute bottom-8 left-4 right-4 bg-white rounded-2xl p-4 shadow-lg">
        <Text className="font-bold text-lg mb-2">Zone actuelle</Text>
        <Text className="text-gray-600">{spots.length} spots à proximité</Text>
        <TouchableOpacity className="bg-primary-600 mt-3 py-2 px-4 rounded-full">
          <Text className="text-white text-center font-semibold">Explorer les environs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});