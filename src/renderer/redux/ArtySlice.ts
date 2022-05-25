import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { Database } from 'firebase/database';
import { AxiosInstance } from 'axios';
import type { RootState } from './store';
import * as models from '../models/models';

type ArtyState = {
  participants: models.ParticipantRTGroups;
};

type SetParticipantsGroupPayload = {
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
    setParticipantsGroup: (
      state,
      action: PayloadAction<SetParticipantsGroupPayload>
    ) => {
      const { groupId, rooms } = action.payload;
      state.participants[groupId] = rooms;
    },
  },
});

export const { setParticipantsGroup } = artySlice.actions;

export const selectParticipants = (state: RootState) => state.arty.participants;

export const selectRoomParticipants = (
  state: RootState,
  groupId: string,
  roomId: string
) => {
  if (groupId in state.arty.participants) {
    if (
      state.arty.participants[groupId] !== null &&
      roomId in state.arty.participants[groupId]
    ) {
      return state.arty.participants[groupId][roomId];
    }
  }
  return {} as models.ParticipantRTUsers;
};

export default artySlice.reducer;

export type AddParticipantRTListenerPayload = {
  db: Database;
  groupId: string;
};

export const addParticipantRTListener =
  createAction<AddParticipantRTListenerPayload>(
    'arty/addParticipantRTListener'
  );

export type UnknownParticipantPayload = {
  client: AxiosInstance;
  groupId: number;
  userId: number;
};

export const unknownParticipant = createAction<UnknownParticipantPayload>(
  'arty/unknownParticipant'
);
