import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Track } from 'livekit-client';
import OpenInFullIcon from '@mui/icons-material/OpenInFull'; // focus
import GridViewIcon from '@mui/icons-material/GridView'; // grid
import OpenInNewIcon from '@mui/icons-material/OpenInNew'; // popout
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

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

  const FocusButton = () => {
    return (
      <Tooltip title="Focus View (click)">
        <IconButton
          color="primary"
          aria-label="focus"
          component="span"
          onClick={() => {
            console.log('clicked focus button');
          }}
        >
          <OpenInFullIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const GridButton = () => {
    return (
      <Tooltip title="Grid View (esc)">
        <IconButton
          color="primary"
          aria-label="focus"
          component="span"
          onClick={() => {
            console.log('clicked grid button');
          }}
        >
          <GridViewIcon />
        </IconButton>
      </Tooltip>
    );
  };

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
          {!isFocusItem ? <FocusButton /> : <GridButton />}
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
