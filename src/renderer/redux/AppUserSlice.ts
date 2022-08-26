import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TenantUser, Subscription } from '../models/models';
import type { RootState } from './store';

type AppUserState = {
  tenantUser: TenantUser;
  userSubscription: Subscription;
};

const initialState: AppUserState = {
  tenantUser: {} as TenantUser,
  userSubscription: {} as Subscription,
};

export const appUserSlice = createSlice({
  name: 'appUser',
  initialState,
  reducers: {
    setTenantUser: (state, action: PayloadAction<TenantUser>) => {
      state.tenantUser = action.payload;
    },
    setUserSubscription: (state, action: PayloadAction<Subscription>) => {
      state.userSubscription = action.payload;
    },
  },
});

export const { setTenantUser, setUserSubscription } = appUserSlice.actions;

export const selectAppUser = (state: RootState) => state.appUser;

export const selectTenantUser = (state: RootState) => state.appUser.tenantUser;

export const selectUserSubscription = (state: RootState) =>
  state.appUser.userSubscription;

export default appUserSlice.reducer;
