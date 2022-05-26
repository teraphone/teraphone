import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { Database } from 'firebase/database';
import { AxiosInstance } from 'axios';
import type { RootState } from './store';
import * as models from '../models/models';

type ArtyState = {
  participants: models.ParticipantRTGroups;
  online: models.OnlineRTGroups;
};

export type SetParticipantsGroupPayload = {
  groupId: string;
  rooms: models.ParticipantRTRooms;
};

export type SetOnlineGroupPayload = {
  groupId: string;
  users: models.OnlineRTUsers;
};

const initialState: ArtyState = {
  participants: {} as models.ParticipantRTGroups,
  online: {} as models.OnlineRTGroups,
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
    setOnlineGroup: (state, action: PayloadAction<SetOnlineGroupPayload>) => {
      const { groupId, users } = action.payload;
      state.online[groupId] = users;
    },
  },
});

export const { setParticipantsGroup, setOnlineGroup } = artySlice.actions;

export const selectParticipants = (state: RootState) => state.arty.participants;

export const selectOnline = (state: RootState) => state.arty.online;

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

export const selectGroupOnline = (state: RootState, groupId: string) => {
  if (groupId in state.arty.online) {
    return state.arty.online[groupId];
  }
  return {} as models.OnlineRTUsers;
};

export default artySlice.reducer;

export type AddParticipantRTListenerPayload = {
  db: Database;
  groupId: string;
};

export type AddOnlineRTListenerPayload = {
  db: Database;
  groupId: string;
};

export const addParticipantRTListener =
  createAction<AddParticipantRTListenerPayload>(
    'arty/addParticipantRTListener'
  );

export const addOnlineRTListener = createAction<AddOnlineRTListenerPayload>(
  'arty/addOnlineRTListener'
);

export type UnknownParticipantPayload = {
  client: AxiosInstance;
  groupId: number;
  userId: number;
};

export const unknownParticipant = createAction<UnknownParticipantPayload>(
  'arty/unknownParticipant'
);
