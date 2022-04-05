import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { Database } from 'firebase/database';
import type { RootState } from './store';
import * as models from '../models/models';

type ArtyState = {
  participants: models.ParticipantRTGroups;
};

type SetGroupPayload = {
  groupId: string;
  rooms: models.ParticipantRTRooms;
};

const initialState: ArtyState = {
  participants: {} as models.ParticipantRTGroups,
};

export const artySlice = createSlice({
  name: 'arty',
  initialState,
  reducers: {
    setGroup: (state, action: PayloadAction<SetGroupPayload>) => {
      const { groupId, rooms } = action.payload;
      state.participants[groupId] = rooms;
    },
  },
});

export const { setGroup } = artySlice.actions;

export const selectParticipants = (state: RootState) => state.arty.participants;

export default artySlice.reducer;

export type AddParticipantRTListenerPayload = {
  db: Database;
  groupId: string;
};

export const addParticipantRTListener =
  createAction<AddParticipantRTListenerPayload>(
    'arty/addParticipantRTListener'
  );
