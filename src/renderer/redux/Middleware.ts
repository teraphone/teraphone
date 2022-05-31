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
import { ConnectionStatus } from './ConnectionStatusSlice';

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

// on connectionStatus change, push/clear UserParticipantRTInfo
listenerMiddleware.startListening({
  predicate: (_action, currentState, previousState) => {
    const { connectionStatus: currentConnectionStatus } = (
      currentState as RootState
    ).connectionStatus;
    const { connectionStatus: previousConnectionStatus } = (
      previousState as RootState
    ).connectionStatus;
    const case1 =
      currentConnectionStatus === ConnectionStatus.Connected &&
      previousConnectionStatus !== ConnectionStatus.Connected;
    const case2 =
      currentConnectionStatus !== ConnectionStatus.Connected &&
      previousConnectionStatus === ConnectionStatus.Connected;
    return case1 || case2;
  },
  effect: (action, listenerApi) => {
    const connectionStatus = action.payload;
    const state = listenerApi.getState() as RootState;
    const { groupId, roomId } = state.currentRoom.currentRoom;
    const { id: userId } = state.appUser.appUser;
    const { mute, deafen } = state.mute;
    const { isSharing } = state.screenShare;
    if (connectionStatus === ConnectionStatus.Connected) {
      const info: models.ParticipantRTInfo = {
        isMuted: mute,
        isDeafened: deafen,
        isCameraShare: false,
        isScreenShare: isSharing,
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

// on mute/deafen/screenShare change, pushUserParticipantRTInfo if connected
listenerMiddleware.startListening({
  predicate: (_action, currentState, previousState) => {
    const { mute: currentMute, deafen: currentDeafen } = (
      currentState as RootState
    ).mute;
    const { mute: previousMute, deafen: previousDeafen } = (
      previousState as RootState
    ).mute;
    const { isSharing: currentIsSharing } = (currentState as RootState)
      .screenShare;
    const { isSharing: previousIsSharing } = (previousState as RootState)
      .screenShare;
    const { connectionStatus } = (currentState as RootState).connectionStatus;
    const case1 = currentMute !== previousMute;
    const case2 = currentDeafen !== previousDeafen;
    const case3 = currentIsSharing !== previousIsSharing;
    const case4 = connectionStatus === ConnectionStatus.Connected;
    return (case1 || case2 || case3) && case4;
  },
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const { groupId, roomId } = state.currentRoom.currentRoom;
    const { id: userId } = state.appUser.appUser;
    const { mute, deafen } = state.mute;
    const { isSharing } = state.screenShare;
    const info: models.ParticipantRTInfo = {
      isMuted: mute,
      isDeafened: deafen,
      isCameraShare: false,
      isScreenShare: isSharing,
    };
    listenerApi.dispatch(
      pushUserParticipantRTInfo({
        groupId: groupId.toString(),
        roomId: roomId.toString(),
        userId: userId.toString(),
        info,
      })
    );
  },
});

export default listenerMiddleware;
