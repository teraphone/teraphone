/* eslint-disable no-console */
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useCurrentRoom from 'renderer/hooks/useCurrentRoom';
import PendingIcon from '@mui/icons-material/Pending';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import useRoom from '../hooks/useRoom';

function CurentRoomControls() {
  const { currentRoom } = useCurrentRoom();
  const { isConnecting, error, room } = useRoom();
  const isActive: boolean =
    currentRoom.roomId !== 0 &&
    currentRoom.roomId !== undefined &&
    room?.state !== 'disconnected';
  const msg = isActive
    ? `${currentRoom.groupName} / ${currentRoom.roomName}`
    : 'none';

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
        <PendingIcon
          fontSize="medium"
          sx={{
            mb: -0.5,

            color: 'warning.light',
          }}
        />
        {' Voice Connecting'}
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
    if (error) {
      return <StatusError />;
    }
    if (isConnecting) {
      return <StatusConnecting />;
    }
    return <StatusConnected />;
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
      {isActive && (
        <Box sx={{}}>
          <Status />

          <Typography variant="body2">{msg}.</Typography>
          <DisconnectButton />
        </Box>
      )}
    </>
  );
}

export default CurentRoomControls;
