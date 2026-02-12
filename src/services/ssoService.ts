import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { API_ENDPOINTS } from '@/utils/constants';

WebBrowser.maybeCompleteAuthSession();

export type SSOProvider = 'google' | 'apple';

interface SSOUserInfo {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  provider: SSOProvider;
  providerToken: string;
}

interface SSOAuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    level: number;
    points: number;
    avatar?: string;
  };
  token: string;
  isNewUser: boolean;
}

export const ssoService = {
  /**
   * Authenticate with Google using expo-auth-session
   */
  async signInWithGoogle(): Promise<SSOUserInfo> {
    const [request, response, promptAsync] = Google.useAuthRequest({
      expoClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });

    const result = await promptAsync();

    if (result.type !== 'success' || !result.authentication?.accessToken) {
      throw new Error('Google sign-in was cancelled or failed');
    }

    const accessToken = result.authentication.accessToken;

    // Fetch user profile from Google
    const userInfoResponse = await fetch(
      'https://www.googleapis.com/userinfo/v2/me',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch Google user profile');
    }

    const userInfo = await userInfoResponse.json();

    return {
      id: userInfo.id,
      email: userInfo.email,
      username: userInfo.name || userInfo.email.split('@')[0],
      avatar: userInfo.picture,
      provider: 'google',
      providerToken: accessToken,
    };
  },

  /**
   * Authenticate with Apple using expo-apple-authentication
   */
  async signInWithApple(): Promise<SSOUserInfo> {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign-In is only available on iOS');
    }

    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Apple Sign-In is not available on this device');
    }

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      throw new Error('Apple Sign-In failed: no identity token');
    }

    // Apple only provides name on first sign-in, so cache it
    if (credential.fullName?.givenName) {
      const displayName = [credential.fullName.givenName, credential.fullName.familyName]
        .filter(Boolean)
        .join(' ');
      await AsyncStorage.setItem('@apple_display_name', displayName);
    }

    const cachedName = await AsyncStorage.getItem('@apple_display_name');

    return {
      id: credential.user,
      email: credential.email || `${credential.user}@privaterelay.appleid.com`,
      username: cachedName || `user_${credential.user.substring(0, 8)}`,
      provider: 'apple',
      providerToken: credential.identityToken,
    };
  },

  /**
   * Send SSO token to backend for verification and account creation/login
   */
  async authenticateWithBackend(ssoUser: SSOUserInfo): Promise<SSOAuthResponse> {
    try {
      const response = await api.post<SSOAuthResponse>(API_ENDPOINTS.AUTH.SSO, {
        provider: ssoUser.provider,
        providerToken: ssoUser.providerToken,
        email: ssoUser.email,
        username: ssoUser.username,
        avatar: ssoUser.avatar,
      });

      const { token, user } = response.data;

      await AsyncStorage.setItem('@auth_token', token);
      await AsyncStorage.setItem('@user_data', JSON.stringify(user));
      await AsyncStorage.setItem('@auth_provider', ssoUser.provider);

      return response.data;
    } catch (error) {
      // If backend is unavailable, create a local-only session
      const localUser = {
        id: ssoUser.id,
        username: ssoUser.username,
        email: ssoUser.email,
        level: 1,
        points: 0,
        avatar: ssoUser.avatar,
      };

      await AsyncStorage.setItem('@user_data', JSON.stringify(localUser));
      await AsyncStorage.setItem('@auth_provider', ssoUser.provider);
      await AsyncStorage.setItem('@sso_provider_token', ssoUser.providerToken);

      return {
        user: localUser,
        token: '',
        isNewUser: true,
      };
    }
  },

  /**
   * Check if Apple Sign-In is available on this device
   */
  async isAppleSignInAvailable(): Promise<boolean> {
    if (Platform.OS !== 'ios') return false;
    try {
      return await AppleAuthentication.isAvailableAsync();
    } catch {
      return false;
    }
  },

  /**
   * Get the current SSO provider (if any)
   */
  async getCurrentProvider(): Promise<SSOProvider | null> {
    const provider = await AsyncStorage.getItem('@auth_provider');
    return provider as SSOProvider | null;
  },

  /**
   * Clear SSO-specific storage on logout
   */
  async clearSSOData(): Promise<void> {
    await AsyncStorage.multiRemove([
      '@auth_provider',
      '@sso_provider_token',
    ]);
  },
};
