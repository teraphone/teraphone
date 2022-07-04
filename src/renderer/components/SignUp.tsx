/* eslint-disable no-console */
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import validator from 'validator';
import axiosPackage, { AxiosError } from 'axios';
import axios from '../api/axios';
import { signIn } from '../redux/Firebase';
import { useAppDispatch } from '../redux/hooks';
import { setAppUser } from '../redux/AppUserSlice';
import { setAuth } from '../redux/AuthSlice';

const { isAxiosError } = axiosPackage;

type SignUpWithInviteRequest = {
  name: string;
  email: string;
  password: string;
  invite_code: string;
};

function SignUp() {
  const [nameError, setNameError] = React.useState(false);
  const [nameHelperText, setNameHelperText] = React.useState('');
  const [nameValid, setNameValid] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [emailHelperText, setEmailHelperText] = React.useState('');
  const [emailValid, setEmailValid] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordHelperText, setPasswordHelperText] = React.useState('');
  const [passwordValid, setPasswordValid] = React.useState(false);
  const [inviteCodeError, setInviteCodeError] = React.useState(false);
  const [inviteCodeHelperText, setInviteCodeHelperText] = React.useState('');
  const [inviteCodeValid, setInviteCodeValid] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.length < 3) {
      setNameError(true);
      setNameHelperText('Must be 3 or more characters');
      setNameValid(false);
    } else {
      setNameError(false);
      setNameHelperText('');
      setNameValid(true);
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (!validator.isEmail(value)) {
      setEmailError(true);
      setEmailHelperText('Invalid email address');
      setEmailValid(false);
    } else {
      setEmailError(false);
      setEmailHelperText('');
      setEmailValid(true);
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.length < 8) {
      setPasswordError(true);
      setPasswordHelperText('Must be 8 or more characters');
      setPasswordValid(false);
    } else {
      setPasswordError(false);
      setPasswordHelperText('');
      setPasswordValid(true);
    }
  };

  const handleInviteCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    if (value.length < 16) {
      setInviteCodeError(true);
      setInviteCodeHelperText('Must be 16 digits');
      setInviteCodeValid(false);
    } else {
      setInviteCodeError(false);
      setInviteCodeHelperText('');
      setInviteCodeValid(true);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      invite_code: data.get('invite_code'),
    });
    const request: SignUpWithInviteRequest = {
      name: data.get('name') as string,
      email: data.get('email') as string,
      password: data.get('password') as string,
      invite_code: data.get('invite_code') as string,
    };
    try {
      setSubmitError(false);
      const response = await axios.post(
        '/v1/public/signup-with-invite',
        request
      );
      const {
        token,
        expiration,
        firebase_auth_token: fbToken,
        user,
      } = response.data;
      dispatch(setAuth({ token, expiration }));
      dispatch(setAppUser(user));
      const userCredential = await signIn(fbToken);
      console.log('userCredential', userCredential);
      navigate('/home');
    } catch (e) {
      const defaultMessage = 'An error occured attempting to sign up';
      let message;
      if (isAxiosError(e)) {
        const error = e as AxiosError;
        message = error.response?.data ?? error.message ?? defaultMessage;
      } else {
        const error = e as Error;
        message = error.message ?? defaultMessage;
      }
      console.warn(message);
      setErrorMessage(message);
      setSubmitError(true);
    }
  };

  const SubmitError = () => {
    if (submitError) {
      return (
        <Box mt={5}>
          <Typography variant="body1" color="error" align="center">
            {errorMessage}
          </Typography>
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
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={nameError}
                helperText={nameHelperText}
                onChange={handleNameChange}
                autoFocus
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={emailError}
                helperText={emailHelperText}
                onChange={handleEmailChange}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={passwordError}
                helperText={passwordHelperText}
                onChange={handlePasswordChange}
                required
                fullWidth
                type="password"
                id="password"
                label="Password"
                name="password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={inviteCodeError}
                helperText={inviteCodeHelperText}
                onChange={handleInviteCodeChange}
                required
                fullWidth
                id="invite_code"
                label="Invite Code"
                name="invite_code"
              />
            </Grid>
          </Grid>
          <Button
            disabled={
              !(nameValid && emailValid && passwordValid && inviteCodeValid)
            }
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/signin">Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </Box>
        <SubmitError />
      </Box>
    </Container>
  );
}

export default SignUp;
