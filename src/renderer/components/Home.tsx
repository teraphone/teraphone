/* eslint-disable no-console */
import Box from '@mui/material/Box';
import * as React from 'react';
import { ref, remove, update, child } from 'firebase/database';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import GroupTabs from './GroupTabs';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getWorld, selectGroups } from '../redux/WorldSlice';
import { database } from '../redux/Firebase';
import {
  addParticipantRTListener,
  addOnlineRTListener,
} from '../redux/ArtySlice';
import * as models from '../models/models';
import useRoom from '../hooks/useRoom';
import {
  ConnectionStatus,
  selectConnectionStatus,
  setConnectionStatus,
} from '../redux/ConnectionStatusSlice';
import { selectCurrentRoom } from '../redux/CurrentRoomSlice';
import { selectAppUser } from '../redux/AppUserSlice';
import ScreenPickerDialog from './ScreenPickerDialog';
import VideoViews from './VideoViews';

const Home = () => {
  React.useEffect(() => {
    console.log('Home Mounted');
    return () => console.log('Home Unmounted');
  }, []);
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const { isConnecting, error, room } = useRoom();
  const { currentRoom } = useAppSelector(selectCurrentRoom);
  const { connectionStatus } = useAppSelector(selectConnectionStatus);
  const { appUser } = useAppSelector(selectAppUser);
  const groups = useAppSelector(selectGroups);

  const setOnlineStatus = React.useCallback(
    (groupId: string, isOnline: boolean) => {
      const nodeRef = ref(database, `online/${groupId}`);
      if (isOnline) {
        return update(nodeRef, { [appUser.id]: true });
      }
      return remove(child(nodeRef, `${appUser.id}`));
    },
    [appUser.id]
  );

  const clearUserRTInfo = React.useCallback(() => {
    const nodeRef = ref(
      database,
      `participants/${currentRoom.groupId}/${currentRoom.roomId}/${appUser.id}`
    );
    return remove(nodeRef);
  }, [appUser.id, currentRoom.groupId, currentRoom.roomId]);

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
              groupId,
            })
          );
          console.log('addOnlineRTListener', groupId);
          dispatch(addOnlineRTListener({ groupId }));
          setOnlineStatus(groupId, true);
        });
        return true;
      })
      .catch((err) => {
        console.log('dispatch getWorld -> error', err);
        return false;
      });
  }, [axiosPrivate, dispatch, setOnlineStatus]);

  React.useEffect(() => {
    console.log('Home Mounted');
    return () => console.log('Home Unmounted');
  }, []);

  React.useEffect(() => {
    console.log('useEffect -> setConnectionStatus');
    if (error) {
      dispatch(setConnectionStatus(ConnectionStatus.Error));
    } else if (isConnecting) {
      dispatch(setConnectionStatus(ConnectionStatus.Connecting));
    } else if (room && room.state === 'connected') {
      dispatch(setConnectionStatus(ConnectionStatus.Connected));
    } else if (room && room.state === 'reconnecting') {
      dispatch(setConnectionStatus(ConnectionStatus.Reconnecting));
    } else {
      dispatch(setConnectionStatus(ConnectionStatus.Disconnected));
    }
  }, [dispatch, error, isConnecting, room]);

  const handleBeforeUnload = React.useCallback(() => {
    console.log('handling window unloaded event');
    if (connectionStatus !== ConnectionStatus.Disconnected) {
      room?.disconnect();
    }
    clearUserRTInfo();
    groups.forEach((groupInfo) => {
      const { group } = groupInfo;
      const groupId = group.id.toString();
      setOnlineStatus(groupId, false);
    });
  }, [clearUserRTInfo, connectionStatus, groups, room, setOnlineStatus]);

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
      </Box>
    </div>
  );
};

export default React.memo(Home);
// todo: how to refresh groupsInfo if...
// - a new user joins the group?
// - user joins a new group?
