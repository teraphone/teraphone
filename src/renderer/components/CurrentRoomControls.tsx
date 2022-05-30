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
          color="primary"
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
  const { database } = useFirebase();
  const { appUser } = useAppSelector(selectAppUser);
  const userRTRef = ref(
    database,
    `participants/${currentRoom.groupId}/${currentRoom.roomId}/${appUser.id}`
  );
  const debug = false;

  const handleShareCameraClick = React.useCallback(() => {
    console.log('handleShareCameraClick');
  }, []);

  const handleShareScreenClick = React.useCallback(() => {
    dispatch(setPickerVisible(true));
  }, [dispatch]);

  const handleDisconnectClick = React.useCallback(() => {
    room?.disconnect();
    remove(userRTRef);
  }, [room, userRTRef]);

  const handleInfoClick = React.useCallback(() => {
    console.log('room', room);
  }, [room]);

  return (
    <>
      {connectionStatus !== ConnectionStatus.Disconnected && (
        <Box sx={{}}>
          <Status status={connectionStatus} />

          <Typography variant="body2">{`${currentRoom.groupName} / ${currentRoom.roomName}`}</Typography>
          <Box>
            <ShareCameraButton
              status={connectionStatus}
              onClick={handleShareCameraClick}
            />
            <ShareScreenButton
              status={connectionStatus}
              onClick={handleShareScreenClick}
            />
            <DisconnectButton
              status={connectionStatus}
              onClick={handleDisconnectClick}
            />
            {debug && (
              <InfoButton status={connectionStatus} onClick={handleInfoClick} />
            )}
          </Box>
        </Box>
      )}
    </>
  );
}

export default React.memo(CurentRoomControls);
