/* eslint-disable react/no-array-index-key */
import List from '@mui/material/List';
import * as models from '../models/models';
import PeekRoomParticipant from './PeekRoomParticipant';

function PeakRoomParticipants(props: {
  userMap: Map<string, models.RoomUserInfo>;
  roomRTInfo: Map<string, models.ParticipantRTInfo>;
}) {
  const { userMap, roomRTInfo } = props;
  const roomParticipants: JSX.Element[] = [];

  roomRTInfo.forEach(
    (participantRTInfo: models.ParticipantRTInfo, userId: string) => {
      let userinfo = {} as models.RoomUserInfo;
      if (userMap.has(userId)) {
        userinfo = userMap.get(userId) as models.RoomUserInfo;
      } else {
        userinfo.name = 'Unknown User';
        userinfo.user_id = +userId;
      }
      roomParticipants.push(
        <PeekRoomParticipant
          key={`${userId}`}
          userinfo={userinfo}
          participantRTInfo={participantRTInfo}
        />
      );
    }
  );

  return <List disablePadding>{roomParticipants}</List>;
}

export default PeakRoomParticipants;
