/* eslint-disable react/no-array-index-key */
import List from '@mui/material/List';
import * as models from '../models/models';
import PeekRoomParticipant from './PeekRoomParticipant';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectRoomParticipants, unknownParticipant } from '../redux/ArtySlice';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

function PeakRoomParticipants(props: {
  roomInfo: models.RoomInfo;
  userMap: Map<string, models.GroupUserInfo>;
}) {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useAppDispatch();
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
      dispatch(
        unknownParticipant({
          client: axiosPrivate,
          groupId,
          userId: +userId,
        })
      );
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
