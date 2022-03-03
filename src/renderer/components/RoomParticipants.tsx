/* eslint-disable @typescript-eslint/naming-convention */
import List from '@mui/material/List';
import * as models from '../models/models';
import RoomParticipant from './RoomParticipant';

function RoomParticipants(props: { users: models.RoomUserInfo[] }) {
  const { users } = props;
  // todo: this is showing RoomUsers, not Participants. Fix after we can get participants from livekit
  function handleUsers() {
    const userItems = users.map((userinfo: models.RoomUserInfo) => {
      const { user_id: id } = userinfo;
      return <RoomParticipant key={`user-${id}`} userinfo={userinfo} />;
    });

    return userItems;
  }

  return <List>{handleUsers()}</List>;
}

export default RoomParticipants;
