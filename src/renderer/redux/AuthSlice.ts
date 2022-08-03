import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthenticationResult } from '@azure/msal-node';
import type { RootState } from './store';

type AuthState = {
  token: string;
  expiration: number;
  msAuthResult: AuthenticationResult;
  accessToken: string;
  accessTokenExpiration: number;
  refreshToken: string;
  refreshTokenExpiration: number;
};

type Auth = {
  auth: AuthState;
};

const initialState: Auth = {
  auth: {
    token: '',
    expiration: 0,
    msAuthResult: {} as AuthenticationResult,
    accessToken: '',
    accessTokenExpiration: 0,
    refreshToken: '',
    refreshTokenExpiration: 0,
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.auth = action.payload;
    },
    setMSAuthResult: (state, action: PayloadAction<AuthenticationResult>) => {
      state.auth.msAuthResult = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.auth.accessToken = action.payload;
    },
    setAccessTokenExpiration: (state, action: PayloadAction<number>) => {
      state.auth.accessTokenExpiration = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.auth.refreshToken = action.payload;
    },
    setRefreshTokenExpiration: (state, action: PayloadAction<number>) => {
      state.auth.refreshTokenExpiration = action.payload;
    },
  },
});

export const {
  setAuth,
  setMSAuthResult,
  setAccessToken,
  setAccessTokenExpiration,
  setRefreshToken,
  setRefreshTokenExpiration,
} = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export const selectMSAuthResult = (state: RootState) =>
  state.auth.auth.msAuthResult;

export default authSlice.reducer;
