import List from '@mui/material/List';
import { Participant } from 'livekit-client';
import * as models from '../models/models';
import RoomParticipant from './RoomParticipant';
import useRoom from '../hooks/useRoom';

function RoomParticipants(props: {
  userMap: Map<string, models.RoomUserInfo>;
  roomRTInfo: Map<string, models.ParticipantRTInfo>;
}) {
  const { userMap, roomRTInfo } = props;
  const { participants } = useRoom();

  const participantItems = participants.map((participant: Participant) => {
    const id = participant.identity;
    let userinfo = {} as models.RoomUserInfo;
    if (userMap.has(id)) {
      userinfo = userMap.get(id) as models.RoomUserInfo;
    } else {
      userinfo.name = 'Unknown User';
      userinfo.user_id = +id;
    }

    let participantRTInfo = {} as models.ParticipantRTInfo;
    if (roomRTInfo.has(id)) {
      participantRTInfo = roomRTInfo.get(id) as models.ParticipantRTInfo;
    } else {
      participantRTInfo.isMuted = false;
      participantRTInfo.isDeafened = false;
      participantRTInfo.isCameraShare = false;
      participantRTInfo.isScreenShare = false;
    }

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
