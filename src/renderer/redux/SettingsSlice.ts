import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

export type SettingsState = {
  isVisible: boolean;
  selectedDevices: { [key in MediaDeviceKind]: string };
};

const initialState: SettingsState = {
  isVisible: false,
  selectedDevices: {
    audioinput: '',
    audiooutput: '',
    videoinput: '',
  },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setIsVisible: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },
    setSelectedSpeakerId: (state, action: PayloadAction<string>) => {
      state.selectedDevices.audiooutput = action.payload;
    },
    setSelectedMicrophoneId: (state, action: PayloadAction<string>) => {
      state.selectedDevices.audioinput = action.payload;
    },
  },
});

export const { setIsVisible, setSelectedSpeakerId, setSelectedMicrophoneId } =
  settingsSlice.actions;

export const selectIsVisible = (state: RootState) => state.settings.isVisible;

export const selectSelectedSpeakerId = (state: RootState) =>
  state.settings.selectedDevices.audiooutput;

export const selectSelectedMicrophoneId = (state: RootState) =>
  state.settings.selectedDevices.audioinput;

export default settingsSlice.reducer;
