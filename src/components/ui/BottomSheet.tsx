import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: number;
  showHandle?: boolean;
  closeOnOverlayPress?: boolean;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function BottomSheet({
  isVisible,
  onClose,
  title,
  children,
  height = SCREEN_HEIGHT * 0.5,
  showHandle = true,
  closeOnOverlayPress = true,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(height)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, height]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > height * 0.3) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={closeOnOverlayPress ? onClose : undefined}
        style={{ flex: 1 }}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            opacity,
          }}
        />
      </TouchableOpacity>

      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: height + insets.bottom,
          backgroundColor: 'white',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          transform: [{ translateY }],
        }}
      >
        <View {...panResponder.panHandlers}>
          {showHandle && (
            <View className="items-center py-2">
              <View className="w-12 h-1 bg-gray-300 rounded-full" />
            </View>
          )}

          {title && (
            <View className="flex-row items-center justify-between px-4 pb-4 border-b border-gray-200">
              <Text className="text-lg font-bold">{title}</Text>
              <TouchableOpacity onPress={onClose} className="p-2">
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}