/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import * as Livekit from 'livekit-client';
import { remove, update, child, ref } from 'firebase/database';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
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
import { setWindowOpen } from '../redux/VideoViewSlice';
import { selectIsSharing } from '../redux/ScreenShareSlice';

function GroupRoom(props: {
  groupInfo: models.GroupInfo;
  roomInfo: models.RoomInfo;
  usersObj: { [id: number]: models.GroupUserInfo };
}) {
  const { groupInfo, roomInfo, usersObj } = props;
  const groupId = roomInfo.room.group_id;
  const { id: roomId } = roomInfo.room;
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
  const isScreenSharing = useAppSelector(selectIsSharing);
  const thisRoom =
    currentRoom.roomId === roomInfo.room.id &&
    connectionStatus === ConnectionStatus.Connected;

  React.useEffect(() => {
    console.log('GroupRoom', roomInfo.room.name, 'Mounted');
    return () => console.log('GroupRoom', roomInfo.room.name, 'Unmounted');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushUserRTInfo = React.useCallback(
    (isMuted: boolean, isDeafened: boolean, isScreenShare: boolean) => {
      const nodeRef = child(roomRTRef, `${appUser.id}`);
      const info = {
        isMuted,
        isDeafened,
        isCameraShare: false,
        isScreenShare,
      };
      console.log('pushing RT node:', nodeRef, info);
      update(nodeRef, info);
    },
    [appUser.id, roomRTRef]
  );

  React.useEffect(() => {
    if (thisRoom) {
      pushUserRTInfo(mute, deafen, isScreenSharing);
    }
  }, [deafen, isScreenSharing, mute, pushUserRTInfo, thisRoom]);

  const removeUserRTInfo = React.useCallback(() => {
    const nodeRef = ref(
      database,
      `participants/${currentRoom.groupId}/${currentRoom.roomId}/${appUser.id}`
    );
    console.log('removing RT node:', nodeRef);
    remove(nodeRef);
  }, [appUser.id, currentRoom.groupId, currentRoom.roomId, database]);

  const connectRoom = React.useCallback(() => {
    const connectConfig: Livekit.ConnectOptions = {
      autoSubscribe: false,
      adaptiveStream: { pixelDensity: 'screen' },
      autoManageVideo: true,
      dynacast: false,
      audio: true,
      video: false,
    };
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
          pushUserRTInfo(mute, deafen, isScreenSharing);
        }
        livekitRoom?.localParticipant.setMicrophoneEnabled(true);
        return true;
      })
      .catch(() => {
        return false;
      });
  }, [
    connect,
    deafen,
    dispatch,
    groupInfo.group.name,
    mute,
    pushUserRTInfo,
    roomInfo.room.group_id,
    roomInfo.room.id,
    roomInfo.room.name,
    roomInfo.token,
    isScreenSharing,
  ]);

  const handleClick = React.useCallback(() => {
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
  }, [
    connectRoom,
    connectionStatus,
    currentRoom.roomId,
    removeUserRTInfo,
    room,
    roomInfo,
  ]);

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
        {/* todo: OndemandVideoIcon goes here */}
        {thisRoom && (
          <Tooltip title="Open Video Window" placement="top" arrow>
            <IconButton
              sx={{
                p: 0,
              }}
              size="small"
              aria-label="open video window"
              component="span"
              onClick={() => {
                console.log('clicked Open Video Window');
                dispatch(setWindowOpen(true));
              }}
            >
              <OndemandVideoIcon
                sx={{
                  color: 'black',
                }}
                fontSize="small"
              />
            </IconButton>
          </Tooltip>
        )}
      </ListItemButton>
      {thisRoom ? (
        <RoomParticipants roomInfo={roomInfo} usersObj={usersObj} />
      ) : (
        <PeekRoomParticipants roomInfo={roomInfo} usersObj={usersObj} />
      )}
    </>
  );
}

export default React.memo(GroupRoom);

// todo: changing rooms rapidly can get you into a state where you're connected to multiple rooms.
// need understand how this can happen and how to prevent it.
