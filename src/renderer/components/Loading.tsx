import { Box, Container, CssBaseline, Typography } from '@mui/material';

const Loading = () => {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          paddingTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4">Please wait...</Typography>
      </Box>
    </Container>
  );
};

export default Loading;
