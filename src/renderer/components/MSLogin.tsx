/* eslint-disable no-console */
import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Box, Container, CssBaseline } from '@mui/material';
import { useAppDispatch } from '../redux/hooks';
import { setMSAuthResult } from '../redux/AuthSlice';
import MSSignInLoadingButton from './MSSignInLoadingButton';
import LoginFooter from './LoginFooter';
import teraphoneLogo from '../../../assets/images/teraphone-logo-and-name-vertical.svg';

function MSLogin() {
  const [authPending, setAuthPending] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const signedOut = searchParams.has('signedOut');

  const handleAuthSilent = React.useCallback(async () => {
    try {
      setAuthPending(true);
      const authResult = await window.electron.ipcRenderer.authSilent();
      if (authResult) {
        dispatch(setMSAuthResult(authResult));
        setAuthPending(false);
        navigate('/loading');
      } else {
        setAuthPending(false);
      }
    } catch (error) {
      setAuthPending(false);
      console.error(error);
    }
  }, [dispatch, navigate]);

  React.useEffect(() => {
    if (!signedOut) {
      handleAuthSilent();
    }
  }, [handleAuthSilent, signedOut]);

  const handleAuthClick = React.useCallback(async () => {
    try {
      setErrorMessage('');
      setAuthPending(true);
      const authResult = await window.electron.ipcRenderer.auth();
      console.log('authResult', authResult);
      if (authResult) {
        dispatch(setMSAuthResult(authResult));
        setAuthPending(false);
        navigate('/loading');
      } else {
        setAuthPending(false);
        setErrorMessage('Authentication failed');
      }
    } catch (error) {
      console.log(error);
      setAuthPending(false);
      setErrorMessage('Authentication failed');
    }

    setAuthPending(false);
  }, [dispatch, navigate]);

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
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Box>
      <LoginFooter />
    </Container>
  );
}

export default MSLogin;
