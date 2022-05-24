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

function PeekRoomParticipant(props: {
  userinfo: models.GroupUserInfo;
  isMuted: boolean;
  isDeafened: boolean;
  isScreenShare: boolean;
}) {
  const { userinfo, isMuted, isDeafened, isScreenShare } = props;
  const { name } = userinfo;

  return (
    <ListItemButton dense component="li" sx={{ pl: 4, py: 0.5 }}>
      <ListItemIcon>
        <Avatar sx={{ width: 20, height: 20, fontSize: 14 }}>{name[0]}</Avatar>
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
