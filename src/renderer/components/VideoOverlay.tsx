import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Track } from 'livekit-client';
import FitScreenIcon from '@mui/icons-material/FitScreen'; // focus
import GridViewIcon from '@mui/icons-material/GridView'; // grid
import OpenInNewIcon from '@mui/icons-material/OpenInNew'; // popout
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';

interface VideoOverlayProps {
  hidden: boolean;
  isFocusItem: boolean;
  isLocal: boolean;
  isPopout: boolean;
  setFocus: (sid: string) => void;
  setIsPopout: (sid: string, isPopout: boolean) => void;
  sid: string;
  sourceType: Track.Source;
  userName: string;
}

const overlayTheme = createTheme({
  palette: {
    primary: {
      main: '#fff',
    },
  },
});

const FocusButton = (props: { theme: Theme; onClick: () => void }) => {
  const { theme, onClick } = props;
  return (
    <ThemeProvider theme={theme}>
      <Tooltip title="Focus View (click)" placement="left">
        <IconButton
          color="primary"
          aria-label="focus"
          component="span"
          onClick={onClick}
          sx={{
            '& svg': { filter: 'drop-shadow(0 1px 4px black)' },
          }}
        >
          <FitScreenIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </ThemeProvider>
  );
};

const GridButton = (props: { theme: Theme; onClick: () => void }) => {
  const { theme, onClick } = props;
  return (
    <ThemeProvider theme={theme}>
      <Tooltip title="Grid View (esc)" placement="left">
        <IconButton
          color="primary"
          aria-label="focus"
          component="span"
          onClick={onClick}
          sx={{
            '& svg': { filter: 'drop-shadow(0 1px 4px black)' },
          }}
        >
          <GridViewIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </ThemeProvider>
  );
};

const PopoutButton = (props: { theme: Theme; onClick: () => void }) => {
  const { theme, onClick } = props;
  return (
    <ThemeProvider theme={theme}>
      <Tooltip title="Pop Out" placement="left">
        <IconButton
          color="primary"
          aria-label="focus"
          component="span"
          onClick={onClick}
          sx={{
            '& svg': { filter: 'drop-shadow(0 1px 4px black)' },
          }}
        >
          <OpenInNewIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </ThemeProvider>
  );
};

function VideoOverlay(props: VideoOverlayProps) {
  const {
    hidden,
    isFocusItem,
    isLocal,
    isPopout,
    setFocus,
    setIsPopout,
    sid,
    sourceType,
    userName,
  } = props;
  const isScreen = sourceType === Track.Source.ScreenShare;
  const descriptionLocal = `Your ${isScreen ? 'Screen' : 'Camera'}`;
  const descriptionRemote = `${userName}'s ${isScreen ? 'Screen' : 'Camera'}`;
  const description = isLocal ? descriptionLocal : descriptionRemote;

  const handleFocusClick = React.useCallback(() => {
    setFocus(sid);
  }, [setFocus, sid]);

  const handleGridClick = React.useCallback(() => {
    setFocus('');
  }, [setFocus]);

  const handlePopoutClick = React.useCallback(() => {
    setIsPopout(sid, true);
  }, [setIsPopout, sid]);

  return (
    <Box
      className="video-overlay"
      sx={{
        bottom: 0,
        left: 0,
        opacity: hidden ? 0 : 1,
        position: 'absolute',
        right: 0,
        top: 0,
        transition: hidden ? 'opacity 2s' : 'opacity 0.3s',
        ...(isFocusItem && {
          '&:not(:hover)': { opacity: 0 },
        }),
      }}
    >
      <Box // full size overlay click target
        onClick={!isFocusItem ? handleFocusClick : handleGridClick}
        sx={{
          bottom: 0,
          cursor: 'pointer',
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
        }}
      />
      <Box // top overlay
        className="video-overlay-top"
        sx={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.0))',
          boxSizing: 'border-box',
          height: '10%',
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: 1,
        }}
      >
        <Box // top left
          sx={{
            boxSizing: 'border-box',
            left: 0,
            padding: '5px',
            position: 'absolute',
            top: 0,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              textShadow: '0 1px 4px black',
            }}
          >
            {description}
          </Typography>
        </Box>
        <Box // top right
          sx={{
            boxSizing: 'border-box',
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          {!isFocusItem ? (
            <FocusButton theme={overlayTheme} onClick={handleFocusClick} />
          ) : (
            <GridButton theme={overlayTheme} onClick={handleGridClick} />
          )}
        </Box>
      </Box>

      <Box // bottom
        className="video-overlay-bottom"
        sx={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.3), rgba(0,0,0,0.0))',
          bottom: 0,
          boxSizing: 'border-box',
          height: '10%',
          left: 0,
          position: 'absolute',
          right: 0,
          zIndex: 1,
        }}
      >
        <Box // bottom right
          sx={{
            bottom: 0,
            boxSizing: 'border-box',
            position: 'absolute',
            right: 0,
          }}
        >
          {!isPopout && (
            <PopoutButton theme={overlayTheme} onClick={handlePopoutClick} />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default VideoOverlay;
