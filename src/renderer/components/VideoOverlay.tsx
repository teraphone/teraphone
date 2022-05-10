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
  hidden?: boolean;
}

function VideoOverlay(props: VideoOverlayProps) {
  const { isFocusItem, userName, isPopout, isLocal, sourceType, hidden } =
    props;
  const isScreen = sourceType === Track.Source.ScreenShare;
  const descriptionLocal = `Your ${isScreen ? 'Screen' : 'Camera'}`;
  const descriptionRemote = `${userName}'s ${isScreen ? 'Screen' : 'Camera'}`;
  const description = isLocal ? descriptionLocal : descriptionRemote;

  return (
    <Box
      hidden={hidden}
      sx={{
        boxSizing: 'border-box',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        color: 'white',
        width: '100%',
        height: '20%',
        background:
          'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.0))',
        padding: '5px',
      }}
    >
      <Typography variant="body1">{description}</Typography>
    </Box>
  );
}

VideoOverlay.defaultProps = {
  hidden: false,
};

export default VideoOverlay;
