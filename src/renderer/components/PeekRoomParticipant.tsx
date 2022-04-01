/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import * as React from 'react';
import MicOffIcon from '@mui/icons-material/MicOff';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import * as models from '../models/models';

function PeekRoomParticipant(props: {
  userinfo: models.GroupUserInfo;
  participantRTInfo: models.ParticipantRTInfo;
}) {
  const { userinfo, participantRTInfo } = props;
  const { name } = userinfo;
  const { isMuted, isDeafened } = participantRTInfo;

  const handleClick = React.useCallback(() => {
    console.log('clicked user', userinfo);
    console.log('participantRTInfo', participantRTInfo);
  }, [userinfo, participantRTInfo]);

  return (
    <ListItemButton
      dense
      onClick={handleClick}
      component="li"
      sx={{ pl: 4, py: 0.5 }}
    >
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
    </ListItemButton>
  );
}

export default PeekRoomParticipant;
