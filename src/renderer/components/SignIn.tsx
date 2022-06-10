/* eslint-disable no-console */
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import validator from 'validator';
import axios from '../api/axios';
import { signIn } from '../redux/Firebase';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setAppUser } from '../redux/AppUserSlice';
import { setAuth, selectAuth } from '../redux/AuthSlice';

type SignInRequest = {
  email: string;
  password: string;
};

function SignIn() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailHelperText, setEmailHelperText] = React.useState('');
  const [emailValid, setEmailValid] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordHelperText, setPasswordHelperText] = React.useState('');
  const [passwordValid, setPasswordValid] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

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
    if (value.length < 1) {
      setPasswordError(true);
      setPasswordHelperText('Password is required');
      setPasswordValid(false);
    } else {
      setPasswordError(false);
      setPasswordHelperText('');
      setPasswordValid(true);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      email: data.get('email'),
      password: data.get('password'),
      remember: data.get('remember'),
    });
    const request: SignInRequest = {
      email: data.get('email') as string,
      password: data.get('password') as string,
    };
    axios
      .post('/v1/public/login', request)
      .then((response) => {
        console.log(response);
        const {
          token,
          expiration,
          firebase_auth_token: fbToken,
          user,
        } = response.data;
        dispatch(setAuth({ token, expiration }));
        console.log('auth', auth);
        dispatch(setAppUser(user));
        return fbToken;
      })
      .then((fbToken) => {
        const userCredential = signIn(fbToken);
        return userCredential;
      })
      .then((userCredential) => {
        console.log('userCredential', userCredential);
        setSubmitError(false);
        navigate('/home');
        return true;
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.response.data);
        setSubmitError(true);
        return false;
      });
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            autoComplete="email"
            autoFocus
            error={emailError}
            helperText={emailHelperText}
            onChange={handleEmailChange}
            id="email"
            label="Email Address"
            name="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            autoComplete="current-password"
            error={passwordError}
            helperText={passwordHelperText}
            onChange={handlePasswordChange}
            type="password"
            id="password"
            label="Password"
            name="password"
          />
          {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              id="remember"
              label="Remember me"
              name="remember"
            /> */}
          <Button
            disabled={!(emailValid && passwordValid)}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                to="/"
                onClick={() =>
                  window.open('https://teraphone.app/forgot-password', '_blank')
                }
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <Link to="/signup">Don't have an account? Sign Up</Link>
            </Grid>
          </Grid>
        </Box>
        <SubmitError />
      </Box>
    </Container>
  );
}

export default SignIn;
