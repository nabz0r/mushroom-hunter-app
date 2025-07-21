import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useAppDispatch } from '@/store';
import { loginSuccess } from '@/store/slices/authSlice';
import { setPermission } from '@/store/slices/locationSlice';

export function useAppInitialization() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check authentication
      const userData = await AsyncStorage.getItem('@user_data');
      if (userData) {
        const user = JSON.parse(userData);
        dispatch(loginSuccess(user));
        setIsAuthenticated(true);
      }

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      dispatch(setPermission(status === 'granted'));

      // Load other app data
      // await loadMushroomDatabase();
      // await loadUserSettings();

    } catch (error) {
      console.error('App initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, isAuthenticated };
}