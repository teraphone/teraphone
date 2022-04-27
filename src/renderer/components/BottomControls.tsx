/* eslint-disable no-alert */
/* eslint-disable no-console */
import IconButton from '@mui/material/IconButton';
import HeadsetIcon from '@mui/icons-material/Headset';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { update, ref } from 'firebase/database';
import * as React from 'react';
import useFirebase from '../hooks/useFirebase';
import {
  ConnectionStatus,
  selectConnectionStatus,
} from '../redux/ConnectionStatusSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectAppUser } from '../redux/AppUserSlice';
import {
  selectMute,
  selectDeafen,
  toggleMute,
  toggleDeafen,
} from '../redux/MuteSlice';
import { selectCurrentRoom } from '../redux/CurrentRoomSlice';

function BottomControls() {
  const dispatch = useAppDispatch();
  const mute = useAppSelector(selectMute);
  const deafen = useAppSelector(selectDeafen);
  const { currentRoom } = useAppSelector(selectCurrentRoom);
  const { database } = useFirebase();
  const { appUser } = useAppSelector(selectAppUser);
  const { connectionStatus } = useAppSelector(selectConnectionStatus);
  const debug = true;

  const pushUserRTInfoIfConnected = (isMuted: boolean, isDeafened: boolean) => {
    const nodeRef = ref(
      database,
      `participants/${currentRoom.groupId}/${currentRoom.roomId}/${appUser.id}`
    );
    if (connectionStatus === ConnectionStatus.Connected) {
      console.log('pushing RT node:', nodeRef);
      update(nodeRef, {
        isMuted,
        isDeafened,
        isCameraShare: false,
        isScreenShare: false,
      });
    } else {
      console.log('skip pushing RT node:', nodeRef);
    }
  };

  const MuteButton = () => {
    if (mute) {
      return (
        <Tooltip title="Unmute" placement="top" arrow>
          <IconButton
            color="primary"
            aria-label="unmute"
            component="span"
            onClick={() => {
              pushUserRTInfoIfConnected(!mute, deafen);
              dispatch(toggleMute());
            }}
          >
            <MicOffIcon />
          </IconButton>
        </Tooltip>
      );
    }
    return (
      <Tooltip title="Mute" placement="top" arrow>
        <IconButton
          color="primary"
          aria-label="mute"
          component="span"
          onClick={() => {
            pushUserRTInfoIfConnected(!mute, deafen);
            dispatch(toggleMute());
          }}
        >
          <MicIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const DeafenButton = () => {
    if (deafen) {
      return (
        <Tooltip title="Undeafen" placement="top" arrow>
          <IconButton
            color="primary"
            aria-label="undeafen"
            component="span"
            onClick={() => {
              pushUserRTInfoIfConnected(mute, !deafen);
              dispatch(toggleDeafen());
            }}
          >
            <HeadsetOffIcon />
          </IconButton>
        </Tooltip>
      );
    }
    return (
      <Tooltip title="Deafen" placement="top" arrow>
        <IconButton
          color="primary"
          aria-label="deafen"
          component="span"
          onClick={() => {
            pushUserRTInfoIfConnected(mute, !deafen);
            dispatch(toggleDeafen());
          }}
        >
          <HeadsetIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const MenuButton = () => {
    const handleClick = () => {
      alert('Not implemented yet.');
    };

    return (
      <Tooltip title="Settings" placement="top" arrow>
        <IconButton
          color="primary"
          aria-label="settings"
          component="span"
          onClick={handleClick}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const InfoButton = () => {
    const handleClick = async () => {
      window.electron.ipcRenderer.myPing();
      const constraints = navigator.mediaDevices.getSupportedConstraints();
      console.log('constraints:', constraints);
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          console.log('devices:', devices);
          return devices;
        })
        .catch((err) => {
          console.error('error:', err);
          return [];
        });
    };

    return (
      <Tooltip title="Info" placement="top" arrow>
        <IconButton
          color="primary"
          aria-label="info"
          component="span"
          onClick={handleClick}
        >
          <InfoIcon />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <Stack direction="row" alignItems="right" spacing={0}>
      <MuteButton />
      <DeafenButton />
      <MenuButton />
      {debug && <InfoButton />}
    </Stack>
  );
}

export default React.memo(BottomControls);
