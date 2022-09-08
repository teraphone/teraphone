/* eslint-disable no-console */
import * as React from 'react';
import { RoomConnectOptions, ConnectionState } from 'livekit-client';
import {
  CircularProgress,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
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
        component="li"
        dense
        onClick={handleClick}
        selected={isThisRoomConnected}
        sx={{
          py: 0.5,
          '&.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: grey[200],
          },
        }}
      >
        <ListItemIcon>
          {currentRoom.roomId === roomInfo.room.id &&
          (connectionStatus === ConnectionStatus.Connecting ||
            connectionStatus === ConnectionStatus.Reconnecting) ? (
            <CircularProgress size={20} />
          ) : (
            <>
              {currentRoom.roomId === roomInfo.room.id &&
              connectionStatus === ConnectionStatus.Connected ? (
                <VolumeUpIcon
                  color="success"
                  sx={{
                    fontSize: 20,
                    filter:
                      'drop-shadow(0 -0.5px 0 rgba(0, 0, 0, 0.5)) drop-shadow(0 1px 0px white)',
                  }}
                />
              ) : (
                <VolumeUpIcon sx={{ fontSize: 20 }} />
              )}
            </>
          )}
        </ListItemIcon>
        <ListItemText primary={roomInfo.room.displayName} />
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
