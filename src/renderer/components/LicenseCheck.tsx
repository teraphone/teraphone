/* eslint-disable no-console */
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Container, CssBaseline, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectAuth } from '../redux/AuthSlice';
import { selectUserLicense, setUserLicense } from '../redux/AppUserSlice';
import { LicenseStatus, UserLicense } from '../models/models';

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
  const [submitError, setSubmitError] = React.useState(false);
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
        setSubmitError(true);
        setErrorMessage('Request failed: could not start trial.');
      }
    } catch (error) {
      console.log(error);
      setPending(false);
      setSubmitError(true);
      setErrorMessage('Request failed: could not start trial.');
    }
  }, [auth.accessToken, dispatch]);

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
        <Typography variant="h4">License Check...</Typography>
        {canStartTrial && (
          <LoadingButton
            fullWidth
            loading={pending}
            sx={{ mt: 3, mb: 2 }}
            type="submit"
            variant="contained"
            onClick={handleStartTrial}
          >
            Begin 30-Day Free Trial
          </LoadingButton>
        )}
        <SubmitError />
      </Box>
    </Container>
  );
};

export default LicenseCheck;
