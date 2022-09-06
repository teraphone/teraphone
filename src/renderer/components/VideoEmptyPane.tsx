import { Box, Button, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fff',
    },
  },
});

function VideoEmptyMessage({
  message,
  darkMode = true,
  buttonText = '',
  buttonAction = () => {},
}: {
  message: string;
  darkMode?: boolean;
  buttonText?: string | undefined;
  buttonAction?: () => void | undefined;
}) {
  return (
    <Box sx={{ textAlign: 'center', m: 2 }}>
      <Typography sx={{ color: 'white', mb: 2 }} variant="body1">
        {message}
      </Typography>
      {buttonText && (
        <Button color="primary" variant="outlined" onClick={buttonAction}>
          {buttonText}
        </Button>
      )}
    </Box>
  );
}

function VideoEmptyPane({
  message,
  darkMode = true,
  buttonText = '',
  buttonAction = () => {},
}: {
  message: string;
  darkMode?: boolean;
  buttonText?: string | undefined;
  buttonAction?: () => void | undefined;
}) {
  return darkMode ? (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: 'black',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        <VideoEmptyMessage
          message={message}
          darkMode={darkMode}
          buttonText={buttonText}
          buttonAction={buttonAction}
        />
      </Box>
    </ThemeProvider>
  ) : (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: 'theme.palette.background.paper',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <VideoEmptyMessage
        message={message}
        darkMode={darkMode}
        buttonText={buttonText}
        buttonAction={buttonAction}
      />
    </Box>
  );
}

export default VideoEmptyPane;
