/* eslint-disable no-console */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BatchRequestStep,
  BatchRequestContent,
  BatchResponseContent,
} from '@microsoft/microsoft-graph-client';
import type { RootState } from './store';
import msGraphClient, { b64toBlob, blobToBase64 } from '../api/graphClient';

export type TeamAvatars = { [teamId: string]: string };

export type UserAvatars = { [userId: string]: string };

type AvatarState = {
  teams: TeamAvatars;
  users: UserAvatars;
};

const initialState: AvatarState = {
  teams: {} as TeamAvatars,
  users: {} as UserAvatars,
};

export const getUserPhotos = createAsyncThunk(
  'avatars/getUserPhotos',
  async (userIds: string[], thunkApi) => {
    const userPhotos = {} as UserAvatars;
    const { avatars } = thunkApi.getState() as RootState;
    const userIdsToFetch = userIds.filter((userId) => !avatars.users[userId]);
    try {
      // create batch request steps for users
      const batchRequestSteps: BatchRequestStep[] = userIdsToFetch.map(
        (userId) => ({
          id: userId,
          request: new Request(`/users/${userId}/photo/$value`, {
            method: 'GET',
          }),
        })
      );
      const batchRequestContent = new BatchRequestContent(batchRequestSteps);
      const content = await batchRequestContent.getContent();
      const batchResponse = new BatchResponseContent(
        await msGraphClient.api('/batch').post(content)
      );
      batchResponse.getResponses().forEach(async (response, id) => {
        if (response.ok) {
          const data = await response.text();
          const binToBlob = await b64toBlob(data, 'img/jpg');
          const base64Result = await blobToBase64(binToBlob);
          userPhotos[id] = base64Result;
        }
      });
    } catch (error) {
      console.error(error);
    }
    return userPhotos;
  }
);

export const avatarSlice = createSlice({
  name: 'avatars',
  initialState,
  reducers: {
    setTeamAvatars: (state, action: PayloadAction<TeamAvatars>) => {
      state.teams = action.payload;
    },
    setUserAvatars: (state, action: PayloadAction<UserAvatars>) => {
      state.users = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserPhotos.fulfilled, (state, action) => {
      state.users = { ...state.users, ...action.payload };
    });
  },
});

export const { setTeamAvatars, setUserAvatars } = avatarSlice.actions;

export const selectTeamAvatars = (state: RootState) => state.avatars.teams;

export const selectUserAvatars = (state: RootState) => state.avatars.users;

export default avatarSlice.reducer;
