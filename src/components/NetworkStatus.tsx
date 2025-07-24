import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const slideAnim = new Animated.Value(-50);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable;
      setIsOnline(online);
      setShowBanner(!online);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (showBanner) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: -50,
        useNativeDriver: true,
      }).start();
    }
  }, [showBanner]);

  if (!showBanner) return null;

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
      className="bg-red-500 px-4 py-3 flex-row items-center"
    >
      <Ionicons name="cloud-offline" size={20} color="white" />
      <Text className="text-white font-medium ml-2 flex-1">
        Aucune connexion internet
      </Text>
    </Animated.View>
  );
}