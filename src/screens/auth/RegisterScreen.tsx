import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { useAppDispatch } from '@/store';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { authService } from '@/services/authService';
import { validateEmail, validatePassword } from '@/utils/helpers';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Minimum 3 caractères';
    }

    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    const passwordValidation = validatePassword(password);
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setIsLoading(true);
    dispatch(loginStart());

    try {
      const response = await authService.register({ username, email, password });
      dispatch(loginSuccess({
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        level: response.user.level,
        points: response.user.points,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de l\'inscription';
      dispatch(loginFailure(message));
      Alert.alert('Erreur d\'inscription', message);
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
              <View>
                <TextInput
                  className={`bg-white/10 text-white px-4 py-3 rounded-lg ${errors.username ? 'border border-red-500' : ''}`}
                  placeholder="Nom d'utilisateur"
                  placeholderTextColor="#9CA3AF"
                  value={username}
                  onChangeText={(text) => { setUsername(text); setErrors(prev => ({ ...prev, username: undefined })); }}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                {errors.username && <Text className="text-red-400 text-sm mt-1 ml-1">{errors.username}</Text>}
              </View>

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

              <View>
                <TextInput
                  className={`bg-white/10 text-white px-4 py-3 rounded-lg ${errors.confirmPassword ? 'border border-red-500' : ''}`}
                  placeholder="Confirmer le mot de passe"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={(text) => { setConfirmPassword(text); setErrors(prev => ({ ...prev, confirmPassword: undefined })); }}
                  secureTextEntry
                  editable={!isLoading}
                />
                {errors.confirmPassword && <Text className="text-red-400 text-sm mt-1 ml-1">{errors.confirmPassword}</Text>}
              </View>

              <TouchableOpacity
                onPress={handleRegister}
                className={`py-4 rounded-full mt-2 ${isLoading ? 'bg-primary-400' : 'bg-primary-600'}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-bold text-lg">S'inscrire</Text>
                )}
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