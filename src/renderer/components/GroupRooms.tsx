import List from '@mui/material/List';
import * as models from '../models/models';
import GroupRoom from './GroupRoom';

function GroupRooms(props: { groupInfo: models.GroupInfo }) {
  const { groupInfo } = props;
  const { rooms } = groupInfo;

  function handleRooms() {
    const roomItems = rooms.map((roomInfo: models.RoomInfo) => {
      const groupId = roomInfo.room.group_id;
      const roomId = roomInfo.room.id;
      return (
        <GroupRoom
          groupInfo={groupInfo}
          roomInfo={roomInfo}
          key={`${groupId}/${roomId}`}
        />
      );
    });

    return roomItems;
  }

  return <List disablePadding>{handleRooms()}</List>;
}

export default GroupRooms;
