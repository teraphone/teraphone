import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import * as React from 'react';
import * as models from '../models/models';

function CurentRoomControls() {
  return (
    <Box sx={{}}>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
        }}
      >
        Room Name
      </Typography>
    </Box>
  );
}

export default CurentRoomControls;
