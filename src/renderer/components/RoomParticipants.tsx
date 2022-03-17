/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/naming-convention */
import List from '@mui/material/List';
import { Participant } from 'livekit-client';
import * as models from '../models/models';
import RoomParticipant from './RoomParticipant';
import useRoom from '../hooks/useRoom';

function useUserMap(users: models.RoomUserInfo[]) {
  const userMap = new Map<string, models.RoomUserInfo>();
  users.forEach((userinfo: models.RoomUserInfo) => {
    const { user_id: id } = userinfo;
    userMap.set(`${id}`, userinfo);
  });

  return userMap;
}

function RoomParticipants(props: { users: models.RoomUserInfo[] }) {
  const { users } = props;
  const { participants } = useRoom();
  const userMap = useUserMap(users);

  const participantItems = participants.map((participant: Participant) => {
    const id = participant.identity;
    const userinfo = userMap.get(id) as models.RoomUserInfo;
    // todo: if id not found, use a placeholder

    return (
      <RoomParticipant
        key={participant.sid}
        userinfo={userinfo}
        participant={participant}
      />
    );
  });

  return <List disablePadding>{participantItems}</List>;
}

export default RoomParticipants;