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
  buttonText = '',
  buttonAction = () => {},
}: {
  message: string;
  buttonText?: string | undefined;
  buttonAction?: () => void | undefined;
}) {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ color: 'white', mb: 2 }} variant="body1">
          {message}
        </Typography>
        {buttonText && (
          <Button color="primary" variant="outlined" onClick={buttonAction}>
            {buttonText}
          </Button>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default VideoEmptyMessage;
