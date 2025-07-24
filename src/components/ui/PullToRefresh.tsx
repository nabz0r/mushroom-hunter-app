import React, { useRef, useState } from 'react';
import { 
  View, 
  ScrollView, 
  Animated, 
  PanGestureHandler,
  State as GestureState 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LoadingSpinner } from './LoadingSpinner';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  refreshing?: boolean;
  threshold?: number;
}

export function PullToRefresh({
  onRefresh,
  children,
  refreshing = false,
  threshold = 80,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = async (event: any) => {
    const { state, translationY } = event.nativeEvent;
    
    if (state === GestureState.END) {
      if (translationY > threshold && !isRefreshing) {
        // Trigger refresh
        setIsRefreshing(true);
        
        // Animate to loading position
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: threshold,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start();
        
        try {
          await onRefresh();
        } finally {
          // Reset to original position
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
          ]).start(() => {
            setIsRefreshing(false);
          });
        }
      } else {
        // Reset to original position
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start();
      }
    } else if (state === GestureState.ACTIVE) {
      // Update opacity based on pull distance
      const opacityValue = Math.min(translationY / threshold, 1);
      opacity.setValue(opacityValue);
      
      // Rotate icon based on pull distance
      const rotateValue = (translationY / threshold) * 180;
      rotate.setValue(rotateValue);
    }
  };

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View className="flex-1">
      {/* Pull to refresh indicator */}
      <Animated.View
        className="absolute top-0 left-0 right-0 z-10 items-center justify-center"
        style={{
          height: threshold,
          opacity,
          transform: [{ translateY: Animated.subtract(translateY, threshold) }],
        }}
      >
        <View className="bg-white rounded-full p-3 shadow-lg">
          {isRefreshing ? (
            <LoadingSpinner size={24} />
          ) : (
            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
              <Ionicons name="arrow-down" size={24} color="#16a34a" />
            </Animated.View>
          )}
        </View>
      </Animated.View>

      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        enabled={!isRefreshing}
      >
        <Animated.View
          className="flex-1"
          style={{
            transform: [{ translateY: Animated.diffClamp(translateY, 0, threshold) }],
          }}
        >
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}