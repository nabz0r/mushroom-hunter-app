import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashProps {
  onAnimationComplete: () => void;
}

export function AnimatedSplash({ onAnimationComplete }: AnimatedSplashProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const mushroomRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Mushroom rotation
    Animated.loop(
      Animated.sequence([
        Animated.timing(mushroomRotate, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(mushroomRotate, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Exit animation after delay
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onAnimationComplete();
      });
    }, 3000);
  }, []);

  const spin = mushroomRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: '#2D5016',
        opacity: fadeAnim,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={{
          transform: [
            { scale: scaleAnim },
            { rotate: spin },
          ],
        }}
      >
        <Text style={{ fontSize: 120 }}>🍄</Text>
      </Animated.View>

      <Animated.View
        style={{
          marginTop: 40,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Text className="text-white text-4xl font-bold mb-2">
          Mushroom Hunter
        </Text>
        <Text className="text-forest-light text-center text-lg">
          Chassez, Identifiez, Gagnez!
        </Text>
      </Animated.View>

      {/* Loading dots animation */}
      <View className="flex-row mt-8">
        {[0, 1, 2].map((index) => (
          <Animated.View
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#6B8E23',
              marginHorizontal: 4,
              opacity: fadeAnim,
              transform: [
                {
                  translateY: Animated.sequence([
                    Animated.delay(index * 200),
                    Animated.loop(
                      Animated.sequence([
                        Animated.timing(new Animated.Value(0), {
                          toValue: -10,
                          duration: 300,
                          useNativeDriver: true,
                        }),
                        Animated.timing(new Animated.Value(-10), {
                          toValue: 0,
                          duration: 300,
                          useNativeDriver: true,
                        }),
                      ])
                    ),
                  ]),
                },
              ],
            }}
          />
        ))}
      </View>
    </Animated.View>
  );
}