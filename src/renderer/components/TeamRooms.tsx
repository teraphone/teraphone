import List from '@mui/material/List';
import * as React from 'react';
import * as models from '../models/models';
import TeamRoom from './TeamRoom';

function TeamRooms(props: { teamInfo: models.TeamInfo }) {
  const { teamInfo } = props;
  const { rooms, users } = teamInfo;

  // construct users object
  const usersObj = {} as { [oid: string]: models.TenantUser };
  users.map((user) => {
    usersObj[user.oid] = user;
    return true;
  });

  const roomItems = rooms.map((roomInfo: models.RoomInfoType) => {
    const { teamId, id: roomId } = roomInfo.room;

    return (
      <TeamRoom
        teamInfo={teamInfo}
        roomInfo={roomInfo}
        usersObj={usersObj}
        key={`${teamId}/${roomId}`}
      />
    );
  });

  return <List>{roomItems}</List>;
}

export default React.memo(TeamRooms);
