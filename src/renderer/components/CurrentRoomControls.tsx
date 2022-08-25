/* eslint-disable no-alert */
/* eslint-disable no-console */
import {
  Box,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Stack,
  Button,
} from '@mui/material';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import * as React from 'react';
import useRoom from '../hooks/useRoom';
import {
  ConnectionStatus,
  selectConnectionStatus,
} from '../redux/ConnectionStatusSlice';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectCurrentRoom } from '../redux/CurrentRoomSlice';
import { setPickerVisible } from '../redux/ScreenShareSlice';
import '../lib/ExtendedLocalParticipant';

const ShareCameraButton = (props: {
  // status: ConnectionStatus;
  onClick: () => void;
}) => {
  const { /* status, */ onClick } = props;
  return (
    <Tooltip title="Share Camera" placement="top" arrow sx={{ flexGrow: 1 }}>
      <span>
        <Button
          disabled
          // disabled={status !== ConnectionStatus.Connected}
          disableElevation
          fullWidth
          onClick={onClick}
          size="small"
          startIcon={<VideoCameraFrontIcon />}
          sx={{ backgroundColor: 'black', minWidth: 'unset' }}
          variant="contained"
        >
          Camera
        </Button>
      </span>
    </Tooltip>
  );
};

const ShareScreenButton = (props: {
  status: ConnectionStatus;
  onClick: () => void;
}) => {
  const { status, onClick } = props;
  return (
    <Tooltip title="Share Screens" placement="top" arrow>
      <span>
        <Button
          disabled={status !== ConnectionStatus.Connected}
          disableElevation
          fullWidth
          onClick={onClick}
          size="small"
          startIcon={<ScreenShareIcon />}
          sx={{ backgroundColor: 'black' }}
          variant="contained"
        >
          Screens
        </Button>
      </span>
    </Tooltip>
  );
};

const DisconnectButton = (props: {
  status: ConnectionStatus;
  onClick: () => void;
}) => {
  const { status, onClick } = props;
  return (
    <Tooltip title="Disconnect" placement="top" arrow>
      <span>
        <IconButton
          aria-label="disconnect"
          component="span"
          onClick={onClick}
          disabled={status !== ConnectionStatus.Connected}
        >
          <LogoutIcon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

const InfoButton = (props: {
  status: ConnectionStatus;
  onClick: () => void;
}) => {
  const { status, onClick } = props;
  return (
    <Tooltip title="Info" placement="top" arrow>
      <span>
        <IconButton
          color="primary"
          aria-label="info"
          component="span"
          onClick={onClick}
          disabled={status !== ConnectionStatus.Connected}
        >
          <InfoIcon sx={{ color: 'black' }} />
        </IconButton>
      </span>
    </Tooltip>
  );
};

function CurentRoomControls() {
  const dispatch = useAppDispatch();
  const { currentRoom } = useAppSelector(selectCurrentRoom);
  const { room } = useRoom();
  const { connectionStatus } = useAppSelector(selectConnectionStatus);
  const debug = false;

  const handleShareCameraClick = React.useCallback(() => {
    console.log('handleShareCameraClick');
  }, []);

  const handleShareScreenClick = React.useCallback(() => {
    dispatch(setPickerVisible(true));
  }, [dispatch]);

  const handleDisconnectClick = React.useCallback(async () => {
    if (!room) {
      return;
    }
    await room.disconnect();
  }, [room]);

  const handleInfoClick = React.useCallback(() => {
    console.log('room', room);
  }, [room]);

  let statusColor: string;
  let primaryStatusText: string;
  let icon: React.ReactElement;

  switch (connectionStatus) {
    case ConnectionStatus.Connected:
      primaryStatusText = 'Voice Connected';
      statusColor = 'success.light';
      icon = (
        <SignalCellularAltIcon fontSize="medium" sx={{ color: statusColor }} />
      );
      break;
    case ConnectionStatus.Connecting:
      primaryStatusText = 'Voice Connecting';
      statusColor = 'warning.light';
      icon = <CircularProgress size={16} sx={{ color: statusColor }} />;
      break;
    case ConnectionStatus.Error:
      primaryStatusText = 'Error Connecting';
      statusColor = 'error.light';
      icon = <ErrorOutlineIcon fontSize="medium" sx={{ color: statusColor }} />;
      break;
    case ConnectionStatus.Reconnecting:
      primaryStatusText = 'Voice Connecting';
      statusColor = 'warning.light';
      icon = <CircularProgress size={16} sx={{ color: statusColor }} />;
      break;
    default: {
      primaryStatusText = 'Voice Disconnected';
      statusColor = 'common.black';
      icon = <></>;
    }
  }

  const secondaryStatusText = `${currentRoom.teamName} / ${currentRoom.roomName}`;

  return connectionStatus === ConnectionStatus.Disconnected ? null : (
    <Stack sx={{ backgroundColor: '#f8f8f8' }}>
      <ListItem
        disableGutters
        disablePadding
        sx={{
          py: '2px',
        }}
        secondaryAction={
          <>
            {debug && (
              <InfoButton status={connectionStatus} onClick={handleInfoClick} />
            )}
            <DisconnectButton
              status={connectionStatus}
              onClick={handleDisconnectClick}
            />
          </>
        }
      >
        <ListItemIcon
          sx={{
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={primaryStatusText}
          primaryTypographyProps={{
            variant: 'body2',
            sx: { color: statusColor },
          }}
          secondary={secondaryStatusText}
          secondaryTypographyProps={{ variant: 'body2' }}
        />
      </ListItem>
      <ListItem sx={{ p: 1, textAlign: 'center', justifyContent: 'center' }}>
        <Stack direction="row" gap={1} width="100%">
          <Box sx={{ flexGrow: 1 }}>
            <ShareCameraButton
              // status={connectionStatus}
              onClick={handleShareCameraClick}
            />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <ShareScreenButton
              status={connectionStatus}
              onClick={handleShareScreenClick}
            />
          </Box>
        </Stack>
      </ListItem>
    </Stack>
  );
}

export default React.memo(CurentRoomControls);
