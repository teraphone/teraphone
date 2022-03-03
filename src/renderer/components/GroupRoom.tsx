/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupsIcon from '@mui/icons-material/Groups';
import * as React from 'react';
import * as models from '../models/models';
import RoomParticipants from './RoomParticipants';

function GroupRoom(props: { roominfo: models.RoomInfo }) {
  const { roominfo } = props;
  const { room, users } = roominfo;
  const { id, name, group_id: groupId } = room;

  const handleClick = React.useCallback(() => {
    console.log('clicked room', roominfo);
  }, [roominfo]);

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
