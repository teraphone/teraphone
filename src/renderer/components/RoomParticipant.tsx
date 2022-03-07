/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import * as React from 'react';
import { Participant } from 'livekit-client';
import { useParticipant, ParticipantState } from 'livekit-react';
import * as models from '../models/models';

function RoomParticipant(props: {
  userinfo: models.RoomUserInfo;
  participant: Participant;
}) {
  const { userinfo, participant } = props;
  const { name } = userinfo;
  const participantState: ParticipantState = useParticipant(participant);

  const handleClick = React.useCallback(() => {
    console.log('clicked user', userinfo, participantState);
  }, [participantState, userinfo]);

  return (
    <ListItemButton dense onClick={handleClick}>
      <ListItemIcon>
        <Avatar sx={{ width: 24, height: 24 }}>{name[0]}</Avatar>
      </ListItemIcon>
      <ListItemText primary={name} />
    </ListItemButton>
  );
}

export default RoomParticipant;
