/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import * as React from 'react';
import { LocalAudioTrack, Participant } from 'livekit-client';
import { useParticipant, ParticipantState } from 'livekit-react';
import * as models from '../models/models';
import AudioRenderer from './AudioRenderer';
import useMute from '../hooks/useMute';

function RoomParticipant(props: {
  userinfo: models.RoomUserInfo;
  participant: Participant;
}) {
  const { userinfo, participant } = props;
  const { name } = userinfo;
  const participantState: ParticipantState = useParticipant(participant);
  const speech = participantState.isSpeaking ? ' 🗣' : '';
  const track = participantState.microphonePublication?.track;
  const { isLocal } = participantState;
  const { mute, deafen } = useMute();

  if (isLocal) {
    if (track) {
      const at = participantState.microphonePublication
        ?.audioTrack as LocalAudioTrack;
      if (mute) {
        at.mute();
      } else {
        at.unmute();
      }
    }
  }

  const handleClick = React.useCallback(() => {
    console.log('clicked user', userinfo);
    console.log('participantState', participantState);
    console.log('participant', participant);
  }, [participantState, userinfo, participant]);

  return (
    <ListItemButton dense onClick={handleClick}>
      <ListItemIcon>
        <Avatar sx={{ width: 24, height: 24 }}>{name[0]}</Avatar>
      </ListItemIcon>
      <ListItemText primary={name + speech} />
      {!deafen && track && (
        <AudioRenderer track={track} isLocal={isLocal} volume={0.5} />
      )}
    </ListItemButton>
  );
}

export default RoomParticipant;
