import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

type VideoViewState = {
  windowOpen: boolean;
};

const initialState: VideoViewState = {
  windowOpen: false,
};

export const videoViewSlice = createSlice({
  name: 'videoView',
  initialState,
  reducers: {
    setWindowOpen: (state, action: PayloadAction<boolean>) => {
      state.windowOpen = action.payload;
    },
  },
});

export const { setWindowOpen } = videoViewSlice.actions;

export const selectWindowOpen = (state: RootState) =>
  state.videoView.windowOpen;

export default videoViewSlice.reducer;
