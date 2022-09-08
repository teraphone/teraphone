/* eslint-disable react/no-array-index-key */
import List from '@mui/material/List';
import * as React from 'react';
import * as models from '../models/models';
import PeekRoomParticipant from './PeekRoomParticipant';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectRoomParticipants, unknownParticipant } from '../redux/ArtySlice';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

function PeakRoomParticipants(props: {
  roomInfo: models.RoomInfoType;
  usersObj: { [oid: string]: models.TenantUser };
}) {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const { roomInfo, usersObj } = props;
  const { teamId, id: roomId } = roomInfo.room;
  const usersRTInfo = useAppSelector((state) =>
    selectRoomParticipants(state, teamId, roomId)
  );
  const roomParticipants: JSX.Element[] = [];

  Object.entries(usersRTInfo).map(([userId, participantRTInfo]) => {
    let user = {} as models.TenantUser;
    if (usersObj[userId]) {
      user = usersObj[userId];
    } else {
      user.name = 'Unknown User';
      user.oid = userId;
      dispatch(
        unknownParticipant({
          client: axiosPrivate,
          teamId,
          userId,
        })
      );
    }
    const { isMuted, isDeafened, isScreenShare } = participantRTInfo;
    roomParticipants.push(
      <PeekRoomParticipant
        key={userId}
        user={user}
        isMuted={isMuted}
        isDeafened={isDeafened}
        isScreenShare={isScreenShare}
      />
    );
    return true;
  });

  return (
    <List disablePadding sx={{ ml: 1 }}>
      {roomParticipants}
    </List>
  );
}

export default React.memo(PeakRoomParticipants);
