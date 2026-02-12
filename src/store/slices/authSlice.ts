import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SSOProvider } from '@/services/ssoService';

export interface User {
  id: string;
  username: string;
  email: string;
  level: number;
  points: number;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  authProvider: SSOProvider | 'email' | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  authProvider: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User & { authProvider?: SSOProvider | 'email' }>) => {
      const { authProvider, ...user } = action.payload;
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = user;
      state.error = null;
      state.authProvider = authProvider || 'email';
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.authProvider = null;
    },
    updateUserPoints: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.points += action.payload;
      }
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    levelUp: (state) => {
      if (state.user) {
        state.user.level += 1;
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUserPoints,
  updateUserProfile,
  levelUp,
} = authSlice.actions;

export default authSlice.reducer;
