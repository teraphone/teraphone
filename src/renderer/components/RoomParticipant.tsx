/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import * as React from 'react';
import { Participant } from 'livekit-client';
import { useParticipant } from 'livekit-react';
import MicOffIcon from '@mui/icons-material/MicOff';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import * as models from '../models/models';

function RoomParticipant(props: {
  userinfo: models.GroupUserInfo;
  participant: Participant;
  isMuted: boolean;
  isDeafened: boolean;
  isScreenShare: boolean;
}) {
  const [isMounted, setIsMounted] = React.useState(false);
  const { userinfo, participant, isMuted, isDeafened, isScreenShare } = props;
  const { name } = userinfo;
  const [speech, setSpeech] = React.useState('');
  const { isSpeaking } = useParticipant(participant);

  React.useEffect(() => {
    console.log('RoomParticipant', name, 'Mounted');
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      console.log('RoomParticipant', name, 'Unmounted');
    };
  }, [name]);

  React.useEffect(() => {
    if (isMounted) {
      if (participant) {
        setSpeech(isSpeaking ? ' 🗣' : '');
      }
    }
  }, [isMounted, isSpeaking, participant]);

  return (
    <ListItemButton dense component="li" sx={{ pl: 4, py: 0.5 }}>
      <ListItemIcon>
        <Avatar sx={{ width: 20, height: 20, fontSize: 14 }}>{name[0]}</Avatar>
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
