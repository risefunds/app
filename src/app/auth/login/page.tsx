'use client';

import { useState } from 'react';
import { Box, Typography, List, ListItem, Grid, TextField, Button, Container } from '@mui/material';
import React from 'react';
import { AuthLayout } from 'layouts/AuthLayout';
import NextLink from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'utils/firebaseConfig';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const router = useRouter();

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validate = () => {
    let formErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      formErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = 'Not a valid email';
      isValid = false;
    }

    if (!password) {
      formErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 8) {
      formErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error.message); 
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <AuthLayout pageTitle="Creative Connect">
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, backgroundColor: '#4CAF50' }}
          >
            Login
          </Button>
        </Box>

        <List>
          <ListItem>
            <Grid container justifyContent={'space-between'}>
              <Grid item xs={8} sx={{ display: 'flex' }}>
                <Typography variant="body2">Don't have membership?</Typography>
                <Typography
                  sx={{ pl: 0.5, textDecoration: 'underline', cursor: 'pointer' }}
                  variant="body2">
                    
                  <NextLink href="/auth/signup" passHref>
                    Sign up
                  </NextLink>
                </Typography>
              </Grid>
              <Grid item>
                <Box>
                  <Typography
                    sx={{ pl: 0.5, textDecoration: 'underline' }}
                    variant="body2"
                  >
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </Container>
    </AuthLayout>
  );
};

export default LoginPage;
