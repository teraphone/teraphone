/* eslint-disable no-console */
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Container, CssBaseline, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAppSelector } from '../redux/hooks';
import { selectUserLicense } from '../redux/AppUserSlice';
import { LicenseStatus } from '../models/models';

const LicenseCheck = () => {
  const navigate = useNavigate();
  const userLicense = useAppSelector(selectUserLicense);
  const isLicenseActive = userLicense.licenseStatus === LicenseStatus.active;
  const isTrialActive = userLicense.trialActivated;
  const isTrialExpired = Date.parse(userLicense.trialExpiresAt) > Date.now();
  const [canStartTrial, setCanStartTrial] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    if (isLicenseActive) {
      navigate('/home');
    }
    if (isTrialActive && !isTrialExpired) {
      navigate('/home');
    }
    if (isTrialActive && isTrialExpired) {
      navigate('/trial-expired'); // todo: create this page
    }
    if (!isTrialActive) {
      setCanStartTrial(true);
    }
  }, [isLicenseActive, isTrialActive, isTrialExpired, navigate]);

  const handleStartTrial = React.useCallback(async () => {
    setPending(true);
    try {
      // todo: finish this...
      // send request to start trial
      // update license from response
      // navigate to home
    } catch (error) {
      console.log(error);
      setPending(false);
      setSubmitError(true);
      setErrorMessage('Request failed: could not start trial.');
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
            Authenticate with Microsoft
          </LoadingButton>
        )}
        <SubmitError />
      </Box>
    </Container>
  );
};

export default LicenseCheck;
