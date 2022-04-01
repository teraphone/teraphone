/* eslint-disable no-alert */
/* eslint-disable no-console */
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useCurrentRoom from 'renderer/hooks/useCurrentRoom';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import CircularProgress from '@mui/material/CircularProgress';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import { ref, remove } from 'firebase/database';
import useRoom from '../hooks/useRoom';
import useConnection from '../hooks/useConnection';
import { ConnectionState } from '../contexts/ConnectionContext';
import useFirebase from '../hooks/useFirebase';
import { useAppSelector } from '../redux/hooks';
import { selectAppUser } from '../redux/AppUserSlice';

function CurentRoomControls() {
  const { currentRoom } = useCurrentRoom();
  const { isConnecting, error, room } = useRoom();
  const { connectionState, setConnectionState } = useConnection();
  const { database } = useFirebase();
  const { appUser } = useAppSelector(selectAppUser);
  const userRTRef = ref(
    database,
    `participants/${currentRoom.groupId}/${currentRoom.roomId}/${appUser.id}`
  );

  React.useEffect(() => {
    // set connection state
    if (error) {
      setConnectionState(ConnectionState.Error);
    } else if (isConnecting) {
      setConnectionState(ConnectionState.Connecting);
    } else if (room && room.state === 'connected') {
      setConnectionState(ConnectionState.Connected);
    } else if (room && room.state === 'reconnecting') {
      setConnectionState(ConnectionState.Reconnecting);
    } else {
      setConnectionState(ConnectionState.Disconnected);
    }
  }, [error, isConnecting, room, setConnectionState]);

  React.useEffect(() => {
    // remove userRTRef on window unload event
    window.addEventListener('beforeunload', () => {
      console.log('handling window unloaded event');
      remove(userRTRef);
    });
  }, [userRTRef]);

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

  const Status = () => {
    switch (connectionState) {
      case ConnectionState.Connected: {
        return <StatusConnected />;
      }
      case ConnectionState.Connecting: {
        return <StatusConnecting />;
      }
      case ConnectionState.Error: {
        return <StatusError />;
      }
      case ConnectionState.Reconnecting: {
        return <StatusConnecting />;
      }
      default: {
        return <></>;
      }
    }
  };

  const ShareCameraButton = () => {
    return (
      <Tooltip title="Share Camera" placement="top" arrow>
        <span>
          <IconButton
            color="primary"
            aria-label="disconnect"
            component="span"
            onClick={() => {
              alert('Not implemented yet.');
            }}
            disabled
          >
            <VideoCameraFrontIcon />
          </IconButton>
        </span>
      </Tooltip>
    );
  };

  const ShareScreenButton = () => {
    return (
      <Tooltip title="Share Screen" placement="top" arrow>
        <span>
          <IconButton
            color="primary"
            aria-label="disconnect"
            component="span"
            onClick={() => {
              alert('Not implemented yet.');
            }}
            disabled
          >
            <ScreenShareIcon />
          </IconButton>
        </span>
      </Tooltip>
    );
  };

  const DisconnectButton = () => {
    return (
      <Tooltip title="Disconnect" placement="top" arrow>
        <span>
          <IconButton
            color="primary"
            aria-label="disconnect"
            component="span"
            onClick={() => {
              room?.disconnect();
              remove(userRTRef);
              console.log('room', room);
            }}
            disabled={connectionState !== ConnectionState.Connected}
          >
            <LogoutIcon />
          </IconButton>
        </span>
      </Tooltip>
    );
  };

  return (
    <>
      {connectionState !== ConnectionState.Disconnected && (
        <Box sx={{}}>
          <Status />

          <Typography variant="body2">{`${currentRoom.groupName} / ${currentRoom.roomName}`}</Typography>
          <Box>
            <ShareCameraButton />
            <ShareScreenButton />
            <DisconnectButton />
          </Box>
        </Box>
      )}
    </>
  );
}

export default CurentRoomControls;
