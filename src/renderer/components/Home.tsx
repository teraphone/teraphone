/* eslint-disable no-console */
import Box from '@mui/material/Box';
import * as React from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import GroupTabs from './GroupTabs';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getWorld } from '../redux/WorldSlice';
import { signedIn, signedOut } from '../redux/ArtySlice';
import * as models from '../models/models';
import useRoom from '../hooks/useRoom';
import {
  ConnectionStatus,
  selectConnectionStatus,
  setConnectionStatus,
} from '../redux/ConnectionStatusSlice';
import ScreenPickerDialog from './ScreenPickerDialog';
import VideoViews from './VideoViews';
import AudioRenderers from './AudioRenderers';

const Home = () => {
  React.useEffect(() => {
    console.log('Home Mounted');
    return () => console.log('Home Unmounted');
  }, []);
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const { connectionState, error, isConnecting, room } = useRoom();
  const { connectionStatus } = useAppSelector(selectConnectionStatus);

  React.useEffect(() => {
    console.log('useEffect -> dispatch getWorld');
    dispatch(getWorld(axiosPrivate))
      .then((response) => {
        console.log('dispatch getWorld -> then', response);
        return response.payload as models.GroupsInfo;
      })
      .then(() => {
        dispatch(signedIn);
        console.log('dispatch signedIn');
        return true;
      })
      .catch((err) => {
        console.log('dispatch getWorld -> error', err);
        return false;
      });
  }, [axiosPrivate, dispatch]);

  React.useEffect(() => {
    console.log('Home Mounted');
    return () => console.log('Home Unmounted');
  }, []);

  React.useEffect(() => {
    console.log('useEffect -> setConnectionStatus');
    if (!isConnecting && error) {
      dispatch(setConnectionStatus(ConnectionStatus.Error));
    } else {
      dispatch(
        setConnectionStatus(connectionState as unknown as ConnectionStatus)
      );
    }
  }, [dispatch, error, connectionState, isConnecting]);

  const handleBeforeUnload = React.useCallback(() => {
    console.log('handling window unloaded event');
    if (connectionStatus !== ConnectionStatus.Disconnected) {
      room?.disconnect();
    }
    dispatch(signedOut);
    console.log('dispatch signedOut');
  }, [connectionStatus, dispatch, room]);

  React.useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [handleBeforeUnload]);

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
        <ScreenPickerDialog />
        <VideoViews />
        <AudioRenderers />
      </Box>
    </div>
  );
};

export default React.memo(Home);
// todo: how to refresh groupsInfo if...
// - a new user joins the group?
// - user joins a new group?
