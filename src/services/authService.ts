import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';

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
  };
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      await AsyncStorage.setItem('@auth_token', response.data.token);
      await AsyncStorage.setItem('@user_data', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
      await AsyncStorage.setItem('@auth_token', response.data.token);
      await AsyncStorage.setItem('@user_data', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      await AsyncStorage.multiRemove(['@auth_token', '@user_data']);
    }
  },

  async getCurrentUser() {
    const userData = await AsyncStorage.getItem('@user_data');
    return userData ? JSON.parse(userData) : null;
  },

  async refreshToken(): Promise<string | null> {
    try {
      const response = await api.post<{ token: string }>(API_ENDPOINTS.AUTH.REFRESH);
      await AsyncStorage.setItem('@auth_token', response.data.token);
      return response.data.token;
    } catch (error) {
      return null;
    }
  },
};