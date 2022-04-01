import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

type AuthState = {
  token: string;
  expiration: number;
};

type Auth = {
  auth: AuthState;
};

const initialState: Auth = {
  auth: {
    token: '',
    expiration: 0,
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<Auth>) => {
      state.auth = action.payload.auth;
    },
  },
});

export const { setAuth } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
