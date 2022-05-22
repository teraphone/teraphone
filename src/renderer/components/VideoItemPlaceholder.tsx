import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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
      <Box
        sx={{
          textAlign: 'center',
          pt: '30%',
        }}
      >
        <Typography
          sx={{
            color: 'white',
          }}
          variant="body1"
        >
          {message}
        </Typography>
        {buttonText && (
          <Button
            sx={{
              mt: '20',
            }}
            variant="outlined"
            onClick={buttonAction}
          >
            {buttonText}
          </Button>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default React.memo(VideoItemPlaceholder);
