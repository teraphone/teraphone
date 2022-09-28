import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

type CameraShareState = {
  isSharing: boolean;
};

const initialState: CameraShareState = {
  isSharing: false,
};

export const cameraShareSlice = createSlice({
  name: 'cameraShare',
  initialState,
  reducers: {
    setCameraIsSharing: (state, action: PayloadAction<boolean>) => {
      state.isSharing = action.payload;
    },
  },
});

export const { setCameraIsSharing } = cameraShareSlice.actions;

export const selectCameraIsSharing = (state: RootState) =>
  state.cameraShare.isSharing;

export default cameraShareSlice.reducer;
