/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { createListenerMiddleware } from '@reduxjs/toolkit';
import { onValue, ref, remove, update } from 'firebase/database';
import {
  addParticipantRTListener,
  addOnlineRTListener,
  setParticipantsGroup,
  setOnlineGroup,
  unknownParticipant,
  pushUserParticipantRTInfo,
  clearUserParticipantRTInfo,
  pushUserOnlineRTInfo,
  clearUserOnlineRTInfo,
} from './ArtySlice';
import * as models from '../models/models';
import { getGroupUserInfo, getRoomUserInfo } from './WorldSlice';
import type { RootState } from './store';
import { database } from './Firebase';
import { ConnectionStatus, setConnectionStatus } from './ConnectionStatusSlice';

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
    const { groupId } = action.payload;
    const nodeRef = ref(database, `online/${groupId}`);
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

listenerMiddleware.startListening({
  actionCreator: pushUserParticipantRTInfo,
  effect: (action, _listenerApi) => {
    const { groupId, roomId, userId, info } = action.payload;
    const nodeRef = ref(
      database,
      `participants/${groupId}/${roomId}/${userId}`
    );
    console.log('pushing Participants RT node:', nodeRef, info);
    update(nodeRef, info); // await?
  },
});

listenerMiddleware.startListening({
  actionCreator: clearUserParticipantRTInfo,
  effect: (action, _listenerApi) => {
    const { groupId, roomId, userId } = action.payload;
    const nodeRef = ref(
      database,
      `participants/${groupId}/${roomId}/${userId}`
    );
    console.log('clearing Participants RT node:', nodeRef);
    remove(nodeRef); // await?
  },
});

listenerMiddleware.startListening({
  actionCreator: pushUserOnlineRTInfo,
  effect: (action, _listenerApi) => {
    const { groupId, userId } = action.payload;
    const nodeRef = ref(database, `online/${groupId}`);
    console.log('pushing Online RT node:', nodeRef, userId);
    update(nodeRef, { [userId]: true }); // await?
  },
});

listenerMiddleware.startListening({
  actionCreator: clearUserOnlineRTInfo,
  effect: (action, _listenerApi) => {
    const { groupId, userId } = action.payload;
    const nodeRef = ref(database, `online/${groupId}/${userId}`);
    console.log('clearing Online RT node:', nodeRef);
    remove(nodeRef); // await?
  },
});

listenerMiddleware.startListening({
  actionCreator: setConnectionStatus,
  effect: (action, listenerApi) => {
    const connectionStatus = action.payload;
    const state = listenerApi.getState() as RootState;
    const { appUser, currentRoom, mute, screenShare } = state;
    const { groupId, roomId } = currentRoom.currentRoom;
    const { id: userId } = appUser.appUser;
    if (connectionStatus === ConnectionStatus.Connected) {
      const info: models.ParticipantRTInfo = {
        isMuted: mute.mute,
        isDeafened: mute.deafen,
        isCameraShare: false,
        isScreenShare: screenShare.isSharing,
      };
      listenerApi.dispatch(
        pushUserParticipantRTInfo({
          groupId: groupId.toString(),
          roomId: roomId.toString(),
          userId: userId.toString(),
          info,
        })
      );
    } else {
      listenerApi.dispatch(
        clearUserParticipantRTInfo({
          groupId: groupId.toString(),
          roomId: roomId.toString(),
          userId: userId.toString(),
        })
      );
    }
  },
});

export default listenerMiddleware;
