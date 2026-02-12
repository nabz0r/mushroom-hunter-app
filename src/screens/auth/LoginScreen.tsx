import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { useAppDispatch } from '@/store';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { authService } from '@/services/authService';
import { ssoService, SSOProvider } from '@/services/ssoService';
import { validateEmail } from '@/utils/helpers';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState<SSOProvider | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    ssoService.isAppleSignInAvailable().then(setIsAppleAvailable);
  }, []);

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
        avatar: response.user.avatar,
        authProvider: 'email',
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Identifiants incorrects';
      dispatch(loginFailure(message));
      Alert.alert('Erreur de connexion', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = async (provider: SSOProvider) => {
    setSsoLoading(provider);
    dispatch(loginStart());

    try {
      const response = await authService.loginWithSSO(provider);
      dispatch(loginSuccess({
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        level: response.user.level,
        points: response.user.points,
        avatar: response.user.avatar,
        authProvider: provider,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Connexion annulée';
      dispatch(loginFailure(message));
      if (!message.includes('cancelled') && !message.includes('annulée')) {
        Alert.alert('Erreur de connexion', message);
      }
    } finally {
      setSsoLoading(null);
    }
  };

  const isBusy = isLoading || ssoLoading !== null;

  return (
    <SafeAreaView className="flex-1 bg-forest-dark">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center px-8 py-8">
            {/* Logo */}
            <View className="items-center mb-8">
              <Text className="text-6xl mb-4">🍄</Text>
              <Text className="text-white text-3xl font-bold">Mushroom Hunter</Text>
              <Text className="text-forest-light text-lg">Connexion</Text>
            </View>

            {/* SSO Buttons */}
            <View className="space-y-3 mb-6">
              <TouchableOpacity
                onPress={() => handleSSOLogin('google')}
                className="bg-white flex-row items-center justify-center py-3 rounded-full"
                disabled={isBusy}
              >
                {ssoLoading === 'google' ? (
                  <ActivityIndicator color="#4285F4" />
                ) : (
                  <>
                    <Ionicons name="logo-google" size={20} color="#4285F4" />
                    <Text className="text-gray-800 font-semibold text-base ml-3">
                      Continuer avec Google
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {isAppleAvailable && (
                <TouchableOpacity
                  onPress={() => handleSSOLogin('apple')}
                  className="bg-black flex-row items-center justify-center py-3 rounded-full"
                  disabled={isBusy}
                >
                  {ssoLoading === 'apple' ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Ionicons name="logo-apple" size={20} color="white" />
                      <Text className="text-white font-semibold text-base ml-3">
                        Continuer avec Apple
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-white/20" />
              <Text className="text-gray-400 mx-4">ou</Text>
              <View className="flex-1 h-px bg-white/20" />
            </View>

            {/* Email Form */}
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
                  editable={!isBusy}
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
                  editable={!isBusy}
                />
                {errors.password && <Text className="text-red-400 text-sm mt-1 ml-1">{errors.password}</Text>}
              </View>

              <TouchableOpacity
                onPress={handleLogin}
                className={`py-4 rounded-full ${isBusy ? 'bg-primary-400' : 'bg-primary-600'}`}
                disabled={isBusy}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
