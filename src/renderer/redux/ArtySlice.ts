import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import type { RootState } from './store';
import * as models from '../models/models';

type ArtyState = {
  participants: models.ParticipantRTGroups;
  online: models.OnlineRTGroups;
};

export type SetParticipantsGroupPayload = {
  teamId: string;
  rooms: models.ParticipantRTRooms;
};

export type SetOnlineGroupPayload = {
  teamId: string;
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
      const { teamId, rooms } = action.payload;
      state.participants[teamId] = rooms;
    },
    setOnlineGroup: (state, action: PayloadAction<SetOnlineGroupPayload>) => {
      const { teamId, users } = action.payload;
      state.online[teamId] = users;
    },
  },
});

export const { setParticipantsGroup, setOnlineGroup } = artySlice.actions;

export const selectParticipants = (state: RootState) => state.arty.participants;

export const selectOnline = (state: RootState) => state.arty.online;

export const selectRoomParticipants = (
  state: RootState,
  teamId: string,
  roomId: string
) => {
  if (teamId in state.arty.participants) {
    if (
      state.arty.participants[teamId] !== null &&
      roomId in state.arty.participants[teamId]
    ) {
      return state.arty.participants[teamId][roomId];
    }
  }
  return {} as models.ParticipantRTUsers;
};

export const selectGroupOnline = (state: RootState, teamId: string) => {
  if (teamId in state.arty.online) {
    return state.arty.online[teamId];
  }
  return {} as models.OnlineRTUsers;
};

export default artySlice.reducer;

export type AddParticipantRTListenerPayload = {
  teamId: string;
};

export const addParticipantRTListener =
  createAction<AddParticipantRTListenerPayload>(
    'arty/addParticipantRTListener'
  );

export type AddOnlineRTListenerPayload = {
  teamId: string;
};

export const addOnlineRTListener = createAction<AddOnlineRTListenerPayload>(
  'arty/addOnlineRTListener'
);

export type UnknownParticipantPayload = {
  client: AxiosInstance;
  teamId: string;
  userId: string;
};

export const unknownParticipant = createAction<UnknownParticipantPayload>(
  'arty/unknownParticipant'
);

export const signedIn = createAction('arty/SignedIn');

export const signedOut = createAction('arty/SignedOut');

export type PushUserParticipantRTInfoPayload = {
  teamId: string;
  roomId: string;
  userId: string;
  info: models.ParticipantRTInfo;
};

export const pushUserParticipantRTInfo =
  createAction<PushUserParticipantRTInfoPayload>(
    'arty/pushUserParticipantRTInfo'
  );

export type ClearUserParticipantRTInfoPayload = {
  teamId: string;
  roomId: string;
  userId: string;
};

export const clearUserParticipantRTInfo =
  createAction<ClearUserParticipantRTInfoPayload>(
    'arty/clearUserParticipantRTInfo'
  );

export type PushUserOnlineRTInfo = {
  teamId: string;
  userId: string;
};

export const pushUserOnlineRTInfo = createAction<PushUserOnlineRTInfo>(
  'arty/pushUserOnlineRTInfo'
);

export type ClearUserOnlineRTInfo = {
  teamId: string;
  userId: string;
};

export const clearUserOnlineRTInfo = createAction<ClearUserOnlineRTInfo>(
  'arty/clearUserOnlineRTInfo'
);
