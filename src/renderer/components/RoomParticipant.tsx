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
  isMuted: boolean;
  isDeafened: boolean;
}) {
  const { userinfo, participant, isMuted, isDeafened } = props;
  const { name } = userinfo;

  React.useEffect(() => {
    console.log('RoomParticipant', name, 'Mounted');
    return () => console.log('RoomParticipant', name, 'Unmounted');
  }, [name]);

  const { isSpeaking, isLocal, microphonePublication } =
    useParticipant(participant);
  const speech = isSpeaking ? ' 🗣' : '';
  const localAudioTrack = microphonePublication?.audioTrack as
    | LocalAudioTrack
    | undefined;
  const track = microphonePublication?.track;
  const mute = useAppSelector(selectMute);
  const deafen = useAppSelector(selectDeafen);

  React.useEffect(() => {
    if (isLocal) {
      if (localAudioTrack) {
        if (mute) {
          localAudioTrack.mute();
        } else {
          localAudioTrack.unmute();
        }
      }
    } else if (microphonePublication) {
      const rt = microphonePublication as RemoteTrackPublication;
      rt.setSubscribed(true);
    }
  }, [isLocal, localAudioTrack, microphonePublication, mute, track]);

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
