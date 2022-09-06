import { Box, Button, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export interface VideoItemPlaceholderProps {
  message: string;
  buttonText: string | undefined;
  buttonAction: () => void | undefined;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#fff',
    },
  },
});

function VideoItemPlaceholder(props: VideoItemPlaceholderProps) {
  const { message, buttonText, buttonAction } = props;
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ color: 'white', mb: 2 }} variant="body1">
          {message}
        </Typography>
        {buttonText && (
          <Button variant="outlined" onClick={buttonAction}>
            {buttonText}
          </Button>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default VideoItemPlaceholder;
