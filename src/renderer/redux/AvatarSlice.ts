import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

export type TeamAvatars = { [teamId: string]: string };

export type UserAvatars = { [userId: string]: string };

type AvatarState = {
  teams: TeamAvatars;
  users: UserAvatars;
};

const initialState = {} as AvatarState;

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
});

export const { setTeamAvatars, setUserAvatars } = avatarSlice.actions;

export const selectTeamAvatars = (state: RootState) => state.avatars.teams;

export const selectUserAvatars = (state: RootState) => state.avatars.users;

export default avatarSlice.reducer;
