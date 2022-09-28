/* eslint-disable no-console */
import List from '@mui/material/List';
import { Participant } from 'livekit-client';
import * as React from 'react';
import * as models from '../models/models';
import RoomParticipant from './RoomParticipant';
import useRoom from '../hooks/useRoom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectRoomParticipants, unknownParticipant } from '../redux/ArtySlice';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

function RoomParticipants(props: {
  roomInfo: models.RoomInfoType;
  usersObj: { [oid: string]: models.TenantUser };
}) {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const { roomInfo, usersObj } = props;
  const { teamId, id: roomId } = roomInfo.room;
  const { participants } = useRoom();
  const usersRTInfo = useAppSelector((state) =>
    selectRoomParticipants(state, teamId, roomId)
  );

  React.useEffect(() => {
    console.log('RoomParticipants', roomInfo.room.displayName, 'Mounted');
    return () =>
      console.log('RoomParticipants', roomInfo.room.displayName, 'Unmounted');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const participantItems = participants.map((participant: Participant) => {
    const userId = participant.identity;
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

    let participantRTInfo = {} as models.ParticipantRTInfo;
    if (userId in usersRTInfo) {
      participantRTInfo = usersRTInfo[userId];
    } else {
      participantRTInfo.isMuted = false;
      participantRTInfo.isDeafened = false;
      participantRTInfo.isCameraShare = false;
      participantRTInfo.isScreenShare = false;
    }

    const { isMuted, isDeafened, isScreenShare, isCameraShare } =
      participantRTInfo;

    return (
      <RoomParticipant
        key={participant.sid}
        user={user}
        participant={participant}
        isMuted={isMuted}
        isDeafened={isDeafened}
        isScreenShare={isScreenShare}
        isCameraShare={isCameraShare}
      />
    );
  });

  return <List disablePadding>{participantItems}</List>;
}

export default React.memo(RoomParticipants);
