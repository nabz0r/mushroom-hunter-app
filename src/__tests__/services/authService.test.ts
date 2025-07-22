import { authService } from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';

jest.mock('@/services/api');
jest.mock('@react-native-async-storage/async-storage');

const mockApi = api as jest.Mocked<typeof api>;
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully and store token', async () => {
      const mockResponse = {
        data: {
          user: {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            level: 1,
            points: 0,
          },
          token: 'mock-jwt-token',
        },
      };

      mockApi.post.mockResolvedValueOnce(mockResponse);
      mockAsyncStorage.setItem.mockResolvedValueOnce();

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@auth_token',
        'mock-jwt-token'
      );

      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login failure', async () => {
      const mockError = new Error('Invalid credentials');
      mockApi.post.mockRejectedValueOnce(mockError);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrong-password',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should clear storage on logout', async () => {
      mockApi.post.mockResolvedValueOnce({});
      mockAsyncStorage.multiRemove.mockResolvedValueOnce();

      await authService.logout();

      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledWith([
        '@auth_token',
        '@user_data',
      ]);
    });

    it('should clear storage even if API call fails', async () => {
      mockApi.post.mockRejectedValueOnce(new Error('Network error'));
      mockAsyncStorage.multiRemove.mockResolvedValueOnce();

      await authService.logout();

      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledWith([
        '@auth_token',
        '@user_data',
      ]);
    });
  });
});