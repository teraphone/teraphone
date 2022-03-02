/* eslint-disable no-console */
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import * as requests from '../requests/requests';
import * as models from '../models/models';
import GroupTabs from './GroupTabs';

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const [groupsInfo, setGroupsInfo] = React.useState([] as models.GroupsInfo);

  const getRoomsInfo = async (groupId: number) => {
    const rreq = await requests.GetRooms(axiosPrivate, groupId);
    const { rooms } = rreq.data as requests.GetRoomsResponse;

    const handleRoom = async (room: models.Room) => {
      const rureq = await requests.GetRoomUsers(axiosPrivate, groupId, room.id);
      const { room_users: users } = rureq.data as requests.GetRoomUsersResponse;
      return { users, room } as models.RoomInfo;
    };

    const roomsInfo = await Promise.all(rooms.map(handleRoom));
    return roomsInfo;
  };

  const getGroupsInfo = async () => {
    const greq = await requests.GetGroups(axiosPrivate);
    const { groups } = greq.data as requests.GetGroupsResponse;

    const handleGroup = async (group: models.Group) => {
      const ureq = await requests.GetGroupUsers(axiosPrivate, group.id);
      const { group_users: users } =
        ureq.data as requests.GetGroupUsersResponse;
      const rooms = await getRoomsInfo(group.id);
      return { group, users, rooms } as models.GroupInfo;
    };

    setGroupsInfo(await Promise.all(groups.map(handleGroup)));
  };

  React.useEffect(() => {
    console.log('useEffect -> getGroupsInfo');
    getGroupsInfo(); // this will run just once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: 'background.paper',
          display: 'flex',
          height: 500,
        }}
      >
        <GroupTabs groupsInfo={groupsInfo} />
      </Box>
    </div>
  );
};

export default Home;
