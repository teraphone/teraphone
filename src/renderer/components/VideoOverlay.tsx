import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Track } from 'livekit-client';
import OpenInFullIcon from '@mui/icons-material/OpenInFull'; // focus
import GridViewIcon from '@mui/icons-material/GridView'; // grid
import OpenInNewIcon from '@mui/icons-material/OpenInNew'; // popout
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface VideoOverlayProps {
  sid: string;
  isFocusItem: boolean;
  userName: string;
  isPopout: boolean;
  isLocal: boolean;
  sourceType: Track.Source;
  hidden: boolean;
  setFocus: (sid: string) => void;
  setIsFocusView: (isFocusView: boolean) => void;
  setIsPopout: (sid: string, isPopout: boolean) => void;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#fff',
    },
  },
});

function VideoOverlay(props: VideoOverlayProps) {
  const {
    sid,
    isFocusItem,
    userName,
    isPopout,
    isLocal,
    sourceType,
    hidden,
    setFocus,
    setIsFocusView,
    setIsPopout,
  } = props;
  const isScreen = sourceType === Track.Source.ScreenShare;
  const descriptionLocal = `Your ${isScreen ? 'Screen' : 'Camera'}`;
  const descriptionRemote = `${userName}'s ${isScreen ? 'Screen' : 'Camera'}`;
  const description = isLocal ? descriptionLocal : descriptionRemote;

  const handleFocusClick = React.useCallback(() => {
    setFocus(sid);
    setIsFocusView(true);
  }, [setFocus, setIsFocusView, sid]);

  const handleGridClick = React.useCallback(() => {
    setIsFocusView(false);
    setFocus('');
  }, [setFocus, setIsFocusView]);

  const handlePopoutClick = React.useCallback(() => {
    setIsPopout(sid, true);
  }, [setIsPopout, sid]);

  const FocusButton = () => {
    return (
      <ThemeProvider theme={theme}>
        <Tooltip title="Focus View (click)" placement="left">
          <IconButton
            color="primary"
            aria-label="focus"
            component="span"
            onClick={handleFocusClick}
          >
            <OpenInFullIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </ThemeProvider>
    );
  };

  const GridButton = () => {
    return (
      <ThemeProvider theme={theme}>
        <Tooltip title="Grid View (esc)" placement="left">
          <IconButton
            color="primary"
            aria-label="focus"
            component="span"
            onClick={handleGridClick}
          >
            <GridViewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </ThemeProvider>
    );
  };

  const PopoutButton = () => {
    return (
      <ThemeProvider theme={theme}>
        <Tooltip title="Pop Out" placement="left">
          <IconButton
            color="primary"
            aria-label="focus"
            component="span"
            onClick={handlePopoutClick}
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </ThemeProvider>
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
        <Box // bottom right
          sx={{
            boxSizing: 'border-box',
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}
        >
          {!isPopout && <PopoutButton />}
        </Box>
      </Box>
    </>
  );
}

export default VideoOverlay;
