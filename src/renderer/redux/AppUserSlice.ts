import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../models/models';
import { RootState } from './store';

type AppUserState = {
  appUser: User;
};

const initialState: AppUserState = {
  appUser: {
    id: 0,
    created_at: '',
    updated_at: '',
    name: '',
    email: '',
  },
};

export const appUserSlice = createSlice({
  name: 'appUser',
  initialState,
  reducers: {
    setAppUser: (state, action: PayloadAction<User>) => {
      state.appUser = action.payload;
    },
  },
});

export const { setAppUser } = appUserSlice.actions;

export const selectAppUser = (state: RootState) => state.appUser;

export default appUserSlice.reducer;
