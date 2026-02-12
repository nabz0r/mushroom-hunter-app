import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import { ssoService, SSOProvider } from './ssoService';
import { userDB } from './database';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  username: string;
}

interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    level: number;
    points: number;
    avatar?: string;
  };
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    const { token, user } = response.data;

    await AsyncStorage.setItem('@auth_token', token);
    await AsyncStorage.setItem('@user_data', JSON.stringify(user));
    await AsyncStorage.setItem('@auth_provider', 'email');

    // Persist to local database
    await userDB.upsert({
      ...user,
      auth_provider: 'email',
    });

    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    const { token, user } = response.data;

    await AsyncStorage.setItem('@auth_token', token);
    await AsyncStorage.setItem('@user_data', JSON.stringify(user));
    await AsyncStorage.setItem('@auth_provider', 'email');

    // Persist to local database
    await userDB.upsert({
      ...user,
      auth_provider: 'email',
    });

    return response.data;
  },

  async loginWithSSO(provider: SSOProvider): Promise<AuthResponse & { authProvider: SSOProvider }> {
    // Get SSO user info from provider
    const ssoUser = provider === 'google'
      ? await ssoService.signInWithGoogle()
      : await ssoService.signInWithApple();

    // Authenticate with backend
    const result = await ssoService.authenticateWithBackend(ssoUser);

    // Persist to local database
    await userDB.upsert({
      ...result.user,
      auth_provider: provider,
    });

    return {
      user: result.user,
      token: result.token,
      authProvider: provider,
    };
  },

  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Continue with logout even if API call fails
    }

    await ssoService.clearSSOData();
    await AsyncStorage.multiRemove([
      '@auth_token',
      '@user_data',
      '@auth_provider',
    ]);
  },

  async getCurrentUser() {
    const userData = await AsyncStorage.getItem('@user_data');
    if (userData) {
      return JSON.parse(userData);
    }

    // Fallback: check local database for cached user
    return null;
  },

  async getAuthProvider(): Promise<SSOProvider | 'email' | null> {
    const provider = await AsyncStorage.getItem('@auth_provider');
    return provider as SSOProvider | 'email' | null;
  },

  async refreshToken(): Promise<string | null> {
    try {
      const response = await api.post<{ token: string }>(API_ENDPOINTS.AUTH.REFRESH);
      await AsyncStorage.setItem('@auth_token', response.data.token);
      return response.data.token;
    } catch {
      return null;
    }
  },

  async deleteAccount(userId: string): Promise<void> {
    try {
      await api.delete(`/users/${userId}`);
    } catch {
      // Continue with local cleanup even if API call fails
      console.warn('Failed to delete account on server');
    }

    // Clean up local database
    await userDB.delete(userId);
    await ssoService.clearSSOData();
    await AsyncStorage.clear();
  },
};
