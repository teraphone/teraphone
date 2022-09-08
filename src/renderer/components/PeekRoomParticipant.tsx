/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import * as React from 'react';
import MicOffIcon from '@mui/icons-material/MicOff';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import * as models from '../models/models';
import { useAppSelector } from '../redux/hooks';
import { selectUserAvatars } from '../redux/AvatarSlice';

function PeekRoomParticipant(props: {
  user: models.TenantUser;
  isMuted: boolean;
  isDeafened: boolean;
  isScreenShare: boolean;
}) {
  const { user, isMuted, isDeafened, isScreenShare } = props;
  const { name } = user;
  const userAvatars = useAppSelector(selectUserAvatars);

  return (
    <ListItemButton dense component="li" sx={{ py: 0.5 }}>
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
    </ListItemButton>
  );
}

export default React.memo(PeekRoomParticipant);
