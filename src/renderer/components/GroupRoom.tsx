/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import {
  RoomConnectOptions,
  ConnectionState,
  LocalParticipant,
} from 'livekit-client';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation'; // close video window
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay'; // open video streams
import * as models from '../models/models';
import RoomParticipants from './RoomParticipants';
import useRoom from '../hooks/useRoom';
import {
  ConnectionStatus,
  selectConnectionStatus,
} from '../redux/ConnectionStatusSlice';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import PeekRoomParticipants from './PeekRoomParticipants';
import {
  CurrentRoomState,
  selectCurrentRoom,
  setCurrentRoom,
} from '../redux/CurrentRoomSlice';
import { setWindowOpen, selectWindowOpen } from '../redux/VideoViewSlice';
import { selectMute } from '../redux/MuteSlice';

function GroupRoom(props: {
  groupInfo: models.GroupInfo;
  roomInfo: models.RoomInfo;
  usersObj: { [id: number]: models.GroupUserInfo };
}) {
  const { groupInfo, roomInfo, usersObj } = props;
  const url = 'wss://sfu-demo.teraphone.app';
  const { connect, room } = useRoom();
  const { currentRoom } = useAppSelector(selectCurrentRoom);
  const { connectionStatus } = useAppSelector(selectConnectionStatus);
  const dispatch = useAppDispatch();
  const thisRoom: CurrentRoomState = React.useMemo(
    () => ({
      roomId: roomInfo.room.id,
      roomName: roomInfo.room.name,
      groupId: roomInfo.room.group_id,
      groupName: groupInfo.group.name,
    }),
    [
      groupInfo.group.name,
      roomInfo.room.group_id,
      roomInfo.room.id,
      roomInfo.room.name,
    ]
  );
  const isThisRoomConnected =
    currentRoom.roomId === thisRoom.roomId &&
    connectionStatus === ConnectionStatus.Connected;
  const isVideoWindowOpen = useAppSelector(selectWindowOpen);
  const mute = useAppSelector(selectMute);

  React.useEffect(() => {
    console.log('GroupRoom', roomInfo.room.name, 'Mounted');
    return () => console.log('GroupRoom', roomInfo.room.name, 'Unmounted');
  }, [roomInfo.room.name]);

  const connectRoom = React.useCallback(async () => {
    const roomConnectOptions: RoomConnectOptions = {
      autoSubscribe: false,
    };
    // set current room to this room
    dispatch(setCurrentRoom(thisRoom));
    // connect to room
    try {
      const livekitRoom = await connect(
        url,
        roomInfo.token,
        roomConnectOptions
      );
      if (
        livekitRoom?.state !==
        (ConnectionStatus.Connected as unknown as ConnectionState)
      ) {
        console.log('livekitRoom:', livekitRoom);
        throw Error(`Could not connect to room ${roomInfo.room.id}`);
      }
      console.log(`connected to room ${roomInfo.room.id}`, livekitRoom);
      // publish mic
      try {
        const micPublication =
          await livekitRoom?.localParticipant.setMicrophoneEnabled(true);
        if (mute) {
          micPublication?.audioTrack?.mute().catch(console.error);
        }
      } catch (error) {
        console.error('publish mic error:', error);
      }
    } catch (error) {
      console.error(error);
    }
  }, [connect, dispatch, mute, roomInfo.room.id, roomInfo.token, thisRoom]);

  const handleClick = React.useCallback(async () => {
    console.log(`clicked room ${thisRoom.roomId}`, roomInfo);

    // if changing rooms: disconnect first, then connect
    if (currentRoom.roomId !== thisRoom.roomId) {
      if (connectionStatus === ConnectionStatus.Connected) {
        console.log(
          `disconnecting from room ${currentRoom.roomId} and connecting to room ${thisRoom.roomId}`
        );
        if (room) {
          await room.disconnect();
          room.localParticipant = new LocalParticipant(
            room.localParticipant.sid,
            room.localParticipant.identity,
            room.localParticipant.engine,
            room.options
          );
        }
        connectRoom();
      } else if (connectionStatus === ConnectionStatus.Connecting) {
        console.log(`already trying to connect to room ${currentRoom.roomId}`);
      } else {
        console.log(`connecting to room ${thisRoom.roomId}`);
        connectRoom();
      }
    } else if (currentRoom.roomId === thisRoom.roomId) {
      if (connectionStatus === ConnectionStatus.Connected) {
        console.log(`already connected to room ${thisRoom.roomId}`);
      } else if (connectionStatus === ConnectionStatus.Connecting) {
        console.log(`already connecting to room ${thisRoom.roomId}`);
      } else {
        console.log(`connecting to room ${thisRoom.roomId}`);
        connectRoom();
      }
    }
  }, [
    connectRoom,
    connectionStatus,
    currentRoom.roomId,
    room,
    roomInfo,
    thisRoom.roomId,
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
        {isThisRoomConnected &&
          (!isVideoWindowOpen ? (
            <Tooltip title="Open Video Streams" placement="top" arrow>
              <IconButton
                sx={{
                  p: 0,
                }}
                size="small"
                aria-label="open video streams"
                component="span"
                onClick={() => {
                  console.log('clicked Open Video Streams');
                  dispatch(setWindowOpen(true));
                }}
              >
                <SmartDisplayIcon
                  sx={{
                    color: 'black',
                  }}
                  fontSize="small"
                />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Close Video Window" placement="top" arrow>
              <IconButton
                sx={{
                  p: 0,
                }}
                size="small"
                aria-label="close video window"
                component="span"
                onClick={() => {
                  console.log('clicked close Video Window');
                  dispatch(setWindowOpen(false));
                }}
              >
                <CancelPresentationIcon
                  sx={{
                    color: 'black',
                  }}
                  fontSize="small"
                />
              </IconButton>
            </Tooltip>
          ))}
      </ListItemButton>
      {isThisRoomConnected ? (
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
