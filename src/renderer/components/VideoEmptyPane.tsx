import { Box, Button, Typography } from '@mui/material';

function VideoEmptyMessage({
  message,
  dark = true,
  buttonText = '',
  buttonAction = () => {},
}: {
  message: string;
  dark?: boolean;
  buttonText?: string | undefined;
  buttonAction?: () => void | undefined;
}) {
  return (
    <Box sx={{ textAlign: 'center', m: 2 }}>
      <Typography
        sx={{ color: dark ? 'white' : 'black', mb: 2 }}
        variant="body1"
      >
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
  dark = true,
  buttonText = '',
  buttonAction = () => {},
}: {
  message: string;
  dark?: boolean;
  buttonText?: string | undefined;
  buttonAction?: () => void | undefined;
}) {
  return dark ? (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: 'black',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <VideoEmptyMessage
        message={message}
        dark={dark}
        buttonText={buttonText}
        buttonAction={buttonAction}
      />
    </Box>
  ) : (
    <Box
      sx={{
        alignItems: 'center',
        boxShadow: 'inset 0 0 16px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <VideoEmptyMessage
        message={message}
        dark={dark}
        buttonText={buttonText}
        buttonAction={buttonAction}
      />
    </Box>
  );
}

export default VideoEmptyPane;
