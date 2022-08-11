import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

export type SettingsState = {
  isVisible: boolean;
};

const initialState: SettingsState = {
  isVisible: false,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setIsVisible: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },
  },
});

export const { setIsVisible } = settingsSlice.actions;

export const selectIsVisible = (state: RootState) => state.settings.isVisible;

export default settingsSlice.reducer;
