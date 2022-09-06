import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
    <Box sx={{ textAlign: 'center' }}>
      <Typography sx={{ color: 'white', mb: 4 }} variant="body1">
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

export default VideoEmptyMessage;
