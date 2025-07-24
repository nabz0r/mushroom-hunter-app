import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useAppDispatch } from '@/store';
import { loginSuccess } from '@/store/slices/authSlice';
import { setPermission } from '@/store/slices/locationSlice';
import { analyticsService } from '@/services/analyticsService';
import { sentryUtils } from '@/config/sentry';

export function useAppInitialization() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Show splash for minimum time
      setTimeout(() => setShowSplash(false), 2500);

      // Check authentication
      const [userData, authToken] = await Promise.all([
        AsyncStorage.getItem('@user_data'),
        AsyncStorage.getItem('@auth_token'),
      ]);

      if (userData && authToken) {
        const user = JSON.parse(userData);
        dispatch(loginSuccess(user));
        setIsAuthenticated(true);
        
        // Set user for analytics and error tracking
        analyticsService.setUserId(user.id);
        analyticsService.setUserProperties({
          userId: user.id,
          username: user.username,
          level: user.level,
          totalPoints: user.points,
        });
        
        sentryUtils.setUser(user);
      }

      // Request location permissions
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        dispatch(setPermission(status === 'granted'));
      } catch (locationError) {
        console.warn('Location permission error:', locationError);
        dispatch(setPermission(false));
      }

      // Load user preferences
      await loadUserPreferences();

      // Initialize analytics
      analyticsService.trackEvent('app_initialization_complete');

    } catch (error) {
      console.error('App initialization error:', error);
      sentryUtils.captureException(error as Error, {
        context: 'app_initialization',
      });
    } finally {
      // Ensure minimum loading time for UX
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const loadUserPreferences = async () => {
    try {
      const preferences = await AsyncStorage.getItem('@user_preferences');
      if (preferences) {
        const prefs = JSON.parse(preferences);
        // Apply user preferences (theme, language, etc.)
        // This would be handled by respective services
      }
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
    }
  };

  return { 
    isLoading, 
    isAuthenticated, 
    showSplash,
    isInitialized: !isLoading && !showSplash 
  };
}