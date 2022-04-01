/* eslint-disable import/no-cycle */
import { configureStore } from '@reduxjs/toolkit';
import appUserReducer from './AppUserSlice';

export const store = configureStore({
  reducer: {
    appUser: appUserReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
