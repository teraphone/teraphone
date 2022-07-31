import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TenantUser, User, UserLicense } from '../models/models';
import type { RootState } from './store';

type AppUserState = {
  appUser: User;
  tenantUser: TenantUser;
  userLicense: UserLicense;
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
  userLicense: {} as UserLicense,
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
    setUserLicense: (state, action: PayloadAction<UserLicense>) => {
      state.userLicense = action.payload;
    },
  },
});

export const { setAppUser, setTenantUser } = appUserSlice.actions;

export const selectAppUser = (state: RootState) => state.appUser;

export const selectTenantUser = (state: RootState) => state.appUser.tenantUser;

export const selectUserLicense = (state: RootState) =>
  state.appUser.userLicense;

export default appUserSlice.reducer;
