/* eslint-disable @typescript-eslint/naming-convention */
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import * as models from '../models/models';

function RoomParticipants(props: { users: models.RoomUserInfo[] }) {
  const { users } = props;
  // todo: this is showing RoomUsers, not Participants. Fix after we can get participants from livekit
  function handleUsers() {
    const userItems = users.map((userinfo: models.RoomUserInfo) => {
      const { name, user_id: id } = userinfo;
      return (
        <ListItemButton key={`user-${id}`}>
          <ListItemIcon>
            <Avatar sx={{ width: 24, height: 24 }}>{name[0]}</Avatar>
          </ListItemIcon>
          <ListItemText primary={name} />
        </ListItemButton>
      );
    });

    return userItems;
  }

  return <List>{handleUsers()}</List>;
}

export default RoomParticipants;
