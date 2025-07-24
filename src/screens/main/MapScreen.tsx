import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import MapView, { Marker, Circle, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

import { useAppSelector, useAppDispatch } from '@/store';
import { setSpots } from '@/store/slices/mushroomSlice';
import { SpotMarker } from '@/components/SpotMarker';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { SearchBar } from '@/components/ui/SearchBar';
import { useLocation } from '@/hooks/useLocation';
import { analyticsService } from '@/services/analyticsService';
import { mockSpots, mockMushrooms } from '@/data/mockData';
import { formatDistance } from '@/utils/helpers';

const { width, height } = Dimensions.get('window');

interface MapFilters {
  edibleOnly: boolean;
  publicOnly: boolean;
  verifiedOnly: boolean;
  maxDistance: number;
}

export function MapScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { spots } = useAppSelector(state => state.mushroom);
  const { currentLocation, hasPermission } = useAppSelector(state => state.location);
  const { refreshLocation } = useLocation();
  
  const mapRef = useRef<MapView>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: currentLocation?.latitude || 48.8566,
    longitude: currentLocation?.longitude || 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  const [selectedSpot, setSelectedSpot] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSpotDetails, setShowSpotDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [filters, setFilters] = useState<MapFilters>({
    edibleOnly: false,
    publicOnly: true,
    verifiedOnly: false,
    maxDistance: 10000, // 10km
  });

  useEffect(() => {
    loadNearbySpots();
    analyticsService.trackScreenView('map');
  }, [currentLocation]);

  useEffect(() => {
    if (currentLocation && mapRef.current) {
      setMapRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [currentLocation]);

  const loadNearbySpots = async () => {
    try {
      // In a real app, this would call the API
      // const nearbySpots = await mushroomService.getNearbySpots(
      //   currentLocation.latitude,
      //   currentLocation.longitude,
      //   filters.maxDistance
      // );
      dispatch(setSpots(mockSpots));
    } catch (error) {
      console.error('Failed to load nearby spots:', error);
    }
  };

  const filteredSpots = spots.filter(spot => {
    if (!spot.publicSpot && filters.publicOnly) return false;
    if (filters.verifiedOnly && !spot.verified) return false;
    if (filters.edibleOnly) {
      const mushroom = mockMushrooms.find(m => m.id === spot.mushroomId);
      if (!mushroom?.edible) return false;
    }
    
    // Distance filter
    if (currentLocation) {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        spot.latitude,
        spot.longitude
      );
      if (distance > filters.maxDistance) return false;
    }
    
    // Search filter
    if (searchQuery) {
      const mushroom = mockMushrooms.find(m => m.id === spot.mushroomId);
      const searchLower = searchQuery.toLowerCase();
      if (!mushroom?.name.toLowerCase().includes(searchLower) &&
          !spot.notes.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    
    return true;
  });

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handleCenterOnUser = async () => {
    if (!hasPermission) {
      Alert.alert(
        'Permission requise',
        'Veuillez activer la localisation pour centrer la carte.'
      );
      return;
    }

    await refreshLocation();
    setIsFollowingUser(true);
    
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      
      analyticsService.trackUserAction('center_map_on_user');
    }
  };

  const handleSpotPress = (spot: any) => {
    const mushroom = mockMushrooms.find(m => m.id === spot.mushroomId);
    setSelectedSpot({ ...spot, mushroom });
    setShowSpotDetails(true);
    
    analyticsService.trackUserAction('spot_selected', {
      spotId: spot.id,
      mushroomType: mushroom?.name,
    });
  };

  const handleAddSpot = () => {
    if (!currentLocation) {
      Alert.alert(
        'Localisation requise',
        'Veuillez activer la localisation pour ajouter un spot.'
      );
      return;
    }
    
    navigation.navigate('Camera');
    analyticsService.trackUserAction('add_spot_from_map');
  };

  const handleNavigateToSpot = (spot: any) => {
    const scheme = Platform.select({ ios: 'maps:', android: 'geo:' });
    const url = Platform.select({
      ios: `${scheme}${spot.latitude},${spot.longitude}?q=${spot.mushroom?.name}`,
      android: `${scheme}${spot.latitude},${spot.longitude}?q=${spot.latitude},${spot.longitude}(${spot.mushroom?.name})`,
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application de navigation.');
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Search Bar */}
      <View className="px-4 py-2 bg-white border-b border-gray-200">
        <SearchBar
          placeholder="Rechercher des champignons ou lieux..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={(query) => {
            analyticsService.trackUserAction('search_spots', { query });
          }}
        />
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={mapRegion}
        onRegionChangeComplete={(region) => {
          setMapRegion(region);
          setIsFollowingUser(false);
        }}
        showsUserLocation={hasPermission}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        mapType="standard"
      >
        {/* User location circle */}
        {currentLocation && (
          <Circle
            center={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            radius={filters.maxDistance}
            fillColor="rgba(34, 197, 94, 0.1)"
            strokeColor="rgba(34, 197, 94, 0.3)"
            strokeWidth={2}
          />
        )}

        {/* Mushroom spots */}
        {filteredSpots.map((spot) => {
          const mushroom = mockMushrooms.find(m => m.id === spot.mushroomId);
          if (!mushroom) return null;

          return (
            <Marker
              key={spot.id}
              coordinate={{
                latitude: spot.latitude,
                longitude: spot.longitude,
              }}
              onPress={() => handleSpotPress(spot)}
            >
              <View className="items-center">
                <View 
                  className="p-3 rounded-full shadow-lg"
                  style={{ 
                    backgroundColor: mushroom.edible ? '#10B981' : '#EF4444' 
                  }}
                >
                  <Text className="text-2xl">🍄</Text>
                  {spot.verified && (
                    <View className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                      <Ionicons name="checkmark" size={12} color="white" />
                    </View>
                  )}
                </View>
                <View className="bg-white px-2 py-1 rounded-full mt-1 shadow-sm">
                  <Text className="text-xs font-semibold">{mushroom.name}</Text>
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Controls */}
      <View className="absolute top-20 right-4">
        <View className="space-y-2">
          <FloatingActionButton
            icon="filter"
            onPress={() => setShowFilters(true)}
            size="small"
            backgroundColor="white"
            color="#374151"
          />
          <FloatingActionButton
            icon="locate"
            onPress={handleCenterOnUser}
            size="small"
            backgroundColor={isFollowingUser ? '#16a34a' : 'white'}
            color={isFollowingUser ? 'white' : '#374151'}
          />
        </View>
      </View>

      {/* Add Spot Button */}
      <View className="absolute bottom-6 right-4">
        <FloatingActionButton
          icon="add"
          onPress={handleAddSpot}
          size="large"
        />
      </View>

      {/* Stats Bar */}
      <View className="absolute bottom-6 left-4 right-20">
        <Card className="bg-white/95 backdrop-blur p-3">
          <View className="flex-row justify-between items-center">
            <View className="items-center">
              <Text className="text-sm font-bold">{filteredSpots.length}</Text>
              <Text className="text-xs text-gray-600">Spots</Text>
            </View>
            <View className="items-center">
              <Text className="text-sm font-bold">
                {filteredSpots.filter(s => s.verified).length}
              </Text>
              <Text className="text-xs text-gray-600">Vérifiés</Text>
            </View>
            <View className="items-center">
              <Text className="text-sm font-bold">
                {filteredSpots.filter(s => {
                  const mushroom = mockMushrooms.find(m => m.id === s.mushroomId);
                  return mushroom?.edible;
                }).length}
              </Text>
              <Text className="text-xs text-gray-600">Comestibles</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Filters Bottom Sheet */}
      <BottomSheet
        isVisible={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtres de la carte"
        height={400}
      >
        <View className="p-4">
          {/* Filter options would go here */}
          <Text className="text-center text-gray-600">
            Options de filtrage à implémenter
          </Text>
        </View>
      </BottomSheet>

      {/* Spot Details Bottom Sheet */}
      <BottomSheet
        isVisible={showSpotDetails}
        onClose={() => setShowSpotDetails(false)}
        title="Détails du spot"
        height={500}
      >
        {selectedSpot && (
          <View className="p-4">
            <View className="items-center mb-6">
              <Text className="text-4xl mb-2">🍄</Text>
              <Text className="text-2xl font-bold">{selectedSpot.mushroom?.name}</Text>
              <Text className="text-gray-600 italic">{selectedSpot.mushroom?.scientificName}</Text>
            </View>

            <View className="space-y-4">
              <View className="flex-row items-center">
                <Ionicons name="location" size={20} color="#6B7280" />
                <Text className="ml-2 text-gray-700">
                  {currentLocation ? formatDistance(
                    calculateDistance(
                      currentLocation.latitude,
                      currentLocation.longitude,
                      selectedSpot.latitude,
                      selectedSpot.longitude
                    )
                  ) : 'Distance inconnue'}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="calendar" size={20} color="#6B7280" />
                <Text className="ml-2 text-gray-700">
                  Trouvé le {new Date(selectedSpot.dateFound).toLocaleDateString()}
                </Text>
              </View>

              {selectedSpot.notes && (
                <View>
                  <Text className="font-semibold mb-2">Notes :</Text>
                  <Text className="text-gray-700">{selectedSpot.notes}</Text>
                </View>
              )}

              <View className="flex-row space-x-3 mt-6">
                <Button
                  title="Naviguer"
                  onPress={() => handleNavigateToSpot(selectedSpot)}
                  icon="navigate"
                  variant="primary"
                  fullWidth={false}
                  style={{ flex: 1 }}
                />
                <Button
                  title="Partager"
                  onPress={() => {
                    // Share spot
                  }}
                  icon="share"
                  variant="secondary"
                  fullWidth={false}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </View>
        )}
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

import { Platform, Linking } from 'react-native';