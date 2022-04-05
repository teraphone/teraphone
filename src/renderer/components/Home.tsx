/* eslint-disable no-console */
import Box from '@mui/material/Box';
import * as React from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import GroupTabs from './GroupTabs';
import { useAppDispatch } from '../redux/hooks';
import { getWorld } from '../redux/WorldSlice';
import useFirebase from '../hooks/useFirebase';
import { addParticipantRTListener } from '../redux/ArtySlice';
import * as models from '../models/models';

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const { database } = useFirebase();

  React.useEffect(() => {
    console.log('useEffect -> dispatch getWorld');
    dispatch(getWorld(axiosPrivate))
      .then((response) => {
        console.log('dispatch getWorld -> then', response);
        return response.payload as models.GroupsInfo;
      })
      .then((groupsInfo) => {
        groupsInfo.forEach((groupInfo) => {
          const groupId = groupInfo.group.id.toString();
          console.log('addParticipantRTListener', groupId);
          dispatch(
            addParticipantRTListener({
              db: database,
              groupId,
            })
          );
        });
        return true;
      })
      .catch((error) => {
        console.log('dispatch getWorld -> error', error);
        return false;
      });
  }, [axiosPrivate, dispatch, database]);

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
