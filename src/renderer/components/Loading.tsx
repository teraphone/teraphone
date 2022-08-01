/* eslint-disable no-console */
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, CssBaseline, Typography } from '@mui/material';
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
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleLogin = React.useCallback(async () => {
    let success = false;
    const params: RequestInit = {
      body: JSON.stringify({ msAuthToken: msAuthResult.accessToken }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${msAuthResult.accessToken}`,
        medhot: 'GET',
      },
    };
    try {
      const response = await window.fetch(
        'https://api-dev.teraphone.app/v1/public/login',
        params
      );
      if (response.ok) {
        try {
          const data: LoginResponse = await response.json();
          dispatch(setAccessToken(data.accessToken));
          dispatch(setAccessTokenExpiration(data.accessTokenExpiration));
          dispatch(setRefreshToken(data.refreshToken));
          dispatch(setRefreshTokenExpiration(data.refreshTokenExpiration));
          await signIn(data.firebaseAuthToken);
          dispatch(setTenantUser(data.user));
          dispatch(setUserLicense(data.license));
          success = true;
        } catch (e) {
          console.error(e);
        }
      }
    } catch (error) {
      console.log(error);
    }

    return success;
  }, [dispatch, msAuthResult.accessToken]);

  React.useEffect(() => {
    handleLogin()
      .then((success) => {
        if (success) {
          // if no license, trial expired: navigate to request license expired page
          // if no license, trial active: navigate to home view
          // if no license, trial inactive: navigate to trial start page
          // if license, navigate to home view
        }
        return true;
      })
      .catch(console.error);
  }, [handleLogin]);

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
