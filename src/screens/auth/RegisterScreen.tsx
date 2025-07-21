import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { useAppDispatch } from '@/store';
import { loginSuccess } from '@/store/slices/authSlice';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();

  const handleRegister = () => {
    // TODO: Implement real registration
    dispatch(loginSuccess({
      id: '1',
      username: username,
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
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-center px-8 py-8">
            {/* Logo */}
            <View className="items-center mb-8">
              <Text className="text-6xl mb-4">🍄</Text>
              <Text className="text-white text-3xl font-bold">Mushroom Hunter</Text>
              <Text className="text-forest-light text-lg">Créer un compte</Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              <TextInput
                className="bg-white/10 text-white px-4 py-3 rounded-lg"
                placeholder="Nom d'utilisateur"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />

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
                className="bg-white/10 text-white px-4 py-3 rounded-lg"
                placeholder="Mot de passe"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TextInput
                className="bg-white/10 text-white px-4 py-3 rounded-lg mb-6"
                placeholder="Confirmer le mot de passe"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <TouchableOpacity
                onPress={handleRegister}
                className="bg-primary-600 py-4 rounded-full"
              >
                <Text className="text-white text-center font-bold text-lg">S'inscrire</Text>
              </TouchableOpacity>
            </View>

            {/* Terms */}
            <Text className="text-gray-400 text-center text-sm mt-6 px-4">
              En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité
            </Text>

            {/* Login link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-400">Déjà un compte ? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="text-primary-500 font-bold">Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}