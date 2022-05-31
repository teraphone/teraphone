/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import * as Livekit from 'livekit-client';
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
import { selectCurrentRoom, setCurrentRoom } from '../redux/CurrentRoomSlice';
import { setWindowOpen, selectWindowOpen } from '../redux/VideoViewSlice';

function GroupRoom(props: {
  groupInfo: models.GroupInfo;
  roomInfo: models.RoomInfo;
  usersObj: { [id: number]: models.GroupUserInfo };
}) {
  const { groupInfo, roomInfo, usersObj } = props;
  const url = 'wss://demo.dally.app';
  const { connect, room } = useRoom();
  const { currentRoom } = useAppSelector(selectCurrentRoom);
  const { connectionStatus } = useAppSelector(selectConnectionStatus);
  const dispatch = useAppDispatch();
  const thisRoom =
    currentRoom.roomId === roomInfo.room.id &&
    connectionStatus === ConnectionStatus.Connected;
  const isVideoWindowOpen = useAppSelector(selectWindowOpen);

  React.useEffect(() => {
    console.log('GroupRoom', roomInfo.room.name, 'Mounted');
    return () => console.log('GroupRoom', roomInfo.room.name, 'Unmounted');
  }, [roomInfo.room.name]);

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
        livekitRoom?.localParticipant.setMicrophoneEnabled(true);
        return true;
      })
      .catch(() => {
        return false;
      });
  }, [
    connect,
    dispatch,
    groupInfo.group.name,
    roomInfo.room.group_id,
    roomInfo.room.id,
    roomInfo.room.name,
    roomInfo.token,
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
  }, [connectRoom, connectionStatus, currentRoom.roomId, room, roomInfo]);

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
        {thisRoom &&
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
