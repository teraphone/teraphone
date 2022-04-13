/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import * as Livekit from 'livekit-client';
import { remove, update, child, ref } from 'firebase/database';
import * as React from 'react';
import * as models from '../models/models';
import RoomParticipants from './RoomParticipants';
import useRoom from '../hooks/useRoom';
import {
  ConnectionStatus,
  selectConnectionStatus,
} from '../redux/ConnectionStatusSlice';
import useFirebase from '../hooks/useFirebase';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectAppUser } from '../redux/AppUserSlice';
import PeekRoomParticipants from './PeekRoomParticipants';
import { selectMute, selectDeafen } from '../redux/MuteSlice';
import { selectCurrentRoom, setCurrentRoom } from '../redux/CurrentRoomSlice';

const useUserMap = (users: models.GroupUserInfo[]) => {
  const userMap = new Map<string, models.GroupUserInfo>();
  users.forEach((userinfo: models.GroupUserInfo) => {
    const { user_id: id } = userinfo;
    userMap.set(`${id}`, userinfo);
  });

  return userMap;
};

function GroupRoom(props: {
  groupInfo: models.GroupInfo;
  roomInfo: models.RoomInfo;
}) {
  const useUserMapMemo = React.useCallback(useUserMap, []);
  const { groupInfo, roomInfo } = props;
  const { users } = groupInfo;
  const userMap = useUserMapMemo(users);
  const groupId = roomInfo.room.group_id;
  const { id: roomId } = roomInfo.room;
  const connectConfig: Livekit.ConnectOptions = {
    autoSubscribe: false,
    adaptiveStream: true,
    autoManageVideo: true,
    dynacast: true,
    audio: true,
    video: false,
  };
  const url = 'wss://demo.dally.app';
  const { connect, room } = useRoom();
  const { currentRoom } = useAppSelector(selectCurrentRoom);
  const { connectionStatus } = useAppSelector(selectConnectionStatus);
  const { database } = useFirebase();
  const { appUser } = useAppSelector(selectAppUser);
  const roomRTRef = ref(database, `participants/${groupId}/${roomId}`);
  const mute = useAppSelector(selectMute);
  const deafen = useAppSelector(selectDeafen);
  const dispatch = useAppDispatch();

  const pushUserRTInfo = (isMuted: boolean, isDeafened: boolean) => {
    const nodeRef = child(roomRTRef, `${appUser.id}`);
    console.log('pushing RT node:', nodeRef);
    update(nodeRef, {
      isMuted,
      isDeafened,
      isCameraShare: false,
      isScreenShare: false,
    });
  };

  const removeUserRTInfo = () => {
    const nodeRef = ref(
      database,
      `participants/${currentRoom.groupId}/${currentRoom.roomId}/${appUser.id}`
    );
    console.log('removing RT node:', nodeRef);
    remove(nodeRef);
  };

  const handleClick = () => {
    const connectRoom = () => {
      // set current room to this room
      dispatch(
        setCurrentRoom({
          roomId: roomInfo.room.id,
          roomName: roomInfo.room.name,
          groupId: roomInfo.room.group_id,
          groupName: groupInfo.group.name,
        })
      );
      // connect to room
      connect(url, roomInfo.token, connectConfig)
        .then((livekitRoom) => {
          console.log(`connected to room ${roomInfo.room.id}`, livekitRoom);
          if (livekitRoom) {
            pushUserRTInfo(mute, deafen);
          }
          return true;
        })
        .catch(() => {
          return false;
        });
    };

    console.log(`clicked room ${roomInfo.room.id}`, roomInfo);

    // if changing rooms: disconnect first, then connect
    if (currentRoom.roomId !== roomInfo.room.id) {
      if (connectionStatus === ConnectionStatus.Connected) {
        console.log(
          `disconnecting from room ${currentRoom.roomId} and connecting to room ${roomInfo.room.id}`
        );
        room?.disconnect();
        removeUserRTInfo();
        connectRoom();
      } else if (connectionStatus === ConnectionStatus.Connecting) {
        console.log(`already trying to connect to room ${currentRoom.roomId}`);
      } else {
        console.log(`connecting to room ${roomInfo.room.id}`);
        connectRoom();
      }
    } else if (currentRoom.roomId === roomInfo.room.id) {
      if (connectionStatus === ConnectionStatus.Connected) {
        console.log(`already connected to room ${roomInfo.room.id}`);
      } else if (connectionStatus === ConnectionStatus.Connecting) {
        console.log(`already connecting to room ${roomInfo.room.id}`);
      } else {
        console.log(`connecting to room ${roomInfo.room.id}`);
        connectRoom();
      }
    }
  };

  const thisRoom =
    currentRoom.roomId === roomInfo.room.id &&
    connectionStatus === ConnectionStatus.Connected;

  return (
    <>
      <ListItemButton
        dense
        onClick={handleClick}
        component="li"
        sx={{ py: 0.5 }}
      >
        <ListItemIcon>
          <VolumeUpIcon sx={{ fontSize: 20 }} />
        </ListItemIcon>
        <ListItemText primary={roomInfo.room.name} />
      </ListItemButton>
      <div hidden={!thisRoom}>
        <RoomParticipants roomInfo={roomInfo} userMap={userMap} />
      </div>
      <div hidden={thisRoom}>
        <PeekRoomParticipants roomInfo={roomInfo} userMap={userMap} />
      </div>
    </>
  );
}

export default React.memo(GroupRoom);

// todo: changing rooms rapidly can get you into a state where you're connected to multiple rooms.
// need understand how this can happen and how to prevent it.
