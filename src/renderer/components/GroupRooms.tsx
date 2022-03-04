import * as React from 'react';
import List from '@mui/material/List';
import * as models from '../models/models';
import GroupRoom, { ActiveState } from './GroupRoom';

function GroupRooms(props: { groupinfo: models.GroupInfo }) {
  const { groupinfo } = props;
  const { rooms } = groupinfo;
  const [activeRoom, setActiveRoom] = React.useState(0);

  function handleRooms() {
    const roomItems = rooms.map((roominfo: models.RoomInfo) => {
      const groupId = roominfo.room.group_id;
      const roomId = roominfo.room.id;
      return (
        <GroupRoom
          roominfo={roominfo}
          key={`${groupId}/${roomId}`}
          active={{ activeRoom, setActiveRoom } as ActiveState}
        />
      );
    });

    return roomItems;
  }

  return <List>{handleRooms()}</List>;
}

export default GroupRooms;
