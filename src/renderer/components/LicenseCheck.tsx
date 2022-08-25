/* eslint-disable no-console */
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectAuth } from '../redux/AuthSlice';
import { selectUserLicense, setUserLicense } from '../redux/AppUserSlice';
import { LicenseStatus, UserLicense } from '../models/models';
import LoginFooter from './LoginFooter';
import teraphoneLogo from '../../../assets/images/teraphone-logo-and-name-vertical.svg';

type UpdateLicenseResponse = {
  success: boolean;
  license: UserLicense;
};

const LicenseCheck = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { auth } = useAppSelector(selectAuth);
  const userLicense = useAppSelector(selectUserLicense);
  const isLicenseActive = userLicense.licenseStatus === LicenseStatus.active;
  const isTrialActive = userLicense.trialActivated;
  const isTrialExpired = Date.now() > Date.parse(userLicense.trialExpiresAt);
  const [canStartTrial, setCanStartTrial] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    if (isLicenseActive) {
      console.log('license is active, redirecting to home');
      navigate('/home');
    }
    if (isTrialActive && !isTrialExpired) {
      console.log('trial is active, redirecting to home');
      navigate('/home');
    }
    if (isTrialActive && isTrialExpired) {
      console.log('trial is expired, redirecting to trial-expired');
      navigate('/trial-expired');
    }
    if (!isTrialActive) {
      console.log('trial is not active, start trial?');
      setCanStartTrial(true);
    }
  }, [isLicenseActive, isTrialActive, isTrialExpired, navigate]);

  const handleStartTrial = React.useCallback(async () => {
    const params: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.accessToken}`,
      },
    };
    setPending(true);
    try {
      const response = await window.fetch(
        'https://api-dev.teraphone.app/v1/private/license',
        params
      );
      console.log('response', response);
      if (response.ok) {
        const data: UpdateLicenseResponse = await response.json();
        dispatch(setUserLicense(data.license));
      } else {
        setPending(false);
        setErrorMessage('Request failed: could not start trial.');
      }
    } catch (error) {
      console.log(error);
      setPending(false);
      setErrorMessage('Request failed: could not start trial.');
    }
  }, [auth.accessToken, dispatch]);

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
          height: '100%',
          justifyContent: 'center',
        }}
      >
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
          {canStartTrial ? (
            <>
              <Box
                alt="Teraphone logo"
                component="img"
                src={teraphoneLogo}
                sx={{ height: 112, width: 'auto' }}
              />
              <Typography sx={{ textAlign: 'center' }}>
                Please enjoy a free trial with full access to Teraphone for 30
                days.
              </Typography>
              <LoadingButton
                loading={pending}
                onClick={handleStartTrial}
                type="submit"
                variant="contained"
              >
                Begin free trial
              </LoadingButton>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            </>
          ) : (
            <CircularProgress />
          )}
        </Box>
        <LoginFooter />
      </Box>
    </Container>
  );
};

export default LicenseCheck;
