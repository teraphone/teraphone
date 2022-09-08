/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import * as React from 'react';
import { Participant, ParticipantEvent } from 'livekit-client';
import MicOffIcon from '@mui/icons-material/MicOff';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import * as models from '../models/models';
import { useAppSelector } from '../redux/hooks';
import { selectUserAvatars } from '../redux/AvatarSlice';

function RoomParticipant(props: {
  user: models.TenantUser;
  participant: Participant;
  isMuted: boolean;
  isDeafened: boolean;
  isScreenShare: boolean;
}) {
  const [isMounted, setIsMounted] = React.useState(false);
  const { user, participant, isMuted, isDeafened, isScreenShare } = props;
  const { name } = user;
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [speech, setSpeech] = React.useState('');
  const userAvatars = useAppSelector(selectUserAvatars);

  React.useEffect(() => {
    const onIsSpeakingChanged = () => {
      setIsSpeaking(participant.isSpeaking);
    };
    participant.on(ParticipantEvent.IsSpeakingChanged, onIsSpeakingChanged);
    console.log('RoomParticipant', name, 'Mounted');
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      participant.off(ParticipantEvent.IsSpeakingChanged, onIsSpeakingChanged);
      console.log('RoomParticipant', name, 'Unmounted');
    };
  }, [name, participant]);

  React.useEffect(() => {
    if (isMounted) {
      if (participant) {
        setSpeech(isSpeaking ? ' 🗣' : '');
      }
    }
  }, [isMounted, isSpeaking, participant]);

  return (
    <ListItemButton
      dense
      component="li"
      sx={{ py: 0.5, '&, &:hover': { backgroundColor: 'transparent' } }}
    >
      <ListItemIcon>
        <Avatar
          src={userAvatars[user.oid]}
          sx={{ width: 20, height: 20, fontSize: 14 }}
        >
          {name[0]}
        </Avatar>
      </ListItemIcon>
      <ListItemText primary={name + speech} />

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

      {isScreenShare && (
        <ScreenShareIcon
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
