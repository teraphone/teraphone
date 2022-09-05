/* eslint-disable no-alert */
/* eslint-disable no-console */
import IconButton from '@mui/material/IconButton';
import HeadsetIcon from '@mui/icons-material/Headset';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import { Avatar, Box, Typography, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  selectMute,
  selectDeafen,
  toggleMute,
  toggleDeafen,
} from '../redux/MuteSlice';
import { selectAppUser } from '../redux/AppUserSlice';
import {
  ConnectionStatus,
  selectConnectionStatus,
} from '../redux/ConnectionStatusSlice';
import { selectUserAvatars } from '../redux/AvatarSlice';
import { setIsVisible } from '../redux/SettingsSlice';

const MuteButton = (props: { mute: boolean; onClick: () => void }) => {
  const { mute, onClick } = props;
  const { connectionStatus } = useAppSelector(selectConnectionStatus);
  const isDisabled =
    connectionStatus === ConnectionStatus.Connecting ||
    connectionStatus === ConnectionStatus.Reconnecting;
  if (mute) {
    return (
      <Tooltip title="Unmute" placement="top" arrow>
        <IconButton
          color="primary"
          aria-label="unmute"
          component="span"
          onClick={onClick}
          disabled={isDisabled}
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
        onClick={onClick}
        disabled={isDisabled}
      >
        <MicIcon />
      </IconButton>
    </Tooltip>
  );
};

const DeafenButton = (props: { deafen: boolean; onClick: () => void }) => {
  const { deafen, onClick } = props;
  const { connectionStatus } = useAppSelector(selectConnectionStatus);
  const isDisabled =
    connectionStatus === ConnectionStatus.Connecting ||
    connectionStatus === ConnectionStatus.Reconnecting;
  if (deafen) {
    return (
      <Tooltip title="Undeafen" placement="top" arrow>
        <IconButton
          color="primary"
          aria-label="undeafen"
          component="span"
          onClick={onClick}
          disabled={isDisabled}
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
        onClick={onClick}
        disabled={isDisabled}
      >
        <HeadsetIcon />
      </IconButton>
    </Tooltip>
  );
};

const MenuButton = (props: { onClick: () => void }) => {
  const { onClick } = props;
  return (
    <Tooltip title="Settings" placement="top" arrow>
      <IconButton
        color="primary"
        aria-label="settings"
        component="span"
        onClick={onClick}
      >
        <SettingsIcon />
      </IconButton>
    </Tooltip>
  );
};

const InfoButton = (props: { onClick: () => void }) => {
  const { onClick } = props;
  return (
    <Tooltip title="Info" placement="top" arrow>
      <IconButton
        color="primary"
        aria-label="info"
        component="span"
        onClick={onClick}
      >
        <InfoIcon />
      </IconButton>
    </Tooltip>
  );
};

function BottomControls() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const mute = useAppSelector(selectMute);
  const deafen = useAppSelector(selectDeafen);
  const { tenantUser } = useAppSelector(selectAppUser);
  const userAvatars = useAppSelector(selectUserAvatars);
  const debug = false;

  const handleMuteClick = React.useCallback(() => {
    dispatch(toggleMute());
  }, [dispatch]);

  const handleDeafenClick = React.useCallback(() => {
    dispatch(toggleDeafen());
  }, [dispatch]);

  const handleMenuClick = React.useCallback(() => {
    dispatch(setIsVisible(true));
  }, [dispatch]);

  const handleInfoClick = React.useCallback(async () => {
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
  }, []);

  return (
    <Box
      sx={{
        alignItems: 'center',
        borderColor: 'divider',
        borderTopStyle: 'solid',
        borderTopWidth: 1,
        boxShadow: theme.custom.shadows.footer,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Avatar
        src={userAvatars[tenantUser.oid]}
        sx={{ width: 20, height: 20, fontSize: 14, m: 1, flexShrink: 0 }}
      >
        {tenantUser.name[0]}
      </Avatar>
      <Typography
        variant="body2"
        sx={{
          flexGrow: 1,
          flexShrink: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {tenantUser.name}
      </Typography>
      <Box sx={{ display: 'flex', flexShrink: 0 }}>
        <MuteButton mute={mute} onClick={handleMuteClick} />
        <DeafenButton deafen={deafen} onClick={handleDeafenClick} />
        <MenuButton onClick={handleMenuClick} />
        {debug && <InfoButton onClick={handleInfoClick} />}
      </Box>
    </Box>
  );
}

export default React.memo(BottomControls);
