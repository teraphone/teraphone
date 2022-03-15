/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupsIcon from '@mui/icons-material/Groups';
import * as Livekit from 'livekit-client';
import * as models from '../models/models';
import RoomParticipants from './RoomParticipants';
import useRoom from '../hooks/useRoom';
import useCurrentRoom from '../hooks/useCurrentRoom';
import useConnection from '../hooks/useConnection';
import { ConnectionState } from '../contexts/ConnectionContext';

export type ActiveState = {
  activeRoom: number;
  setActiveRoom: (x: number) => void;
};

function GroupRoom(props: {
  groupinfo: models.GroupInfo;
  roominfo: models.RoomInfo;
  active: ActiveState;
}) {
  const { groupinfo, roominfo, active } = props;
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
  const { connect, room } = useRoom();
  const { setCurrentRoom } = useCurrentRoom();
  const { connectionState } = useConnection();

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

    // set current room to this room
    setCurrentRoom({
      roomId: roominfo.room.id,
      roomName: roominfo.room.name,
      groupId: roominfo.room.group_id,
      groupName: groupinfo.group.name,
    });

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
    if (
      activeRoom === roominfo.room.id &&
      connectionState === ConnectionState.Connected
    ) {
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
