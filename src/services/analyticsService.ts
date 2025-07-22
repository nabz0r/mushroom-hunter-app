import * as Analytics from 'expo-analytics-amplitude';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProperties {
  userId?: string;
  username?: string;
  level?: number;
  totalPoints?: number;
  mushroomsFound?: number;
  isPremium?: boolean;
}

interface EventProperties {
  [key: string]: any;
}

class AnalyticsService {
  private initialized = false;
  private userId: string | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  async initialize() {
    if (this.initialized) return;

    try {
      const apiKey = Constants.expoConfig?.extra?.amplitudeApiKey;
      if (!apiKey) {
        console.warn('Analytics API key not found');
        return;
      }

      await Analytics.initializeAsync(apiKey);
      this.initialized = true;

      // Set default properties
      await this.setDefaultProperties();

      // Track app open
      this.trackEvent('app_opened');
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  private async setDefaultProperties() {
    const deviceProperties = {
      platform: Platform.OS,
      platform_version: Platform.Version,
      app_version: Constants.expoConfig?.version,
      device_model: Constants.deviceName,
      session_id: this.sessionId,
    };

    await Analytics.setUserPropertiesAsync(deviceProperties);
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async setUserId(userId: string) {
    this.userId = userId;
    if (this.initialized) {
      await Analytics.setUserIdAsync(userId);
    }
  }

  async setUserProperties(properties: UserProperties) {
    if (!this.initialized) return;

    try {
      await Analytics.setUserPropertiesAsync(properties);
    } catch (error) {
      console.error('Failed to set user properties:', error);
    }
  }

  async trackEvent(eventName: string, properties?: EventProperties) {
    if (!this.initialized) return;

    try {
      const eventProperties = {
        ...properties,
        session_id: this.sessionId,
        timestamp: Date.now(),
      };

      await Analytics.logEventAsync(eventName, eventProperties);

      // Also log to console in development
      if (__DEV__) {
        console.log(`📊 Analytics Event: ${eventName}`, eventProperties);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  // Specific event tracking methods
  trackMushroomIdentified(mushroom: {
    id: string;
    name: string;
    rarity: string;
    points: number;
    confidence: number;
  }) {
    this.trackEvent('mushroom_identified', {
      mushroom_id: mushroom.id,
      mushroom_name: mushroom.name,
      rarity: mushroom.rarity,
      points_earned: mushroom.points,
      ai_confidence: mushroom.confidence,
    });
  }

  trackSpotCreated(spot: {
    mushroomId: string;
    isPublic: boolean;
    hasPhoto: boolean;
  }) {
    this.trackEvent('spot_created', {
      mushroom_id: spot.mushroomId,
      is_public: spot.isPublic,
      has_photo: spot.hasPhoto,
    });
  }

  trackQuestCompleted(quest: {
    id: string;
    type: string;
    reward: number;
  }) {
    this.trackEvent('quest_completed', {
      quest_id: quest.id,
      quest_type: quest.type,
      points_earned: quest.reward,
    });
  }

  trackScreenView(screenName: string, properties?: EventProperties) {
    this.trackEvent('screen_view', {
      screen_name: screenName,
      ...properties,
    });
  }

  trackUserAction(action: string, properties?: EventProperties) {
    this.trackEvent(`user_${action}`, properties);
  }

  trackError(error: string, properties?: EventProperties) {
    this.trackEvent('error_occurred', {
      error_message: error,
      ...properties,
    });
  }

  trackTiming(category: string, variable: string, time: number) {
    this.trackEvent('timing_complete', {
      timing_category: category,
      timing_variable: variable,
      timing_value: time,
    });
  }

  async trackRevenue(amount: number, productId: string, quantity: number = 1) {
    if (!this.initialized) return;

    try {
      await Analytics.logRevenueAsync(productId, quantity, amount);
    } catch (error) {
      console.error('Failed to track revenue:', error);
    }
  }

  startTimer(label: string): () => void {
    const startTime = Date.now();
    
    return () => {
      const duration = Date.now() - startTime;
      this.trackTiming('user_timing', label, duration);
    };
  }
}

export const analyticsService = new AnalyticsService();