import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { notificationService } from '@/services/notificationService';
import { useAppDispatch } from '@/store';

export function useNotifications() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Register for push notifications
    notificationService.registerForPushNotifications();

    // Handle notifications when app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        
        // Handle different notification types
        const { type, ...data } = notification.request.content.data || {};
        
        switch (type) {
          case 'mushroom_identified':
            // Update UI or show custom alert
            break;
          case 'quest_completed':
            // Refresh quests
            break;
          case 'achievement_unlocked':
            // Show achievement popup
            break;
          case 'weather_alert':
            // Update weather widget
            break;
        }
      }
    );

    // Handle notification taps
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification tapped:', response);
        
        const { type, ...data } = response.notification.request.content.data || {};
        
        // Navigate based on notification type
        switch (type) {
          case 'mushroom_identified':
            navigation.navigate('Profile' as never);
            break;
          case 'quest_completed':
            navigation.navigate('Profile' as never);
            // Could navigate to a specific quest screen
            break;
          case 'achievement_unlocked':
            navigation.navigate('Profile' as never);
            // Could show achievements tab
            break;
          case 'spot_nearby':
            navigation.navigate('Map' as never);
            break;
          case 'new_follower':
            navigation.navigate('Community' as never);
            break;
        }
      }
    );

    // Check if app was opened from notification
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        // Handle initial notification
        console.log('App opened from notification:', response);
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [navigation, dispatch]);

  return {
    scheduleNotification: notificationService.scheduleLocalNotification,
    cancelNotification: notificationService.cancelNotification,
    setBadgeCount: notificationService.setBadgeCount,
  };
}