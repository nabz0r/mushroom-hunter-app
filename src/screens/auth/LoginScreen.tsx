import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { useAppDispatch } from '@/store';
import { loginSuccess } from '@/store/slices/authSlice';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    // TODO: Implement real authentication
    dispatch(loginSuccess({
      id: '1',
      username: 'Chasseur123',
      email: email,
      level: 1,
      points: 0,
    }));
  };

  return (
    <SafeAreaView className="flex-1 bg-forest-dark">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8">
          {/* Logo */}
          <View className="items-center mb-8">
            <Text className="text-6xl mb-4">🍄</Text>
            <Text className="text-white text-3xl font-bold">Mushroom Hunter</Text>
            <Text className="text-forest-light text-lg">Connexion</Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            <TextInput
              className="bg-white/10 text-white px-4 py-3 rounded-lg"
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              className="bg-white/10 text-white px-4 py-3 rounded-lg mb-6"
              placeholder="Mot de passe"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              onPress={handleLogin}
              className="bg-primary-600 py-4 rounded-full"
            >
              <Text className="text-white text-center font-bold text-lg">Se connecter</Text>
            </TouchableOpacity>

            <TouchableOpacity className="py-2">
              <Text className="text-forest-light text-center">Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>

          {/* Register link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-400">Pas encore de compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-primary-500 font-bold">S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}