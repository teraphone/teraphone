/* eslint-disable no-restricted-syntax */
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
    const { avatars } = thunkApi.getState() as RootState;
    const userIdsToFetch = userIds.filter((userId) => !avatars.users[userId]);
    try {
      const userPhotos = {} as UserAvatars;

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
        await msGraphClient.api('/$batch').post(content)
      );

      for await (const [id, response] of batchResponse.getResponses()) {
        if (response.ok) {
          const data = await response.text();
          const binToBlob = await b64toBlob(data, 'img/jpg');
          const base64Result = await blobToBase64(binToBlob);
          userPhotos[id] = base64Result;
        }
      }

      return userPhotos;
    } catch (error) {
      console.error(error);
    }

    return {} as UserAvatars;
  }
);

export const getTeamPhotos = createAsyncThunk(
  'avatars/getTeamPhotos',
  async (teamIds: string[], thunkApi) => {
    const { avatars } = thunkApi.getState() as RootState;
    const teamIdsToFetch = teamIds.filter((teamId) => !avatars.teams[teamId]);
    try {
      const teamPhotos = {} as TeamAvatars;

      // create batch request steps for teams
      const batchRequestSteps: BatchRequestStep[] = teamIdsToFetch.map(
        (teamId) => ({
          id: teamId,
          request: new Request(`/teams/${teamId}/photo/$value`, {
            method: 'GET',
          }),
        })
      );
      const batchRequestContent = new BatchRequestContent(batchRequestSteps);
      const content = await batchRequestContent.getContent();
      const batchResponse = new BatchResponseContent(
        await msGraphClient.api('/$batch').post(content)
      );

      for await (const [id, response] of batchResponse.getResponses()) {
        if (response.ok) {
          const data = await response.text();
          const binToBlob = await b64toBlob(data, 'img/jpg');
          const base64Result = await blobToBase64(binToBlob);
          teamPhotos[id] = base64Result;
        }
      }

      return teamPhotos;
    } catch (error) {
      console.error(error);
    }

    return {} as TeamAvatars;
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
    builder.addCase(getTeamPhotos.fulfilled, (state, action) => {
      state.teams = { ...state.teams, ...action.payload };
    });
  },
});

export const { setTeamAvatars, setUserAvatars } = avatarSlice.actions;

export const selectTeamAvatars = (state: RootState) => state.avatars.teams;

export const selectUserAvatars = (state: RootState) => state.avatars.users;

export default avatarSlice.reducer;
