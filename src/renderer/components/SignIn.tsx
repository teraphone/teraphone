import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import validator from 'validator';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';

const theme = createTheme();

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
  const auth = useAuth();

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
        // eslint-disable-next-line no-console
        console.log(response);
        const { token, expiration } = response.data;
        auth.setState({ token, expiration });
        // eslint-disable-next-line no-console
        console.log(`bbtoken`);
        // eslint-disable-next-line no-console
        console.log(auth);
        setSubmitError(false);
        navigate('/home');
        return true;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
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
    <ThemeProvider theme={theme}>
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
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
                <Link to="/">Forgot password?</Link>
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
    </ThemeProvider>
  );
}

export default SignIn;
