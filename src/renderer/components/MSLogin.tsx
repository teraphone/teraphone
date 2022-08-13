/* eslint-disable no-console */
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import CssBaseline from '@mui/material/CssBaseline';
// import type { AuthenticationResult } from '@azure/msal-node';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import { signIn } from '../redux/Firebase';
import { useAppDispatch } from '../redux/hooks';
// import { setAppUser } from '../redux/AppUserSlice';
import { setMSAuthResult } from '../redux/AuthSlice';

function MSLogin() {
  const [authPending, setAuthPending] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAuthClick = React.useCallback(async () => {
    // todo: click auth button then close popup. why no error???
    try {
      // setAuthPending(true);
      const authResult = await window.electron.ipcRenderer.auth();
      console.log('authResult', authResult);
      if (authResult) {
        dispatch(setMSAuthResult(authResult));
        setAuthPending(false);
        setSubmitError(false);
        navigate('/loading');
      } else {
        setAuthPending(false);
        setSubmitError(true);
        setErrorMessage('Authentication failed');
      }
    } catch (error) {
      console.log(error);
      setAuthPending(false);
      setSubmitError(true);
      setErrorMessage('Authentication failed');
    }

    // setAuthPending(false);
  }, [dispatch, navigate]);

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
    <Container
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          mb: 8,
          maxWidth: 'xs',
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
            </Grid>
            <Grid item>
              <Link
                to="/"
                onClick={() =>
                  window.open('https://teraphone.app/privacy-policy', '_blank')
                }
              >
                Privacy Policy
              </Link>
            </Grid>
          </Grid>
        </Box>
        <SubmitError />
      </Box>
    </Container>
  );
}

export default MSLogin;
