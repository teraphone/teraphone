/* eslint-disable no-console */
import * as React from 'react';
import { Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import CssBaseline from '@mui/material/CssBaseline';
import type { AuthenticationResult } from '@azure/msal-node';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import { signIn } from '../redux/Firebase';
// import { useAppDispatch, useAppSelector } from '../redux/hooks';
// import { setAppUser } from '../redux/AppUserSlice';
// import { setAuth, selectAuth } from '../redux/AuthSlice';

function MSLogin() {
  const [authPending, setAuthPending] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  // const [msAuth, setMSAuth] = React.useState<AuthenticationResult | null>(null);
  // const dispatch = useAppDispatch();

  const handleAuthClick = React.useCallback(async () => {
    setAuthPending(true);
    const authResult = await window.electron.ipcRenderer.auth();
    try {
      if (authResult) {
        // setMSAuth(authResult);
        setAuthPending(false);
        setSubmitError(false);
        console.log('authResult', authResult);
      }
    } catch (error) {
      setAuthPending(false);
      setSubmitError(true);
      setErrorMessage('Authentication failed');
    }
  }, []);

  const SubmitError = () => {
    if (submitError) {
      return (
        <Box component={Alert} severity="error" sx={{ width: '100%' }} mt={4}>
          {errorMessage}
        </Box>
      );
    }
    return null;
  };

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
        <Avatar sx={{ m: 1, bgcolor: 'common.black' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box sx={{ mt: 1 }}>
          <LoadingButton
            fullWidth
            loading={authPending}
            sx={{ mt: 3, mb: 2 }}
            type="submit"
            variant="contained"
            onClick={handleAuthClick}
          >
            Authenticate with Microsoft
          </LoadingButton>
          <Grid container>
            <Grid item xs>
              <Link
                to="/"
                onClick={() =>
                  window.open(
                    'https://teraphone.app/terms-of-service',
                    '_blank'
                  )
                }
              >
                Terms of Service
              </Link>
              <Link
                to="/"
                onClick={() =>
                  window.open('https://teraphone.app/privacy-policy', '_blank')
                }
              >
                Privacy Policy
              </Link>
            </Grid>
            <Grid item>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <Link to="/signup">Don't have an account? Sign Up</Link>
            </Grid>
          </Grid>
        </Box>
        <SubmitError />
      </Box>
    </Container>
  );
}

export default MSLogin;
