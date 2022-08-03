import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

export type CurrentRoomState = {
  roomId: string;
  roomName: string;
  teamId: string;
  teamName: string;
};

type CurrentRoom = {
  currentRoom: CurrentRoomState;
  previousRoom: CurrentRoomState;
};

const initialState: CurrentRoom = {
  currentRoom: {
    roomId: '',
    roomName: '',
    teamId: '',
    teamName: '',
  },
  previousRoom: {
    roomId: '',
    roomName: '',
    teamId: '',
    teamName: '',
  },
};

export const currentRoomSlice = createSlice({
  name: 'currentRoom',
  initialState,
  reducers: {
    setCurrentRoom: (state, action: PayloadAction<CurrentRoomState>) => {
      state.currentRoom = action.payload;
    },
    setPreviousRoom: (state, action: PayloadAction<CurrentRoomState>) => {
      state.previousRoom = action.payload;
    },
  },
});

export const { setCurrentRoom, setPreviousRoom } = currentRoomSlice.actions;

export const selectCurrentRoom = (state: RootState) => state.currentRoom;

export default currentRoomSlice.reducer;
