/* eslint-disable no-console */
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import type { AuthenticationResult } from '@azure/msal-node';
import { Alert, Box, Container, CssBaseline } from '@mui/material';
// import { signIn } from '../redux/Firebase';
import { useAppDispatch } from '../redux/hooks';
// import { setAppUser } from '../redux/AppUserSlice';
import { setMSAuthResult } from '../redux/AuthSlice';
import MSSignInLoadingButton from './MSSignInLoadingButton';
import teraphoneLogo from '../../../assets/images/teraphone-logo-and-name-vertical.svg';

function MSLogin() {
  const [authPending, setAuthPending] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAuthClick = React.useCallback(async () => {
    // todo: click auth button then close popup. why no error???
    try {
      setAuthPending(true);
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

    setAuthPending(false);
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
        flexDirection: 'column',
        gap: 2,
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
          flexGrow: 1,
          gap: 6,
          justifyContent: 'center',
        }}
      >
        <Box
          alt="Teraphone logo"
          component="img"
          src={teraphoneLogo}
          sx={{ height: 112, width: 'auto' }}
        />
        <MSSignInLoadingButton
          loading={authPending}
          onClick={handleAuthClick}
        />
        <SubmitError />
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexShrink: 0,
          justifyContent: 'center',
          m: 2,
        }}
      >
        <Link
          to="/"
          onClick={() =>
            window.open('https://teraphone.app/privacy-policy', '_blank')
          }
        >
          Privacy Policy
        </Link>
      </Box>
    </Container>
  );
}

export default MSLogin;
