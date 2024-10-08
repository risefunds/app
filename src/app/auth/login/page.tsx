'use client';

import { Box, Typography, List, ListItem, Link, Grid } from '@mui/material';
import React from 'react';
import { AuthLayout } from 'layouts/AuthLayout';
import NextLink from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'utils/firebaseConfig';
import { useRouter } from 'next/navigation';
import { FormBuilderJSON } from 'components/FormBuilder';

const LoginPage: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <AuthLayout pageTitle="Creative Connect">
        <FormBuilderJSON
          schema={{
            version: 1,
            id: 'loginForm',
            steps: [
              {
                id: 'logindetails',
                fields: ['email', 'password'],
                title: 'Login',
                footerSubmitTitle: 'Login',
              },
            ],
            initialValues: {
              email: '',
              password: '',
            },
            fields: [
              {
                id: 'email',
                type: 'email',
                title: 'Email',
                config: {
                  placeholder: 'me@home.com',
                },
                validationSchema: [
                  ['yup.string'],
                  ['yup.required', 'Email is required'],
                  ['yup.email', 'Not a valid email'],
                ],
              },
              {
                id: 'password',
                type: 'password',
                title: 'Password',
                validationSchema: [
                  ['yup.string'],
                  ['yup.required', 'Password is required'],
                  ['yup.min', 8, 'Password must be at least 8 characters'],
                ],
              },
            ],
          }}
          FormBuilderProps={{
            initialValues: {
              email: '',
              password: '',
            },
            onSubmit: async (values) => {
              try {
                await signInWithEmailAndPassword(
                  auth,
                  values.email,
                  values.password
                );
                router.push('/dashboard'); // Redirect to the dashboard upon successful login
              } catch (error: any) {
                console.log(error.message); // Handle errors
              }
            },
          }}
        />
        <List>
          <ListItem>
            <Grid container justifyContent={'space-between'}>
              <Grid item xs={8} sx={{ display: 'flex' }}>
                <Typography variant="body2">Don't have membership?</Typography>
                <Typography
                  sx={{
                    pl: 0.5,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  variant="body2"
                >
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
                    <NextLink href="/auth/forget" passHref>
                      Forgot Password?
                    </NextLink>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </AuthLayout>
    </>
  );
};

export default LoginPage;
