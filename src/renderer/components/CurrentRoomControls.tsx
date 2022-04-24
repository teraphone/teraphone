/* eslint-disable no-alert */
/* eslint-disable no-console */
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import CircularProgress from '@mui/material/CircularProgress';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import { ref, remove } from 'firebase/database';
import * as React from 'react';
import useRoom from '../hooks/useRoom';
import {
  ConnectionStatus,
  selectConnectionStatus,
} from '../redux/ConnectionStatusSlice';
import useFirebase from '../hooks/useFirebase';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectAppUser } from '../redux/AppUserSlice';
import { selectCurrentRoom } from '../redux/CurrentRoomSlice';
import { setPickerVisible } from '../redux/ScreenShareSlice';
import '../lib/ExtendedLocalParticipant';

function CurentRoomControls() {
  const dispatch = useAppDispatch();
  const { currentRoom } = useAppSelector(selectCurrentRoom);
  const { room } = useRoom();
  const { connectionStatus } = useAppSelector(selectConnectionStatus);
  const { database } = useFirebase();
  const { appUser } = useAppSelector(selectAppUser);
  const userRTRef = ref(
    database,
    `participants/${currentRoom.groupId}/${currentRoom.roomId}/${appUser.id}`
  );
  const debug = true;

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
    switch (connectionStatus) {
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
    const enabled = room?.localParticipant.isScreenShareEnabled;
    return (
      <Tooltip title="Share Screen" placement="top" arrow>
        <span>
          <IconButton
            color="primary"
            aria-label="disconnect"
            component="span"
            onClick={() => {
              dispatch(setPickerVisible(true));
            }}
            disabled={connectionStatus !== ConnectionStatus.Connected}
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
            disabled={connectionStatus !== ConnectionStatus.Connected}
          >
            <LogoutIcon />
          </IconButton>
        </span>
      </Tooltip>
    );
  };

  const InfoButton = () => {
    const handleClick = () => {
      const localParticipant = room?.localParticipant;
      const id = '1';
      const enabled = true;
      localParticipant?.extendedSetTrackEnabled(id, enabled);
    };
    return (
      <Tooltip title="Info" placement="top" arrow>
        <span>
          <IconButton
            color="primary"
            aria-label="info"
            component="span"
            onClick={handleClick}
            disabled={connectionStatus !== ConnectionStatus.Connected}
          >
            <InfoIcon />
          </IconButton>
        </span>
      </Tooltip>
    );
  };

  return (
    <>
      {connectionStatus !== ConnectionStatus.Disconnected && (
        <Box sx={{}}>
          <Status />

          <Typography variant="body2">{`${currentRoom.groupName} / ${currentRoom.roomName}`}</Typography>
          <Box>
            <ShareCameraButton />
            <ShareScreenButton />
            <DisconnectButton />
            {debug && <InfoButton />}
          </Box>
        </Box>
      )}
    </>
  );
}

export default React.memo(CurentRoomControls);
