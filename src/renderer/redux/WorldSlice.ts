import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from './store';
import * as models from '../models/models';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { GetWorld } from '../requests/requests';

type WorldState = {
  groups: models.GroupsInfo;
};

const initialState: WorldState = {
  groups: [] as models.GroupsInfo,
};

export const getWorld = createAsyncThunk('world/getWorld', async () => {
  const axiosPrivate = useAxiosPrivate();
  const response = await GetWorld(axiosPrivate);
  return response.data as models.GroupsInfo;
});

export const worldSlice = createSlice({
  name: 'world',
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<models.GroupsInfo>) => {
      state.groups = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getWorld.fulfilled, (state, action) => {
      state.groups = action.payload;
    });
  },
});

export const { setGroups } = worldSlice.actions;

export const selectGroups = (state: RootState) => state.world.groups;

export const selectGroup = (state: RootState, group_id: number) => {
  const groups = selectGroups(state);
  const group = groups.find((groupInfo) => groupInfo.group.id === group_id);
  return group;
};

export const selectRooms = (state: RootState, group_id: number) => {
  const group = selectGroup(state, group_id);
  if (group) {
    return group.rooms;
  }
  return [] as models.RoomsInfo;
};

export const selectRoom = (
  state: RootState,
  group_id: number,
  room_id: number
) => {
  const rooms = selectRooms(state, group_id);
  const room = rooms.find((roomInfo) => roomInfo.room.id === room_id);
  return room;
};

export default worldSlice.reducer;
