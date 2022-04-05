/* eslint-disable react/no-array-index-key */
import List from '@mui/material/List';
import * as models from '../models/models';
import PeekRoomParticipant from './PeekRoomParticipant';
import { useAppSelector } from '../redux/hooks';
import { selectRoomParticipants } from '../redux/ArtySlice';

function PeakRoomParticipants(props: {
  roomInfo: models.RoomInfo;
  userMap: Map<string, models.GroupUserInfo>;
}) {
  const { roomInfo, userMap } = props;
  const { group_id: groupId, id: roomId } = roomInfo.room;
  const usersRTInfo = useAppSelector((state) =>
    selectRoomParticipants(state, groupId.toString(), roomId.toString())
  );
  const roomParticipants: JSX.Element[] = [];

  Object.entries(usersRTInfo).map(([userId, participantRTInfo]) => {
    let userInfo = {} as models.GroupUserInfo;
    if (userMap.has(userId)) {
      userInfo = userMap.get(userId) as models.GroupUserInfo;
    } else {
      userInfo.name = 'Unknown User';
      userInfo.user_id = +userId;
    }
    roomParticipants.push(
      <PeekRoomParticipant
        key={userId}
        userinfo={userInfo}
        participantRTInfo={participantRTInfo}
      />
    );
    return true;
  });

  return <List disablePadding>{roomParticipants}</List>;
}

export default PeakRoomParticipants;
