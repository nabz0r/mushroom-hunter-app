import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Animated, 
  Keyboard,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  autoFocus?: boolean;
  showCancel?: boolean;
  onCancel?: () => void;
}

export function SearchBar({
  placeholder = 'Rechercher...',
  value,
  onChangeText,
  onSubmit,
  onFocus,
  onBlur,
  onClear,
  autoFocus = false,
  showCancel = false,
  onCancel,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const cancelWidth = useRef(new Animated.Value(0)).current;
  const searchWidth = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (showCancel && isFocused) {
      Animated.parallel([
        Animated.timing(cancelWidth, {
          toValue: 80,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(searchWidth, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(cancelWidth, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(searchWidth, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isFocused, showCancel]);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleClear = () => {
    onChangeText('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleCancel = () => {
    onChangeText('');
    Keyboard.dismiss();
    setIsFocused(false);
    onCancel?.();
  };

  const handleSubmit = () => {
    onSubmit?.(value);
    inputRef.current?.blur();
  };

  return (
    <View className="flex-row items-center">
      <Animated.View
        style={{
          flex: searchWidth,
        }}
        className={`
          flex-row items-center bg-gray-100 rounded-full px-4 py-3
          ${isFocused ? 'bg-white border-2 border-primary-500' : ''}
        `}
      >
        <Ionicons 
          name="search" 
          size={20} 
          color={isFocused ? '#16a34a' : '#6B7280'} 
        />
        
        <TextInput
          ref={inputRef}
          className="flex-1 ml-3 text-base text-gray-900"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmit}
          autoFocus={autoFocus}
          returnKeyType="search"
          clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
        />
        
        {Platform.OS === 'android' && value.length > 0 && (
          <TouchableOpacity onPress={handleClear} className="p-1">
            <Ionicons name="close-circle" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </Animated.View>
      
      {showCancel && (
        <Animated.View style={{ width: cancelWidth, overflow: 'hidden' }}>
          <TouchableOpacity 
            onPress={handleCancel}
            className="items-center justify-center h-full"
          >
            <Text className="text-primary-600 font-medium ml-3">
              Annuler
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}