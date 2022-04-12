/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import * as React from 'react';
import {
  LocalAudioTrack,
  Participant,
  RemoteTrackPublication,
} from 'livekit-client';
import { useParticipant, ParticipantState } from 'livekit-react';
import MicOffIcon from '@mui/icons-material/MicOff';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import * as models from '../models/models';
import AudioRenderer from './AudioRenderer';
import { useAppSelector } from '../redux/hooks';
import { selectMute, selectDeafen } from '../redux/MuteSlice';

function RoomParticipant(props: {
  userinfo: models.GroupUserInfo;
  participant: Participant;
  participantRTInfo: models.ParticipantRTInfo;
}) {
  const { userinfo, participant, participantRTInfo } = props;
  const { name } = userinfo;
  const participantState: ParticipantState = useParticipant(participant);
  const speech = participantState.isSpeaking ? ' 🗣' : '';
  const track = participantState.microphonePublication?.track;
  const { isLocal } = participantState;
  const mute = useAppSelector(selectMute);
  const deafen = useAppSelector(selectDeafen);
  const { isMuted, isDeafened } = participantRTInfo;

  console.log('RoomParticipant');
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
  } else if (participantState.microphonePublication) {
    const rt = participantState.microphonePublication as RemoteTrackPublication;
    rt.setSubscribed(true);
  }

  return (
    <ListItemButton dense component="li" sx={{ pl: 4, py: 0.5 }}>
      <ListItemIcon>
        <Avatar sx={{ width: 20, height: 20, fontSize: 14 }}>{name[0]}</Avatar>
      </ListItemIcon>
      <ListItemText primary={name + speech} />
      {!deafen && track && (
        <AudioRenderer track={track} isLocal={isLocal} volume={0.5} />
      )}
      {isMuted && (
        <MicOffIcon
          sx={{
            width: 16,
            height: 16,
          }}
        />
      )}
      {isDeafened && (
        <HeadsetOffIcon
          sx={{
            width: 16,
            height: 16,
          }}
        />
      )}
    </ListItemButton>
  );
}

export default React.memo(RoomParticipant);
