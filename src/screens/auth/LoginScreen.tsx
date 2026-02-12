import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { useAppDispatch } from '@/store';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { authService } from '@/services/authService';
import { validateEmail } from '@/utils/helpers';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    dispatch(loginStart());

    try {
      const response = await authService.login({ email, password });
      dispatch(loginSuccess({
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        level: response.user.level,
        points: response.user.points,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Identifiants incorrects';
      dispatch(loginFailure(message));
      Alert.alert('Erreur de connexion', message);
    } finally {
      setIsLoading(false);
    }
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
            <View>
              <TextInput
                className={`bg-white/10 text-white px-4 py-3 rounded-lg ${errors.email ? 'border border-red-500' : ''}`}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={(text) => { setEmail(text); setErrors(prev => ({ ...prev, email: undefined })); }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.email && <Text className="text-red-400 text-sm mt-1 ml-1">{errors.email}</Text>}
            </View>

            <View>
              <TextInput
                className={`bg-white/10 text-white px-4 py-3 rounded-lg ${errors.password ? 'border border-red-500' : ''}`}
                placeholder="Mot de passe"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={(text) => { setPassword(text); setErrors(prev => ({ ...prev, password: undefined })); }}
                secureTextEntry
                editable={!isLoading}
              />
              {errors.password && <Text className="text-red-400 text-sm mt-1 ml-1">{errors.password}</Text>}
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              className={`py-4 rounded-full ${isLoading ? 'bg-primary-400' : 'bg-primary-600'}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">Se connecter</Text>
              )}
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