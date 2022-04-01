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
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
