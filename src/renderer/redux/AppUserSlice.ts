import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TenantUser, User } from '../models/models';
import type { RootState } from './store';

type AppUserState = {
  appUser: User;
  tenantUser: TenantUser;
};

const initialState: AppUserState = {
  appUser: {
    id: 0,
    created_at: '',
    updated_at: '',
    name: '',
    email: '',
  },
  tenantUser: {} as TenantUser,
};

export const appUserSlice = createSlice({
  name: 'appUser',
  initialState,
  reducers: {
    setAppUser: (state, action: PayloadAction<User>) => {
      state.appUser = action.payload;
    },
    setTenantUser: (state, action: PayloadAction<TenantUser>) => {
      state.tenantUser = action.payload;
    },
  },
});

export const { setAppUser, setTenantUser } = appUserSlice.actions;

export const selectAppUser = (state: RootState) => state.appUser;

export const selectTenantUser = (state: RootState) => state.appUser.tenantUser;

export default appUserSlice.reducer;
