import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../features/user/userSlice';
import { useUser } from '../../Hooks/useUser';
import EnterOtp from '../Popup/EnterOtp'; 

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://kmvishnu.github.io/angular-app">
        Webworms
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showEnterOtp, setShowEnterOtp] = useState(false); 

  const { loading, sendOtp, verifyOtp } = useUser(); 
  const dispatch = useDispatch();

  useEffect(() => {
    setIsEmailValid(validateEmail(email));
    setIsNameValid(validateName(name));
    setIsPasswordValid(validatePassword(password));
  }, [email, password, name]);

  useEffect(() => {
    setIsFormValid(isEmailValid && isPasswordValid && isNameValid);
  }, [isEmailValid, isPasswordValid, isNameValid]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name) && name.length > 0;
  };

  const validatePassword = (password) => {
    return password.length > 3 && password.length < 20;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {
      email: data.get('email'),
      password: data.get('password'),
      name: data.get('name'),
    };
    dispatch(registerUser(userData));
    try {
      const response = await sendOtp(email);
      if (response.status === 'success') {
        setShowEnterOtp(true); 
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleVerifyOtp = async (email, otp) => {
    try {
      const response = await verifyOtp(email, otp);
      return response;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={!isNameValid && name.length > 0}
                  helperText={!isNameValid && name.length > 0 ? 'Invalid name format' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!isEmailValid && email.length > 0}
                  helperText={!isEmailValid && email.length > 0 ? 'Invalid email format' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!isPasswordValid && password.length > 0}
                  helperText={!isPasswordValid && password.length > 0 ? 'Password must be between 4 to 20 characters' : ''}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!isFormValid || loading} // Disable the button during loading
            >
              {loading ? 'Loading...' : 'Sign Up'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
        {showEnterOtp && (
          <EnterOtp
            email={email}
            onClose={() => setShowEnterOtp(false)}
            onVerifyOtp={handleVerifyOtp}
          />
        )} 
      </Container>
    </ThemeProvider>
  );
}
