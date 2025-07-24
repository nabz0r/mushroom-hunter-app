import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { sentryUtils } from '@/config/sentry';
import { analyticsService } from '@/services/analyticsService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log to Sentry
    sentryUtils.captureException(error, { errorInfo });
    
    // Log to analytics
    analyticsService.trackError(error.message, {
      stack: error.stack,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-1 items-center justify-center px-8">
            <View className="bg-red-100 p-6 rounded-full mb-6">
              <Ionicons name="warning" size={48} color="#DC2626" />
            </View>
            
            <Text className="text-2xl font-bold text-center mb-4 text-gray-900">
              Oups ! Une erreur est survenue
            </Text>
            
            <Text className="text-base text-center text-gray-600 mb-8 leading-6">
              Nous sommes désolés, quelque chose s'est mal passé. L'équipe a été notifiée et nous travaillons sur une solution.
            </Text>
            
            <TouchableOpacity
              onPress={() => {
                this.setState({ hasError: false, error: undefined });
              }}
              className="bg-primary-600 px-6 py-3 rounded-full mb-4"
            >
              <Text className="text-white font-semibold">Réessayer</Text>
            </TouchableOpacity>
            
            {__DEV__ && this.state.error && (
              <View className="mt-8 p-4 bg-gray-100 rounded-lg w-full">
                <Text className="text-sm font-mono text-red-600">
                  {this.state.error.message}
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}