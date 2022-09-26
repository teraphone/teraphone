import HeadsetIcon from '@mui/icons-material/Headset';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import * as React from 'react';
import { Avatar, Box, Tooltip } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  ConnectionStatus,
  selectConnectionStatus,
} from '../redux/ConnectionStatusSlice';
import {
  selectMute,
  selectDeafen,
  toggleMute,
  toggleDeafen,
} from '../redux/MuteSlice';

const MuteButton = (props: { mute: boolean; onClick: () => void }) => {
  const { mute, onClick } = props;
  const { connectionStatus } = useAppSelector(selectConnectionStatus);
  const isDisabled =
    connectionStatus === ConnectionStatus.Connecting ||
    connectionStatus === ConnectionStatus.Reconnecting;

  const handleClick = React.useCallback(() => {
    if (!isDisabled) {
      onClick();
    }
  }, [isDisabled, onClick]);

  if (mute) {
    return (
      <Tooltip title="Unmute" placement="top" arrow>
        <Avatar
          sx={{ bgcolor: 'black' }}
          aria-label="unmute"
          onClick={handleClick}
        >
          <MicOffIcon />
        </Avatar>
      </Tooltip>
    );
  }
  return (
    <Tooltip title="Mute" placement="top" arrow>
      <Avatar sx={{ bgcolor: 'black' }} aria-label="mute" onClick={handleClick}>
        <MicIcon />
      </Avatar>
    </Tooltip>
  );
};

const DeafenButton = (props: { deafen: boolean; onClick: () => void }) => {
  const { deafen, onClick } = props;
  const { connectionStatus } = useAppSelector(selectConnectionStatus);
  const isDisabled =
    connectionStatus === ConnectionStatus.Connecting ||
    connectionStatus === ConnectionStatus.Reconnecting;

  const handleClick = React.useCallback(() => {
    if (!isDisabled) {
      onClick();
    }
  }, [isDisabled, onClick]);

  if (deafen) {
    return (
      <Tooltip title="Undeafen" placement="top" arrow>
        <Avatar
          sx={{ bgcolor: 'black' }}
          aria-label="undeafen"
          onClick={handleClick}
        >
          <HeadsetOffIcon />
        </Avatar>
      </Tooltip>
    );
  }
  return (
    <Tooltip title="Deafen" placement="top" arrow>
      <Avatar
        sx={{ bgcolor: 'black' }}
        aria-label="deafen"
        onClick={handleClick}
      >
        <HeadsetIcon />
      </Avatar>
    </Tooltip>
  );
};

const VideoOverlayControls = () => {
  const dispatch = useAppDispatch();
  const mute = useAppSelector(selectMute);
  const deafen = useAppSelector(selectDeafen);

  const handleMuteClick = React.useCallback(() => {
    dispatch(toggleMute());
  }, [dispatch]);

  const handleDeafenClick = React.useCallback(() => {
    dispatch(toggleDeafen());
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: 'inline-block',
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ pb: 0.5, pr: 0.5 }}>
          <MuteButton mute={mute} onClick={handleMuteClick} />
        </Box>
        <Box sx={{ pb: 0.5 }}>
          <DeafenButton deafen={deafen} onClick={handleDeafenClick} />
        </Box>
      </Box>
    </Box>
  );
};

export default VideoOverlayControls;
