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

function GroupRoom(props: { roominfo: models.RoomInfo }) {
  const { roominfo } = props;
  const { room, users, token } = roominfo;
  const { id, name, group_id: groupId } = room;
  const livekitRoom = React.useMemo(() => {
    return new Livekit.Room();
  }, []);

  // TODO: this isn't right. probably need to use livekit react library

  React.useEffect(() => {
    const url = 'wss://demo.dally.app';

    livekitRoom.connect(url, token, { autoSubscribe: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = React.useCallback(() => {
    console.log('clicked room', roominfo, livekitRoom);
  }, [roominfo, livekitRoom]);

  return (
    <>
      <ListItemButton dense onClick={handleClick}>
        <ListItemIcon>
          <GroupsIcon />
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
      <RoomParticipants users={users} key={`${groupId}/${id}-participants`} />
    </>
  );
}

export default GroupRoom;
