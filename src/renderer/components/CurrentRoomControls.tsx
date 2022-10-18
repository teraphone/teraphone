/* eslint-disable no-alert */
/* eslint-disable no-console */
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import * as React from 'react';
import {
  selectCameraIsSharing,
  setCameraIsSharing,
} from '../redux/CameraShareSlice';
import useRoom from '../hooks/useRoom';
import {
  ConnectionStatus,
  selectConnectionStatus,
} from '../redux/ConnectionStatusSlice';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { selectCurrentRoom } from '../redux/CurrentRoomSlice';
import { selectIsSharing, setPickerVisible } from '../redux/ScreenShareSlice';
import '../lib/ExtendedLocalParticipant';
import useVideoItems from '../hooks/useVideoItems';

const ShareCameraButton = (props: {
  status: ConnectionStatus;
  onClick: () => void;
  isSharing: boolean;
  isLoading: boolean;
}) => {
  const { status, onClick, isSharing, isLoading } = props;
  const tooltip = isSharing ? 'Stop sharing camera' : 'Share camera';
  return (
    <Tooltip title={tooltip} placement="top" arrow sx={{ flexGrow: 1 }}>
      <span>
        <LoadingButton
          loading={isLoading}
          disabled={status !== ConnectionStatus.Connected}
          disableElevation
          fullWidth
          onClick={onClick}
          size="small"
          startIcon={isSharing ? <VideocamOffIcon /> : <VideoCameraFrontIcon />}
          sx={{ minWidth: 'unset' }}
          variant="contained"
          color={isSharing ? 'success' : 'primary'}
        >
          Camera
        </LoadingButton>
      </span>
    </Tooltip>
  );
};

const ShareScreenButton = (props: {
  status: ConnectionStatus;
  onClick: () => void;
  isSharing: boolean;
  isLoading: boolean;
}) => {
  const { status, onClick, isSharing, isLoading } = props;
  return (
    <Tooltip title="Share Screens" placement="top" arrow>
      <span>
        <LoadingButton
          loading={isLoading}
          disabled={status !== ConnectionStatus.Connected}
          disableElevation
          fullWidth
          onClick={onClick}
          size="small"
          startIcon={<ScreenShareIcon />}
          variant="contained"
          color={isSharing ? 'success' : 'primary'}
        >
          Screens
        </LoadingButton>
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
  const isCameraShare = useAppSelector(selectCameraIsSharing);
  const isScreenShare = useAppSelector(selectIsSharing);
  const { setUpVideoTrack } = useVideoItems();
  const [cameraLoading, setCameraLoading] = React.useState(false);

  const handleShareCameraClick = React.useCallback(async () => {
    if (room?.localParticipant) {
      setCameraLoading(true);
      try {
        const localTrackPub = await room?.localParticipant.setCameraEnabled(
          !isCameraShare
        );
        dispatch(setCameraIsSharing(!isCameraShare));
        if (!isCameraShare && localTrackPub) {
          setUpVideoTrack(localTrackPub, room.localParticipant);
        }
      } catch (error) {
        console.error(error);
      }
      setCameraLoading(false);
    }
  }, [dispatch, isCameraShare, room?.localParticipant, setUpVideoTrack]);

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
      statusColor = 'primary.light';
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

  return connectionStatus === ConnectionStatus.Disconnected ? null : (
    <>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: 1,
          pl: 1,
          pt: 1,
        }}
      >
        <Box
          sx={{ flexGrow: 0, flexShrink: 0, '&:empty': { display: 'none' } }}
        >
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" sx={{ color: statusColor }}>
            {primaryStatusText}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {currentRoom.roomName}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 0, flexShrink: 0 }}>
          {debug && (
            <InfoButton status={connectionStatus} onClick={handleInfoClick} />
          )}
          <DisconnectButton
            status={connectionStatus}
            onClick={handleDisconnectClick}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '4px',
          p: 1,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <ShareCameraButton
            status={connectionStatus}
            onClick={handleShareCameraClick}
            isSharing={isCameraShare}
            isLoading={cameraLoading}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <ShareScreenButton
            status={connectionStatus}
            onClick={handleShareScreenClick}
            isSharing={isScreenShare}
            isLoading={false}
          />
        </Box>
      </Box>
    </>
  );
}

export default React.memo(CurentRoomControls);
