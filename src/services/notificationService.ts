import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  async registerForPushNotifications(): Promise<string | null> {
    let token = null;

    if (!Device.isDevice) {
      Alert.alert(
        'Notifications',
        'Les notifications push ne fonctionnent que sur un appareil physique'
      );
      return null;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Notifications désactivées',
          'Activez les notifications dans les paramètres pour recevoir des alertes'
        );
        return null;
      }

      // Get Expo push token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      token = tokenData.data;

      // Configure channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#16a34a',
        });
      }

      // Save token locally
      await AsyncStorage.setItem('@push_token', token);

      // Register token with backend
      await this.registerTokenWithBackend(token);

      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  },

  async registerTokenWithBackend(token: string): Promise<void> {
    try {
      await api.post('/notifications/register', {
        token,
        platform: Platform.OS,
        deviceId: Device.deviceName,
      });
    } catch (error) {
      console.error('Error registering token with backend:', error);
    }
  },

  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
        badge: 1,
      },
      trigger: trigger || null, // null = immediate
    });

    return notificationId;
  },

  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  },

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  },

  // Notification templates
  async notifyMushroomIdentified(
    mushroomName: string,
    points: number,
    imageUrl?: string
  ): Promise<void> {
    await this.scheduleLocalNotification(
      '🍄 Champignon identifié!',
      `${mushroomName} trouvé! Vous gagnez ${points} points`,
      {
        type: 'mushroom_identified',
        mushroomName,
        points,
        imageUrl,
      }
    );
  },

  async notifyQuestCompleted(questTitle: string, reward: number): Promise<void> {
    await this.scheduleLocalNotification(
      '🏆 Quête terminée!',
      `"${questTitle}" complétée! +${reward} points`,
      {
        type: 'quest_completed',
        questTitle,
        reward,
      }
    );
  },

  async notifyAchievementUnlocked(
    achievementTitle: string,
    description: string
  ): Promise<void> {
    await this.scheduleLocalNotification(
      '🎯 Achievement débloqué!',
      `${achievementTitle}: ${description}`,
      {
        type: 'achievement_unlocked',
        achievementTitle,
      }
    );
  },

  async notifyDailyReminder(): Promise<void> {
    const trigger = {
      hour: 9,
      minute: 0,
      repeats: true,
    };

    await this.scheduleLocalNotification(
      '🌅 C\'est l\'heure de chasser!',
      'Les conditions sont parfaites pour trouver des champignons aujourd\'hui',
      { type: 'daily_reminder' },
      trigger
    );
  },

  async notifyWeatherAlert(condition: string): Promise<void> {
    await this.scheduleLocalNotification(
      '🌧️ Alerte météo champignons',
      `${condition} - Conditions idéales dans 2-3 jours!`,
      { type: 'weather_alert', condition }
    );
  },

  setupNotificationListeners(
    onNotificationReceived: (notification: Notifications.Notification) => void,
    onNotificationResponse: (response: Notifications.NotificationResponse) => void
  ): {
    receivedSubscription: Notifications.Subscription;
    responseSubscription: Notifications.Subscription;
  } {
    // Handle notifications when app is in foreground
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      onNotificationReceived
    );

    // Handle notification taps
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      onNotificationResponse
    );

    return {
      receivedSubscription,
      responseSubscription,
    };
  },
};