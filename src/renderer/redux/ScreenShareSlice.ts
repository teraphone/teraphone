import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

type ScreenSource = {
  [id: string]: string;
};

type ScreenShareState = {
  screens: ScreenSource;
  windows: ScreenSource;
  pickerVisible: boolean;
};

const initialState: ScreenShareState = {
  screens: {},
  windows: {},
  pickerVisible: false,
};

export const screenShareSlice = createSlice({
  name: 'screenShare',
  initialState,
  reducers: {
    setScreens: (state, action: PayloadAction<ScreenSource>) => {
      state.screens = action.payload;
    },
    setWindows: (state, action: PayloadAction<ScreenSource>) => {
      state.windows = action.payload;
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

export default screenShareSlice.reducer;
