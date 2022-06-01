/* eslint-disable no-alert */
/* eslint-disable no-console */
import {
  Box,
  Avatar,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  Typography,
  CircularProgress,
  Stack,
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

const StatusConnected = () => {
  return (
    <Typography variant="body1" sx={{ color: 'success.light' }}>
      <SignalCellularAltIcon
        fontSize="medium"
        sx={{
          mb: -0.5,

          color: 'success.light',
        }}
      />
      {' Voice Connected'}
    </Typography>
  );
};

const StatusConnecting = () => {
  return (
    <Typography variant="body1" sx={{ color: 'warning.light' }}>
      <CircularProgress size={16} sx={{ mx: 0.5, color: 'warning.light' }} />
      {'  Voice Connecting'}
    </Typography>
  );
};

const StatusError = () => {
  return (
    <Typography variant="body1" sx={{ color: 'error.light' }}>
      <ErrorOutlineIcon
        fontSize="medium"
        sx={{
          mb: -0.5,

          color: 'error.light',
        }}
      />
      {' Error Connecting'}
    </Typography>
  );
};

const Status = (props: { status: ConnectionStatus }) => {
  const { status } = props;
  switch (status) {
    case ConnectionStatus.Connected: {
      return <StatusConnected />;
    }
    case ConnectionStatus.Connecting: {
      return <StatusConnecting />;
    }
    case ConnectionStatus.Error: {
      return <StatusError />;
    }
    case ConnectionStatus.Reconnecting: {
      return <StatusConnecting />;
    }
    default: {
      return <></>;
    }
  }
};

const ShareCameraButton = (props: {
  status: ConnectionStatus;
  onClick: () => void;
}) => {
  const { status, onClick } = props;
  return (
    <Tooltip title="Share Camera" placement="top" arrow>
      <span>
        <IconButton
          color="primary"
          aria-label="disconnect"
          component="span"
          onClick={onClick}
          disabled
        >
          <VideoCameraFrontIcon />
        </IconButton>
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
    <Tooltip title="Share Screen" placement="top" arrow>
      <span>
        <IconButton
          color="primary"
          aria-label="disconnect"
          component="span"
          onClick={onClick}
          disabled={status !== ConnectionStatus.Connected}
        >
          <ScreenShareIcon />
        </IconButton>
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
          <LogoutIcon sx={{ color: 'black' }} />
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
          <InfoIcon />
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
  const debug = true;

  const handleShareCameraClick = React.useCallback(() => {
    console.log('handleShareCameraClick');
  }, []);

  const handleShareScreenClick = React.useCallback(() => {
    dispatch(setPickerVisible(true));
  }, [dispatch]);

  const handleDisconnectClick = React.useCallback(() => {
    room?.disconnect();
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

  const secondaryStatusText = `${currentRoom.groupName} / ${currentRoom.roomName}`;

  return (
    <>
      {connectionStatus !== ConnectionStatus.Disconnected && (
        <Box sx={{}}>
          <List
            dense
            sx={{
              boxSizing: 'border-box',
              mx: '2px',
            }}
          >
            <ListItem
              disableGutters
              disablePadding
              sx={{
                // pl: '0px',
                // pr: '40px',
                py: '2px',
                my: '2px',
                backgroundColor: '#f8f8f8',
              }}
              secondaryAction={
                <DisconnectButton
                  status={connectionStatus}
                  onClick={handleDisconnectClick}
                />
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
                  variant: 'body1',
                  sx: {
                    color: statusColor,
                  },
                }}
                secondary={secondaryStatusText}
              />
            </ListItem>
          </List>
          <Stack direction="row" spacing={2}>
            <ShareCameraButton
              status={connectionStatus}
              onClick={handleShareCameraClick}
            />
            <ShareScreenButton
              status={connectionStatus}
              onClick={handleShareScreenClick}
            />
          </Stack>
        </Box>
      )}
    </>
  );
}

export default React.memo(CurentRoomControls);
