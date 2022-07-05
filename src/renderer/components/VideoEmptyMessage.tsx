import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export interface VideoEmptyMessageProps {
  message: string;
  buttonText: string | undefined;
  buttonAction: () => void | undefined;
}

function VideoEmptyMessage(props: VideoEmptyMessageProps) {
  const { message, buttonText, buttonAction } = props;

  return (
    <Box
      sx={{
        textAlign: 'center',
        pt: '30%',
      }}
    >
      <Typography
        sx={{
          color: 'primary',
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
          color="primary"
          variant="outlined"
          onClick={buttonAction}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
}

export default VideoEmptyMessage;
