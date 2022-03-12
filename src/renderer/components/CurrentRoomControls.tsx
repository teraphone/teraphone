/* eslint-disable no-console */
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useCurrentRoom from 'renderer/hooks/useCurrentRoom';
import PendingIcon from '@mui/icons-material/Pending';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import useRoom from '../hooks/useRoom';

function CurentRoomControls() {
  const { currentRoom } = useCurrentRoom();
  const { isConnecting, error } = useRoom();
  const isActive: boolean =
    currentRoom.roomId !== 0 && currentRoom.roomId !== undefined;
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

  console.log('currentRoom', currentRoom);
  console.log('isActive', isActive);
  console.log('msg', msg);

  return (
    isActive && (
      <Box sx={{}}>
        <Status />

        <Typography variant="body2">Room Name: {msg}.</Typography>
      </Box>
    )
  );
}

export default CurentRoomControls;
