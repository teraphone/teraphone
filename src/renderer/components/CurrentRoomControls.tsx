/* eslint-disable no-console */
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useCurrentRoom from 'renderer/hooks/useCurrentRoom';

function CurentRoomControls() {
  const { currentRoom } = useCurrentRoom();
  const isActive = currentRoom.roomId !== 0 && currentRoom.roomId !== undefined;
  const msg = isActive
    ? `${currentRoom.groupName} / ${currentRoom.roomName}`
    : 'none';

  console.log('currentRoom', currentRoom);
  console.log('isActive', isActive);
  console.log('msg', msg);

  return (
    <Box sx={{}}>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
        }}
      >
        Room Name: {msg}.
      </Typography>
    </Box>
  );
}

export default CurentRoomControls;
