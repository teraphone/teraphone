import List from '@mui/material/List';
import { Participant } from 'livekit-client';
import * as models from '../models/models';
import RoomParticipant from './RoomParticipant';
import useRoom from '../hooks/useRoom';
import { useAppSelector } from '../redux/hooks';
import { selectRoomParticipants } from '../redux/ArtySlice';

function RoomParticipants(props: {
  roomInfo: models.RoomInfo;
  userMap: Map<string, models.GroupUserInfo>;
}) {
  const { roomInfo, userMap } = props;
  const { group_id: groupId, id: roomId } = roomInfo.room;
  const { participants } = useRoom();
  const usersRTInfo = useAppSelector((state) =>
    selectRoomParticipants(state, groupId.toString(), roomId.toString())
  );

  const participantItems = participants.map((participant: Participant) => {
    const id = participant.identity;
    let userInfo = {} as models.GroupUserInfo;
    if (userMap.has(id)) {
      userInfo = userMap.get(id) as models.GroupUserInfo;
    } else {
      userInfo = {
        name: 'Unknown User',
        user_id: +id,
      } as models.GroupUserInfo;
    }

    let participantRTInfo = {} as models.ParticipantRTInfo;
    if (id in usersRTInfo) {
      participantRTInfo = usersRTInfo[id];
    } else {
      participantRTInfo.isMuted = false;
      participantRTInfo.isDeafened = false;
      participantRTInfo.isCameraShare = false;
      participantRTInfo.isScreenShare = false;
    }

    return (
      <RoomParticipant
        key={participant.sid}
        userinfo={userInfo}
        participant={participant}
        participantRTInfo={participantRTInfo}
      />
    );
  });

  return <List disablePadding>{participantItems}</List>;
}

export default RoomParticipants;
