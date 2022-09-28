import { configureStore } from '@reduxjs/toolkit';
import listenerMiddleware from './Middleware';
import appUserReducer from './AppUserSlice';
import authReducer from './AuthSlice';
import muteReducer from './MuteSlice';
import currentRoomReducer from './CurrentRoomSlice';
import connectionStatusReducer from './ConnectionStatusSlice';
import worldReducer from './WorldSlice';
import artyReducer /* , { addParticipantRTListener } */ from './ArtySlice';
import screenShareReducer from './ScreenShareSlice';
import avatarReducer from './AvatarSlice';
import settingsReducer from './SettingsSlice';
import cameraShareReducer from './CameraShareSlice';
import { peachoneApi } from './api';

export const store = configureStore({
  reducer: {
    appUser: appUserReducer,
    auth: authReducer,
    mute: muteReducer,
    currentRoom: currentRoomReducer,
    connectionStatus: connectionStatusReducer,
    world: worldReducer,
    arty: artyReducer,
    screenShare: screenShareReducer,
    avatars: avatarReducer,
    settings: settingsReducer,
    cameraShare: cameraShareReducer,
    [peachoneApi.reducerPath]: peachoneApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .prepend(listenerMiddleware.middleware)
      .concat(peachoneApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
