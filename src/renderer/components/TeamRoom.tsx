/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { RoomConnectOptions, ConnectionState } from 'livekit-client';
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
import { selectMute } from '../redux/MuteSlice';

function TeamRoom(props: {
  teamInfo: models.TeamInfo;
  roomInfo: models.RoomInfoType;
  usersObj: { [oid: string]: models.TenantUser };
}) {
  const { teamInfo, roomInfo, usersObj } = props;
  const url = 'wss://sfu-demo.teraphone.app';
  const { connect, room } = useRoom();
  const { currentRoom } = useAppSelector(selectCurrentRoom);
  const { connectionStatus } = useAppSelector(selectConnectionStatus);
  const dispatch = useAppDispatch();

  const isThisRoomConnected =
    currentRoom.roomId === roomInfo.room.id &&
    connectionStatus === ConnectionStatus.Connected;
  const isVideoWindowOpen = useAppSelector(selectWindowOpen);
  const mute = useAppSelector(selectMute);

  React.useEffect(() => {
    console.log('TeamRoom', roomInfo.room.displayName, 'Mounted');
    return () =>
      console.log('TeamRoom', roomInfo.room.displayName, 'Unmounted');
  }, [roomInfo.room.displayName]);

  const connectRoom = React.useCallback(async () => {
    const roomConnectOptions: RoomConnectOptions = {
      autoSubscribe: true,
    };
    // set current room to this room
    dispatch(
      setCurrentRoom({
        roomId: roomInfo.room.id,
        roomName: roomInfo.room.displayName,
        teamId: roomInfo.room.teamId,
        teamName: teamInfo.team.displayName,
      })
    );
    // connect to room
    try {
      const livekitRoom = await connect(
        url,
        roomInfo.roomToken,
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
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    connect,
    dispatch,
    mute,
    roomInfo.room.displayName,
    roomInfo.room.id,
    roomInfo.room.teamId,
    roomInfo.roomToken,
    teamInfo.team.displayName,
  ]);

  const handleClick = React.useCallback(async () => {
    console.log(`clicked room ${roomInfo.room.id}`, roomInfo);

    // if changing rooms: disconnect first, then connect
    if (currentRoom.roomId !== roomInfo.room.id) {
      if (connectionStatus === ConnectionStatus.Connected) {
        console.log(
          `disconnecting from room ${currentRoom.roomId} and connecting to room ${roomInfo.room.id}`
        );
        if (room) {
          await room.disconnect();
        }
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
        <ListItemText primary={roomInfo.room.displayName} />
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

export default TeamRoom;

// todo: changing rooms rapidly can get you into a state where you're connected to multiple rooms.
// need understand how this can happen and how to prevent it.
