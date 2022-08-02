import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TenantUser, UserLicense } from '../models/models';
import type { RootState } from './store';

type AppUserState = {
  tenantUser: TenantUser;
  userLicense: UserLicense;
};

const initialState: AppUserState = {
  tenantUser: {} as TenantUser,
  userLicense: {} as UserLicense,
};

export const appUserSlice = createSlice({
  name: 'appUser',
  initialState,
  reducers: {
    setTenantUser: (state, action: PayloadAction<TenantUser>) => {
      state.tenantUser = action.payload;
    },
    setUserLicense: (state, action: PayloadAction<UserLicense>) => {
      state.userLicense = action.payload;
    },
  },
});

export const { setTenantUser, setUserLicense } = appUserSlice.actions;

export const selectAppUser = (state: RootState) => state.appUser;

export const selectTenantUser = (state: RootState) => state.appUser.tenantUser;

export const selectUserLicense = (state: RootState) =>
  state.appUser.userLicense;

export default appUserSlice.reducer;
