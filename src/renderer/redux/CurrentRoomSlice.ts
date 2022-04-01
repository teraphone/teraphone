import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

type CurrentRoomState = {
  roomId: number;
  roomName: string;
  groupId: number;
  groupName: string;
};

type CurrentRoom = {
  currentRoom: CurrentRoomState;
};

const initialState: CurrentRoom = {
  currentRoom: {
    roomId: 0,
    roomName: '',
    groupId: 0,
    groupName: '',
  },
};

export const currentRoomSlice = createSlice({
  name: 'currentRoom',
  initialState,
  reducers: {
    setCurrentRoom: (state, action: PayloadAction<CurrentRoomState>) => {
      state.currentRoom = action.payload;
    },
  },
});

export const { setCurrentRoom } = currentRoomSlice.actions;

export const selectCurrentRoom = (state: RootState) => state.currentRoom;

export default currentRoomSlice.reducer;
