import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';

import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { LoadingScreen } from './src/components/LoadingScreen';
import { AnimatedSplash } from './src/components/AnimatedSplash';
import { useAppInitialization } from './src/hooks/useAppInitialization';
import { initSentry } from './src/config/sentry';
import { analyticsService } from './src/services/analyticsService';
import './src/i18n'; // Initialize i18n

// Initialize error tracking and analytics
if (!__DEV__) {
  initSentry();
}

analyticsService.initialize();

export default function App() {
  const { isLoading, isAuthenticated, showSplash } = useAppInitialization();

  useEffect(() => {
    // Track app launch
    analyticsService.trackEvent('app_launched', {
      platform: Platform.OS,
      version: '1.0.0',
    });
  }, []);

  if (showSplash) {
    return (
      <AnimatedSplash
        onAnimationComplete={() => {
          // Splash completed, app will continue loading
        }}
      />
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="auto" backgroundColor="#2D5016" />
            <RootNavigator isAuthenticated={isAuthenticated} />
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}