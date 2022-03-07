/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupsIcon from '@mui/icons-material/Groups';
import * as React from 'react';
import * as Livekit from 'livekit-client';
import { useParticipant } from 'livekit-react';
import * as models from '../models/models';
import RoomParticipants from './RoomParticipants';
import useRoom from '../hooks/useRoom';

export type ActiveState = {
  activeRoom: number;
  setActiveRoom: (x: number) => void;
};

function GroupRoom(props: { roominfo: models.RoomInfo; active: ActiveState }) {
  const { roominfo, active } = props;
  const { users } = roominfo;
  const groupId = roominfo.room.group_id;
  const { id } = roominfo.room;
  const { activeRoom, setActiveRoom } = active;
  const connectConfig: Livekit.ConnectOptions = {
    autoSubscribe: true,
    adaptiveStream: true,
    autoManageVideo: true,
    dynacast: true,
    audio: true,
    video: false,
  };
  const url = 'wss://demo.dally.app';
  const { connect, isConnecting, room, error, participants, audioTracks } =
    useRoom();

  const handleClick = () => {
    const connectRoom = () => {
      connect(url, roominfo.token, connectConfig)
        .then(() => {
          console.log(`connected to room ${roominfo.room.id}`, room);
          // Note: the room being logged to console is stale. setRoom hasn't run yet.
          setActiveRoom(roominfo.room.id);
          return true;
        })
        .catch(() => {
          return false;
        });
    };

    console.log(`clicked room ${roominfo.room.id}`, roominfo);

    // if changing rooms: disconnect first, then connect
    if (activeRoom !== roominfo.room.id) {
      if (room?.state) {
        if (room.state !== 'disconnected') {
          console.log(
            `disconnecting from room ${activeRoom} and connecting to room ${roominfo.room.id}`
          );
          room.disconnect();
        }
      }
      connectRoom();

      // else already connected
    } else {
      console.log(`already connected to room ${roominfo.room.id}`, room);
    }
  };

  const showUsers = () => {
    if (activeRoom === roominfo.room.id) {
      return (
        <RoomParticipants users={users} key={`${groupId}/${id}-participants`} />
      );
    }
    return null;
  };

  return (
    <>
      <ListItemButton dense onClick={handleClick}>
        <ListItemIcon>
          <GroupsIcon />
        </ListItemIcon>
        <ListItemText primary={roominfo.room.name} />
      </ListItemButton>
      {showUsers()}
    </>
  );
}

export default GroupRoom;
