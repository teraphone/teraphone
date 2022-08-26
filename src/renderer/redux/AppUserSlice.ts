import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TenantUser, Subscription } from '../models/models';
import type { RootState } from './store';

type AppUserState = {
  tenantUser: TenantUser;
  subscription: Subscription;
};

const initialState: AppUserState = {
  tenantUser: {} as TenantUser,
  subscription: {} as Subscription,
};

export const appUserSlice = createSlice({
  name: 'appUser',
  initialState,
  reducers: {
    setTenantUser: (state, action: PayloadAction<TenantUser>) => {
      state.tenantUser = action.payload;
    },
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      state.subscription = action.payload;
    },
  },
});

export const { setTenantUser, setSubscription } = appUserSlice.actions;

export const selectAppUser = (state: RootState) => state.appUser;

export const selectTenantUser = (state: RootState) => state.appUser.tenantUser;

export const selectSubscription = (state: RootState) =>
  state.appUser.subscription;

export default appUserSlice.reducer;
