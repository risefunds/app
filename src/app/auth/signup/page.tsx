'use client';

import { useState, useContext, useEffect } from 'react';
import { AppContext } from 'context/AppContext';
import { Box, Typography, List, ListItem, TextField, Button, Container } from '@mui/material';
import { AuthLayout } from 'layouts/AuthLayout';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

const SignupPage: React.FC = () => {
  const appContext = useContext(AppContext);
  const router = useRouter();

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  useEffect(() => {
    if (appContext.helper.firebaseUser) {
      router.push('/');
    }
  }, [appContext.helper.firebaseUser, router]);

  const validate = () => {
    let formErrors = { firstName: '', lastName: '', email: '', password: '' };
    let isValid = true;

    if (!formValues.firstName) {
      formErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formValues.lastName) {
      formErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!formValues.email) {
      formErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      formErrors.email = 'Not a valid email';
      isValid = false;
    }

    if (!formValues.password) {
      formErrors.password = 'Password is required';
      isValid = false;
    } else if (formValues.password.length < 8) {
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
      const signupResponse = await appContext.sdkServices?.base.backendService.request<{
        customToken: string;
      }>('/pub/addon/entity/PlatformUser/getPlatformUser', { user: formValues, type: ['creative'] }, false);

      if (!signupResponse) throw new Error('Signup failed. Please try again.');

      await appContext.helper.signInWithCustomToken(signupResponse.customToken);
      router.push('/dashboard'); 
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <AuthLayout pageTitle="Register">
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            value={formValues.firstName}
            onChange={(e) => setFormValues({ ...formValues, firstName: e.target.value })}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            value={formValues.lastName}
            onChange={(e) => setFormValues({ ...formValues, lastName: e.target.value })}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            value={formValues.email}
            onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
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
            value={formValues.password}
            onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
            error={!!errors.password}
            helperText={errors.password}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: '#4CAF50', color: 'white' }}
          >
            Register
          </Button>
        </Box>

        <List>
          <ListItem>
            <Typography variant="body2">Already a member?</Typography>
            <Typography sx={{ pl: 0.5, textDecoration: 'underline' }} variant="body2">
              <NextLink href="/auth/login" passHref>
                Login
              </NextLink>
            </Typography>
          </ListItem>
        </List>
      </Container>
    </AuthLayout>
  );
};

export default SignupPage;
