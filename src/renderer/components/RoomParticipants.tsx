import List from '@mui/material/List';
import { Participant } from 'livekit-client';
import * as models from '../models/models';
import RoomParticipant from './RoomParticipant';
import useRoom from '../hooks/useRoom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectRoomParticipants, unknownParticipant } from '../redux/ArtySlice';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

function RoomParticipants(props: {
  roomInfo: models.RoomInfo;
  userMap: Map<string, models.GroupUserInfo>;
}) {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const { roomInfo, userMap } = props;
  const { group_id: groupId, id: roomId } = roomInfo.room;
  const { participants } = useRoom();
  const usersRTInfo = useAppSelector((state) =>
    selectRoomParticipants(state, groupId.toString(), roomId.toString())
  );

  const participantItems = participants.map((participant: Participant) => {
    const userId = participant.identity;
    let userInfo = {} as models.GroupUserInfo;
    if (userMap.has(userId)) {
      userInfo = userMap.get(userId) as models.GroupUserInfo;
    } else {
      userInfo = {
        name: 'Unknown User',
        user_id: +userId,
      } as models.GroupUserInfo;
      dispatch(
        unknownParticipant({
          client: axiosPrivate,
          groupId,
          userId: +userId,
        })
      );
    }

    let participantRTInfo = {} as models.ParticipantRTInfo;
    if (userId in usersRTInfo) {
      participantRTInfo = usersRTInfo[userId];
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
