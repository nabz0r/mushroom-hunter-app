import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store } from '@/store';
import RootNavigator from '@/navigation/RootNavigator';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useAppInitialization } from '@/hooks/useAppInitialization';

export default function App() {
  const { isLoading, isAuthenticated } = useAppInitialization();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <RootNavigator isAuthenticated={isAuthenticated} />
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}