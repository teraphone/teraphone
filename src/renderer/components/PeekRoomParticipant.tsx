/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import * as React from 'react';
import MicOffIcon from '@mui/icons-material/MicOff';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import VideocamIcon from '@mui/icons-material/Videocam';
import * as models from '../models/models';
import { useAppSelector } from '../redux/hooks';
import { selectUserAvatars } from '../redux/AvatarSlice';

function PeekRoomParticipant(props: {
  user: models.TenantUser;
  isMuted: boolean;
  isDeafened: boolean;
  isScreenShare: boolean;
  isCameraShare: boolean;
}) {
  const { user, isMuted, isDeafened, isScreenShare, isCameraShare } = props;
  const { name } = user;
  const userAvatars = useAppSelector(selectUserAvatars);

  React.useEffect(() => {
    console.log('PeekRoomParticipant', name, 'Mounted');
    return () => {
      console.log('PeekRoomParticipant', name, 'Unmounted');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListItemButton dense component="li" sx={{ pl: 3, py: 0.5 }}>
      <ListItemIcon>
        <Avatar
          src={userAvatars[user.oid]}
          sx={{ width: 20, height: 20, fontSize: 14 }}
        >
          {name[0]}
        </Avatar>
      </ListItemIcon>
      <ListItemText primary={name} />

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

      {isCameraShare && (
        <VideocamIcon
          sx={{
            width: 16,
            height: 16,
          }}
        />
      )}
    </ListItemButton>
  );
}

export default React.memo(PeekRoomParticipant);
