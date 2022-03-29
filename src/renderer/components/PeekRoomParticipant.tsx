/* eslint-disable no-console */
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import * as React from 'react';
import * as models from '../models/models';

function PeekRoomParticipant(props: {
  userinfo: models.RoomUserInfo;
  participantRTInfo: models.ParticipantRTInfo;
}) {
  const { userinfo, participantRTInfo } = props;
  const { name } = userinfo;

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
    </ListItemButton>
  );
}

export default PeekRoomParticipant;
