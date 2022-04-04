/* eslint-disable no-console */
import Box from '@mui/material/Box';
import * as React from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import GroupTabs from './GroupTabs';
import { useAppDispatch } from '../redux/hooks';
import { getWorld } from '../redux/WorldSlice';

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    console.log('useEffect -> dispatch getWorld');
    dispatch(getWorld(axiosPrivate))
      .then((groups) => {
        console.log('dispatch getWorld -> then', groups);
        return true;
      })
      .catch((error) => {
        console.log('dispatch getWorld -> error', error);
        return false;
      });
  }, [axiosPrivate, dispatch]);

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
        <GroupTabs />
      </Box>
    </div>
  );
};

export default Home;
// todo: how to refresh groupsInfo if...
// - a new user joins the group?
// - user joins a new group?
