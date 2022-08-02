/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { createListenerMiddleware } from '@reduxjs/toolkit';
import {
  onValue,
  ref,
  remove,
  update,
  onDisconnect,
  child,
} from 'firebase/database';
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
  signedIn,
  signedOut,
} from './ArtySlice';
import { setCurrentRoom, setPreviousRoom } from './CurrentRoomSlice';
import * as models from '../models/models';
import { getWorld } from './WorldSlice';
import type { RootState } from './store';
import { database } from './Firebase';
import { ConnectionStatus } from './ConnectionStatusSlice';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: addParticipantRTListener,
  effect: (action, listenerApi) => {
    const { teamId } = action.payload;
    const nodeRef = ref(database, `participants/${teamId}`);
    onValue(nodeRef, (snapshot) => {
      const rooms = snapshot.val() as models.ParticipantRTRooms;
      listenerApi.dispatch(setParticipantsGroup({ teamId, rooms }));
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: addOnlineRTListener,
  effect: (action, listenerApi) => {
    const { teamId } = action.payload;
    const nodeRef = ref(database, `online/${teamId}`);
    onValue(nodeRef, (snapshot) => {
      const users = snapshot.val() as models.OnlineRTUsers;
      listenerApi.dispatch(setOnlineGroup({ teamId, users }));
    });
  },
});

listenerMiddleware.startListening({
  actionCreator: unknownParticipant,
  effect: (action, listenerApi) => {
    console.log('unknownParticipant', action.payload);
    const { client } = action.payload;
    listenerApi.dispatch(getWorld(client)); // todo: this is inefficient
  },
});

listenerMiddleware.startListening({
  actionCreator: pushUserParticipantRTInfo,
  effect: (action, _listenerApi) => {
    const { teamId, roomId, userId, info } = action.payload;
    const nodeRef = ref(database, `participants/${teamId}/${roomId}/${userId}`);
    console.log('pushing Participants RT node:', nodeRef, info);
    update(nodeRef, info); // await?
    onDisconnect(nodeRef).remove();
  },
});

listenerMiddleware.startListening({
  actionCreator: clearUserParticipantRTInfo,
  effect: (action, _listenerApi) => {
    const { teamId, roomId, userId } = action.payload;
    const nodeRef = ref(database, `participants/${teamId}/${roomId}/${userId}`);
    console.log('clearing Participants RT node:', nodeRef);
    remove(nodeRef); // await?
  },
});

listenerMiddleware.startListening({
  actionCreator: pushUserOnlineRTInfo,
  effect: (action, _listenerApi) => {
    const { teamId, userId } = action.payload;
    const nodeRef = ref(database, `online/${teamId}`);
    console.log('pushing Online RT node:', nodeRef, userId);
    update(nodeRef, { [userId]: true }); // await?
    onDisconnect(child(nodeRef, userId)).remove();
  },
});

listenerMiddleware.startListening({
  actionCreator: clearUserOnlineRTInfo,
  effect: (action, _listenerApi) => {
    const { teamId, userId } = action.payload;
    const nodeRef = ref(database, `online/${teamId}/${userId}`);
    console.log('clearing Online RT node:', nodeRef);
    remove(nodeRef); // await?
  },
});

// on currentRoom change, set previousRoom to currentRoom
listenerMiddleware.startListening({
  actionCreator: setCurrentRoom,
  effect: (_action, listenerApi) => {
    const { currentRoom } = (listenerApi.getOriginalState() as RootState)
      .currentRoom;
    listenerApi.dispatch(setPreviousRoom({ ...currentRoom }));
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
    const { teamId, roomId } = state.currentRoom.currentRoom;
    const { teamId: previousTeamId, roomId: previousRoomId } =
      state.currentRoom.previousRoom;
    const { oid: userId } = state.appUser.tenantUser;
    const { mute, deafen } = state.mute;
    const { isSharing } = state.screenShare;
    const info: models.ParticipantRTInfo = {
      isMuted: mute,
      isDeafened: deafen,
      isCameraShare: false,
      isScreenShare: isSharing,
    };
    switch (connectionStatus) {
      case ConnectionStatus.Connected:
        listenerApi.dispatch(
          pushUserParticipantRTInfo({
            teamId,
            roomId,
            userId,
            info,
          })
        );
        break;

      case ConnectionStatus.Connecting:
        listenerApi.dispatch(
          clearUserParticipantRTInfo({
            teamId: previousTeamId,
            roomId: previousRoomId,
            userId,
          })
        );
        break;

      default:
        listenerApi.dispatch(
          clearUserParticipantRTInfo({
            teamId,
            roomId,
            userId,
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
    const { teamId, roomId } = state.currentRoom.currentRoom;
    const { oid: userId } = state.appUser.tenantUser;
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
        teamId,
        roomId,
        userId,
        info,
      })
    );
  },
});

// on signedIn, push UserOnlineRTInfo, add Participant and Online RTListeners
listenerMiddleware.startListening({
  actionCreator: signedIn,
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const { teams } = state.world;
    const { oid: userId } = state.appUser.tenantUser;
    teams.forEach((teamInfo) => {
      const { id: teamId } = teamInfo.team;
      listenerApi.dispatch(
        addParticipantRTListener({
          teamId,
        })
      );
      listenerApi.dispatch(
        addOnlineRTListener({
          teamId,
        })
      );
      listenerApi.dispatch(
        pushUserOnlineRTInfo({
          teamId,
          userId,
        })
      );
    });
  },
});

// on signedOut, clear UserOnlineRTInfo
listenerMiddleware.startListening({
  actionCreator: signedOut,
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const { teams } = state.world;
    const { oid: userId } = state.appUser.tenantUser;
    teams.forEach((teamInfo) => {
      const { id: teamId } = teamInfo.team;
      listenerApi.dispatch(
        clearUserOnlineRTInfo({
          teamId,
          userId,
        })
      );
    });
  },
});

export default listenerMiddleware;
