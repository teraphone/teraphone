import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupsIcon from '@mui/icons-material/Groups';
import * as models from '../models/models';
import RoomParticipants from './RoomParticipants';

function GroupRooms(props: { groupinfo: models.GroupInfo }) {
  const { groupinfo } = props;
  const { rooms } = groupinfo;

  function handleRooms() {
    const roomItems = rooms.map((roominfo: models.RoomInfo) => {
      const { room, users } = roominfo;
      const { name, id } = room;
      return (
        <div key={`room-${id}`}>
          <ListItemButton>
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItemButton>
          <RoomParticipants users={users} key={`room-${id}-participants`} />
        </div>
      );
    });

    return roomItems;
  }

  return <List>{handleRooms()}</List>;
}

export default GroupRooms;
