import { createListenerMiddleware } from '@reduxjs/toolkit';
import { onValue, ref } from 'firebase/database';
import {
  addParticipantRTListener,
  addOnlineRTListener,
  setParticipantsGroup,
  setOnlineGroup,
  unknownParticipant,
} from './ArtySlice';
import * as models from '../models/models';
import { getGroupUserInfo, getRoomUserInfo } from './WorldSlice';
import type { RootState } from './store';
import { database } from './Firebase';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: addParticipantRTListener,
  effect: (action, listenerApi) => {
    const { groupId } = action.payload;
    const nodeRef = ref(database, `participants/${groupId}`);
    onValue(nodeRef, (snapshot) => {
      const rooms = snapshot.val() as models.ParticipantRTRooms;
      listenerApi.dispatch(setParticipantsGroup({ groupId, rooms }));
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: addOnlineRTListener,
  effect: (action, listenerApi) => {
    const { db, groupId } = action.payload;
    const nodeRef = ref(db, `online/${groupId}`);
    onValue(nodeRef, (snapshot) => {
      const users = snapshot.val() as models.OnlineRTUsers;
      listenerApi.dispatch(setOnlineGroup({ groupId, users }));
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: unknownParticipant,
  effect: (action, listenerApi) => {
    const { client, groupId, userId } = action.payload;
    listenerApi.dispatch(getGroupUserInfo({ client, groupId, userId }));
    const state = listenerApi.getState() as RootState;
    const { rooms } = state.world.groups.find(
      (groupInfo) => groupInfo.group.id === groupId
    ) as models.GroupInfo;
    rooms.forEach((roomInfo) => {
      const { id: roomId } = roomInfo.room;
      listenerApi.dispatch(
        getRoomUserInfo({ client, groupId, roomId, userId })
      );
    });
  },
});

export default listenerMiddleware;
