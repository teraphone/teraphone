/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupsIcon from '@mui/icons-material/Groups';
import * as React from 'react';
import * as Livekit from 'livekit-client';
import * as models from '../models/models';
import RoomParticipants from './RoomParticipants';

const connectConfigMeta: Livekit.RoomConnectOptions = {
  autoSubscribe: true,
};

const connectConfig: Livekit.RoomConnectOptions = {};

export type ActiveState = {
  activeRoom: number;
  setActiveRoom: (x: number) => void;
};

function GroupRoom(props: { roominfo: models.RoomInfo; active: ActiveState }) {
  const { roominfo, active } = props;
  const { activeRoom, setActiveRoom } = active;
  const { room, users, token } = roominfo;
  const { id, name, group_id: groupId } = room;
  const livekitRoom = React.useMemo(() => {
    return new Livekit.Room();
  }, []);

  // TODO: this isn't right. probably need to use livekit react library

  React.useMemo(() => {
    const url = 'wss://demo.dally.app';
    if (activeRoom === id) {
      livekitRoom
        .connect(url, token, { autoSubscribe: false })
        .then(() => {
          console.log(`connected to room ${id}`, livekitRoom);
          return true;
        })
        .catch(() => {
          return false;
        });
    } else if (livekitRoom.state !== 'disconnected') {
      livekitRoom.disconnect();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoom]);

  const handleClick = React.useCallback(() => {
    setActiveRoom(id);
    console.log(`clicked room ${id}`, roominfo);
  }, [setActiveRoom, id, roominfo]);

  return (
    <>
      <ListItemButton dense onClick={handleClick}>
        <ListItemIcon>
          <GroupsIcon />
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
      {/* <RoomParticipants users={users} key={`${groupId}/${id}-participants`} /> */}
    </>
  );
}

export default GroupRoom;
