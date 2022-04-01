import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from './store';

type MuteState = {
  mute: boolean;
  deafen: boolean;
};

const initialState: MuteState = {
  mute: false,
  deafen: false,
};

export const muteSlice = createSlice({
  name: 'mute',
  initialState,
  reducers: {
    toggleMute: (state) => {
      state.mute = !state.mute;
    },
    toggleDeafen: (state) => {
      state.deafen = !state.deafen;
    },
  },
});

export const { toggleMute, toggleDeafen } = muteSlice.actions;

export const selectMute = (state: RootState) => state.mute.mute;
export const selectDeafen = (state: RootState) => state.mute.deafen;

export default muteSlice.reducer;
