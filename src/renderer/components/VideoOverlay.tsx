import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Track } from 'livekit-client';

interface VideoOverlayProps {
  isFocusItem: boolean;
  userName: string;
  isPopout: boolean;
  isLocal: boolean;
  sourceType: Track.Source;
}

function VideoOverlay(props: VideoOverlayProps) {
  const { isFocusItem, userName, isPopout, isLocal, sourceType } = props;
  const isScreen = sourceType === Track.Source.ScreenShare;
  const descriptionLocal = `Your ${isScreen ? 'Screen' : 'Camera'}`;
  const descriptionRemote = `${userName}'s ${isScreen ? 'Screen' : 'Camera'}`;
  const description = isLocal ? descriptionLocal : descriptionRemote;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        color: '#0F0',
      }}
    >
      <Typography variant="body1">{description}</Typography>
    </Box>
  );
}

export default VideoOverlay;
