import { createListenerMiddleware } from '@reduxjs/toolkit';
import { onValue, ref } from 'firebase/database';
import {
  addParticipantRTListener,
  setGroup,
  unknownParticipant,
} from './ArtySlice';
import * as models from '../models/models';
import { getGroupUserInfo, getRoomUserInfo } from './WorldSlice';
import type { RootState } from './store';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: addParticipantRTListener,
  effect: (action, listenerApi) => {
    const { db, groupId } = action.payload;
    const nodeRef = ref(db, `participants/${groupId}`);
    onValue(nodeRef, (snapshot) => {
      const rooms = snapshot.val() as models.ParticipantRTRooms;
      listenerApi.dispatch(setGroup({ groupId, rooms }));
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