import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import type { RootState } from './store';
import * as models from '../models/models';
import { GetWorld } from '../requests/requests';

type WorldState = {
  teams: models.TeamInfo[];
};

const initialState: WorldState = {
  teams: [] as models.TeamInfo[],
};

export const getWorld = createAsyncThunk(
  'world/getWorld',
  async (client: AxiosInstance) => {
    const response = await GetWorld(client);
    return response.data.teams as models.TeamInfo[];
  }
);

export const worldSlice = createSlice({
  name: 'world',
  initialState,
  reducers: {
    setTeams: (state, action: PayloadAction<models.TeamInfo[]>) => {
      state.teams = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getWorld.fulfilled, (state, action) => {
      state.teams = action.payload;
    });
  },
});

export const { setTeams } = worldSlice.actions;

export const selectTeams = (state: RootState) => state.world.teams;

export const selectTeam = (state: RootState, teamId: string) => {
  const teams = selectTeams(state);
  const team = teams.find((teamInfo) => teamInfo.team.id === teamId);
  return team;
};

export const selectRooms = (state: RootState, teamId: string) => {
  const teamInfo = selectTeam(state, teamId);
  if (teamInfo) {
    return teamInfo.rooms;
  }
  return [] as models.RoomInfoType[];
};

export const selectRoom = (
  state: RootState,
  teamId: string,
  roomId: string
) => {
  const rooms = selectRooms(state, teamId);
  const room = rooms.find((roomInfo) => roomInfo.room.id === roomId);
  return room;
};

export default worldSlice.reducer;
