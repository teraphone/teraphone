import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import type { SerializedDesktopCapturerSource } from '../global';

export type ScreenSource = {
  [id: string]: SerializedDesktopCapturerSource;
};

type ScreenShareState = {
  screens: ScreenSource;
  windows: ScreenSource;
  pickerVisible: boolean;
  isSharing: boolean;
};

const initialState: ScreenShareState = {
  screens: {},
  windows: {},
  pickerVisible: false,
  isSharing: false,
};

export function validDataURL(dataURL: string | null) {
  if (dataURL === null) {
    return false;
  }
  return dataURL.split(',')[1].length > 0;
}

export const screenShareSlice = createSlice({
  name: 'screenShare',
  initialState,
  reducers: {
    setScreens: (state, action: PayloadAction<ScreenSource>) => {
      state.screens = action.payload;
      if (
        Object.keys(action.payload).length > 0 ||
        Object.keys(state.windows).length > 0
      ) {
        state.isSharing = true;
      } else {
        state.isSharing = false;
      }
    },
    setWindows: (state, action: PayloadAction<ScreenSource>) => {
      state.windows = action.payload;
      if (
        Object.keys(action.payload).length > 0 ||
        Object.keys(state.screens).length > 0
      ) {
        state.isSharing = true;
      } else {
        state.isSharing = false;
      }
    },
    setPickerVisible: (state, action: PayloadAction<boolean>) => {
      state.pickerVisible = action.payload;
    },
  },
});

export const { setScreens, setWindows, setPickerVisible } =
  screenShareSlice.actions;

export const selectScreens = (state: RootState) => state.screenShare.screens;

export const selectWindows = (state: RootState) => state.screenShare.windows;

export const selectPickerVisible = (state: RootState) =>
  state.screenShare.pickerVisible;

export const selectIsSharing = (state: RootState) =>
  state.screenShare.isSharing;

export default screenShareSlice.reducer;
