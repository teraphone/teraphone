import List from '@mui/material/List';
import * as models from '../models/models';
import GroupRoom from './GroupRoom';

function GroupRooms(props: { groupInfo: models.GroupInfo }) {
  const { groupInfo } = props;
  const { rooms } = groupInfo;

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

  return <List disablePadding>{roomItems}</List>;
}

export default GroupRooms;
