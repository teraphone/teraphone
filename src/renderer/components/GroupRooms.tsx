import List from '@mui/material/List';
import * as React from 'react';
import * as models from '../models/models';
import GroupRoom from './GroupRoom';

function GroupRooms(props: { groupInfo: models.GroupInfo }) {
  const { groupInfo } = props;
  const { rooms, users } = groupInfo;

  // construct users object
  const usersObj = {} as { [id: number]: models.GroupUserInfo };
  users.map((groupUserInfo) => {
    usersObj[groupUserInfo.user_id] = groupUserInfo;
    return true;
  });

  const roomItems = rooms.map((roomInfo: models.RoomInfo) => {
    const groupId = roomInfo.room.group_id;
    const roomId = roomInfo.room.id;
    return (
      <GroupRoom
        groupInfo={groupInfo}
        roomInfo={roomInfo}
        usersObj={usersObj}
        key={`${groupId}/${roomId}`}
      />
    );
  });

  return <List disablePadding>{roomItems}</List>;
}

export default React.memo(GroupRooms);
