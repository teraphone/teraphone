import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import type { RootState } from './store';
import * as models from '../models/models';
import { GetWorld, GetGroupUser, GetRoomUser } from '../requests/requests';

type WorldState = {
  groups: models.GroupsInfo;
};

const initialState: WorldState = {
  groups: [] as models.GroupsInfo,
};

export const getWorld = createAsyncThunk(
  'world/getWorld',
  async (client: AxiosInstance) => {
    const response = await GetWorld(client);
    return response.data.groups_info as models.GroupsInfo;
  }
);

type GetGroupUserInfoAsyncThunkArgs = {
  client: AxiosInstance;
  groupId: number;
  userId: number;
};

export const getGroupUserInfo = createAsyncThunk(
  'world/getGroupUserInfo',
  async (args: GetGroupUserInfoAsyncThunkArgs) => {
    const { client, groupId, userId } = args;
    const response = await GetGroupUser(client, groupId, userId);
    return response.data.group_user as models.GroupUserInfo;
  }
);

type GetRoomUserInfoAsyncThunkArgs = {
  client: AxiosInstance;
  groupId: number;
  roomId: number;
  userId: number;
};

export const getRoomUserInfo = createAsyncThunk(
  'world/getRoomUserInfo',
  async (args: GetRoomUserInfoAsyncThunkArgs) => {
    const { client, groupId, roomId, userId } = args;
    const response = await GetRoomUser(client, groupId, roomId, userId);
    return response.data.room_user as models.RoomUserInfo;
  }
);

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

    builder.addCase(getGroupUserInfo.fulfilled, (state, action) => {
      const { groupId } = action.meta.arg;
      state.groups = state.groups.map((groupInfo) => {
        if (groupInfo.group.id === groupId) {
          groupInfo.users.push(action.payload);
        }
        return groupInfo;
      });
    });

    builder.addCase(getRoomUserInfo.fulfilled, (state, action) => {
      const { groupId, roomId } = action.meta.arg;
      state.groups = state.groups.map((groupInfo) => {
        if (groupInfo.group.id === groupId) {
          groupInfo.rooms = groupInfo.rooms.map((roomInfo) => {
            if (roomInfo.room.id === roomId) {
              roomInfo.users.push(action.payload);
            }
            return roomInfo;
          });
        }
        return groupInfo;
      });
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
