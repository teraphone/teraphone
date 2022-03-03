/* eslint-disable react/jsx-props-no-spreading */
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupsIcon from '@mui/icons-material/Groups';
import * as models from '../models/models';

function GroupRooms(props: { groupinfo: models.GroupInfo }) {
  const { groupinfo } = props;
  const { rooms } = groupinfo;

  function handleRooms() {
    const roomItems = rooms.map((roominfo: models.RoomInfo) => {
      const { room } = roominfo;
      const { name, id } = room;
      return (
        <ListItemButton key={id}>
          <ListItemIcon>
            <GroupsIcon />
          </ListItemIcon>
          <ListItemText primary={name} />
        </ListItemButton>
      );
    });

    return roomItems;
  }

  return <List>{handleRooms()}</List>;
}

export default GroupRooms;
