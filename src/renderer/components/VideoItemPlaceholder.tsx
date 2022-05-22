import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export interface VideoItemPlaceholderProps {
  message: string;
  buttonText: string | undefined;
  buttonAction: () => void | undefined;
}

function VideoItemPlaceholder(props: VideoItemPlaceholderProps) {
  const { message, buttonText, buttonAction } = props;
  return (
    <Box>
      <Typography
        sx={{
          color: 'white',
        }}
        variant="body1"
      >
        {message}
      </Typography>
      {buttonText && (
        <Button variant="outlined" onClick={buttonAction}>
          {buttonText}
        </Button>
      )}
    </Box>
  );
}

export default VideoItemPlaceholder;
