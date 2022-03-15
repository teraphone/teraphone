/* eslint-disable no-console */
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useCurrentRoom from 'renderer/hooks/useCurrentRoom';
import CircularProgress from '@mui/material/CircularProgress';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import useRoom from '../hooks/useRoom';
import useConnection from '../hooks/useConnection';
import { ConnectionState } from '../contexts/ConnectionContext';

function CurentRoomControls() {
  const { currentRoom } = useCurrentRoom();
  const { isConnecting, error, room } = useRoom();
  const { connectionState, setConnectionState } = useConnection();

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

  const DisconnectButton = () => {
    return (
      <Tooltip title="Disconnect" placement="top" arrow>
        <IconButton
          color="primary"
          aria-label="disconnect"
          component="span"
          onClick={() => {
            room?.disconnect();
            console.log('room', room);
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <>
      {connectionState !== ConnectionState.Disconnected && (
        <Box sx={{}}>
          <Status />

          <Typography variant="body2">{`${currentRoom.groupName} / ${currentRoom.roomName}`}</Typography>
          <DisconnectButton />
        </Box>
      )}
    </>
  );
}

export default CurentRoomControls;
