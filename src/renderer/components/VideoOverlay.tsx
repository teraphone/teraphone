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
    <>
      <Box // top overlay
        hidden={hidden}
        sx={{
          boxSizing: 'border-box',
          position: 'absolute',
          top: 0,
          zIndex: 1,
          width: '100%',
          height: '20%',
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.0))',
        }}
      >
        <Box // top left
          sx={{
            boxSizing: 'border-box',
            padding: '5px',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <Typography variant="body1" color="white">
            {description}
          </Typography>
        </Box>
        <Box // top right
          sx={{
            boxSizing: 'border-box',
            padding: '5px',
            position: 'absolute',
            top: 0,
            right: 0,
          }}
        >
          <Typography variant="body1" color="white">
            top-right
          </Typography>
        </Box>
      </Box>

      <Box // bottom
        hidden={hidden}
        sx={{
          boxSizing: 'border-box',
          position: 'absolute',
          bottom: 0,
          zIndex: 1,
          width: '100%',
          height: '20%',
          background:
            'linear-gradient(to top, rgba(0,0,0,0.3), rgba(0,0,0,0.0))',
        }}
      >
        <Box // bottom left
          sx={{
            boxSizing: 'border-box',
            padding: '5px',
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}
        >
          <Typography variant="body1" color="white">
            bottom-left
          </Typography>
        </Box>
        <Box // bottom right
          sx={{
            boxSizing: 'border-box',
            padding: '5px',
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}
        >
          <Typography variant="body1" color="white">
            bottom-right
          </Typography>
        </Box>
      </Box>
    </>
  );
}

VideoOverlay.defaultProps = {
  hidden: false,
};

export default VideoOverlay;
