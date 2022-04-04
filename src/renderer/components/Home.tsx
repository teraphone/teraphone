/* eslint-disable no-console */
import Box from '@mui/material/Box';
import * as React from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import * as requests from '../requests/requests';
import * as models from '../models/models';
import GroupTabs from './GroupTabs';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { getWorld } from '../redux/WorldSlice';

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const [groupsInfo, setGroupsInfo] = React.useState([] as models.GroupsInfo);
  const dispatch = useAppDispatch();

  const getRoomsInfo = async (groupId: number) => {
    const rreq = await requests.GetRooms(axiosPrivate, groupId);
    const { rooms } = rreq.data as requests.GetRoomsResponse;

    const handleRoom = async (room: models.Room) => {
      const rureq = await requests.GetRoomUsers(axiosPrivate, groupId, room.id);
      const { room_users: users } = rureq.data as requests.GetRoomUsersResponse;
      const treq = await requests.JoinLiveKitRoom(
        axiosPrivate,
        groupId,
        room.id
      );
      const { token } = treq.data as requests.JoinLiveKitRoomResponse;
      return { users, room, token } as models.RoomInfo;
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

    return Promise.all(groups.map(handleGroup));
  };

  React.useEffect(() => {
    console.log('useEffect -> getGroupsInfo');
    getGroupsInfo() // this will run just once
      .then((infos: models.GroupsInfo) => {
        console.log('useEffect -> setGroupsInfo');
        console.log('groupsInfo', infos);
        setGroupsInfo(infos);
        return true;
      })
      .catch((error) => {
        console.log('getGroupsInfo -> error', error);
        return false;
      });
    dispatch(getWorld(axiosPrivate))
      .then((groups) => {
        console.log('dispatch getWorld -> then', groups);
        return true;
      })
      .catch((error) => {
        console.log('dispatch getWorld -> error', error);
        return false;
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: 'background.paper',
          display: 'flex',
          height: '100vh',
        }}
      >
        <GroupTabs groupsInfo={groupsInfo} />
      </Box>
    </div>
  );
};

export default Home;
// todo: how to refresh groupsInfo if...
// - a new user joins the group?
// - user joins a new group?
