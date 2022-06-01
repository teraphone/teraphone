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
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  selectMute,
  selectDeafen,
  toggleMute,
  toggleDeafen,
} from '../redux/MuteSlice';
import { selectAppUser } from '../redux/AppUserSlice';

const MuteButton = (props: { mute: boolean; onClick: () => void }) => {
  const { mute, onClick } = props;
  if (mute) {
    return (
      <Tooltip title="Unmute" placement="top" arrow>
        <IconButton
          color="primary"
          aria-label="unmute"
          component="span"
          onClick={onClick}
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
      >
        <MicIcon />
      </IconButton>
    </Tooltip>
  );
};

const DeafenButton = (props: { deafen: boolean; onClick: () => void }) => {
  const { deafen, onClick } = props;
  if (deafen) {
    return (
      <Tooltip title="Undeafen" placement="top" arrow>
        <IconButton
          color="primary"
          aria-label="undeafen"
          component="span"
          onClick={onClick}
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
  const dispatch = useAppDispatch();
  const mute = useAppSelector(selectMute);
  const deafen = useAppSelector(selectDeafen);
  const { appUser } = useAppSelector(selectAppUser);
  const debug = false;

  const handleMuteClick = React.useCallback(() => {
    dispatch(toggleMute());
  }, [dispatch]);

  const handleDeafenClick = React.useCallback(() => {
    dispatch(toggleDeafen());
  }, [dispatch]);

  const handleMenuClick = React.useCallback(() => {
    alert('Not implemented yet.');
  }, []);

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
        m: '2px',
        backgroundColor: '#f8f8f8',
      }}
    >
      <List
        dense
        sx={{
          boxSizing: 'border-box',
          p: 0,
        }}
      >
        <ListItem
          disableGutters
          disablePadding
          sx={{
            py: '2px',
          }}
          secondaryAction={
            <>
              <MuteButton mute={mute} onClick={handleMuteClick} />
              <DeafenButton deafen={deafen} onClick={handleDeafenClick} />
              <MenuButton onClick={handleMenuClick} />
              {debug && <InfoButton onClick={handleInfoClick} />}
            </>
          }
        >
          <ListItemIcon
            sx={{
              textAlign: 'center',
              justifyContent: 'center',
            }}
          >
            <Avatar sx={{ width: 20, height: 20, fontSize: 14 }}>
              {appUser.name[0]}
            </Avatar>
          </ListItemIcon>
          <ListItemText
            primary={appUser.name}
            primaryTypographyProps={{
              variant: 'body2',
            }}
          />
        </ListItem>
      </List>
    </Box>
  );
}

export default React.memo(BottomControls);
