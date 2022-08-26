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
import {
  selectSubscription,
  selectTenantUser,
  setTenantUser,
} from '../redux/AppUserSlice';
import { SubscriptionStatus, TenantUser } from '../models/models';
import LoginFooter from './LoginFooter';
import teraphoneLogo from '../../../assets/images/teraphone-logo-and-name-vertical.svg';

type UpdateTrialResponse = {
  success: boolean;
  user: TenantUser;
};

const LicenseCheck = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { auth } = useAppSelector(selectAuth);
  const tenantUser = useAppSelector(selectTenantUser);
  const subscription = useAppSelector(selectSubscription);
  const isSubscriptionActive =
    subscription.saasSubscriptionStatus === SubscriptionStatus.Subscribed;
  const isTrialActive = tenantUser.trialActivated;
  const isTrialExpired = Date.now() > Date.parse(tenantUser.trialExpiresAt);
  const [canStartTrial, setCanStartTrial] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    if (isSubscriptionActive) {
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
  }, [isSubscriptionActive, isTrialActive, isTrialExpired, navigate]);

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
        'https://api.teraphone.app/v1/private/trial',
        params
      );
      console.log('response', response);
      if (response.ok) {
        const data: UpdateTrialResponse = await response.json();
        dispatch(setTenantUser(data.user));
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
