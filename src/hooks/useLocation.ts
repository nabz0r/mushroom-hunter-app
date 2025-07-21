import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCurrentLocation, setPermission } from '@/store/slices/locationSlice';
import { locationService } from '@/services/locationService';

export function useLocation() {
  const dispatch = useAppDispatch();
  const { currentLocation, hasPermission } = useAppSelector(state => state.location);
  const [subscription, setSubscription] = useState<Location.LocationSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeLocation();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const initializeLocation = async () => {
    setIsLoading(true);
    try {
      const hasPermission = await locationService.requestPermissions();
      dispatch(setPermission(hasPermission));

      if (hasPermission) {
        const location = await locationService.getCurrentLocation();
        if (location) {
          dispatch(setCurrentLocation(location));
        }
      }
    } catch (err) {
      setError('Erreur lors de l\'initialisation de la localisation');
      console.error('Location initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startTracking = async () => {
    if (!hasPermission) {
      const granted = await locationService.requestPermissions();
      if (!granted) return;
    }

    const sub = await locationService.watchPosition((location) => {
      dispatch(setCurrentLocation(location));
    });

    if (sub) {
      setSubscription(sub);
    }
  };

  const stopTracking = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  const refreshLocation = async () => {
    setIsLoading(true);
    try {
      const location = await locationService.getCurrentLocation();
      if (location) {
        dispatch(setCurrentLocation(location));
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour de la position');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentLocation,
    hasPermission,
    isLoading,
    error,
    isTracking: subscription !== null,
    startTracking,
    stopTracking,
    refreshLocation,
  };
}