/* eslint-disable no-console */
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIos } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Container,
  CssBaseline,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  selectMSAuthResult,
  setAccessToken,
  setAccessTokenExpiration,
  setRefreshToken,
  setRefreshTokenExpiration,
} from '../redux/AuthSlice';
import { signIn } from '../redux/Firebase';
import { setTenantUser, setUserLicense } from '../redux/AppUserSlice';
import { TenantUser, UserLicense } from '../models/models';

type LoginResponse = {
  success: boolean;
  accessToken: string;
  accessTokenExpiration: number;
  refreshToken: string;
  refreshTokenExpiration: number;
  firebaseAuthToken: string;
  user: TenantUser;
  license: UserLicense;
};

const Loading = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const msAuthResult = useAppSelector(selectMSAuthResult);
  const [loginError, setLoginError] = React.useState('');

  const handleLogin = React.useCallback(async () => {
    let success = false;
    const params: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ msAccessToken: msAuthResult.accessToken }),
    };
    try {
      console.log('login with params', params);
      const response = await window.fetch(
        'https://api-dev.teraphone.app/v1/public/login',
        params
      );
      if (response.ok) {
        const data: LoginResponse = await response.json();
        dispatch(setAccessToken(data.accessToken));
        dispatch(setAccessTokenExpiration(data.accessTokenExpiration));
        dispatch(setRefreshToken(data.refreshToken));
        dispatch(setRefreshTokenExpiration(data.refreshTokenExpiration));
        await signIn(data.firebaseAuthToken);
        dispatch(setTenantUser(data.user));
        dispatch(setUserLicense(data.license));
        // todo: make sure we're not forgetting anything here. see SignIn.tsx
        success = true;
        console.log('login successful');
      } else {
        setLoginError('Login Failed: could not find your Teams account.');
      }
    } catch (error) {
      console.log(error);
    }

    return success;
  }, [dispatch, msAuthResult.accessToken]);

  const LoginError = () => {
    if (loginError) {
      return (
        <Box component={Alert} severity="error" sx={{ width: '100%' }}>
          {loginError}
        </Box>
      );
    }
    return null;
  };

  React.useEffect(() => {
    handleLogin()
      .then((success) => {
        if (success) {
          navigate('/license-check');
        }
        return true;
      })
      .catch(console.error);
  }, [handleLogin, navigate]);

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
        {loginError ? (
          <>
            <LoginError />
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ m: 4 }}
            >
              <ArrowBackIos />
              Back
            </Button>
          </>
        ) : (
          <Typography variant="h4">Please wait...</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Loading;
