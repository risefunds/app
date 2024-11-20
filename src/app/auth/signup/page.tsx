'use client';

import { useState, useContext, useEffect } from 'react';
import { AppContext } from 'context/AppContext';
import { Box, Typography, List, ListItem, TextField, Button, Container } from '@mui/material';
import { AuthLayout } from 'layouts/AuthLayout';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { FormBuilderJSON } from 'components/FormBuilder';





const SignupPage: React.FC = () => {
  const appContext = useContext(AppContext);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null); // State for error messages

  useEffect(() => {
    if (appContext.helper.firebaseUser) {
      router.push('/');
    }
  }, [appContext.helper.firebaseUser, router]);

  return (
    <AuthLayout pageTitle="Register">
      {error && <Typography color="error">{error}</Typography>} {/* Display error message */}
      <FormBuilderJSON
        FormBuilderProps={{
          initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
          },
          onSubmit: async (values) => {
            try {
              const signupResponse = await appContext.sdkServices?.base.backendService.request<{
                customToken: string;
              }>('/pub/addon/entity/PlatformUser/getPlatformUser', { user: values, type: ['creative'] }, false);

              if (!signupResponse) {
                throw new Error('Signup failed. Please try again.');
              }

              await appContext.helper.signInWithCustomToken(signupResponse.customToken);
              router.push('/dashboard');
            } catch (error: any) {
              setError(error.message); // Set error message
              console.log(error.message);
            }
          },
        }}
        schema={{
          version: 1,
          id: 'signup',
          steps: [
            {
              id: 'signupdetails',
              fields: ['firstName', 'lastName', 'email', 'password'],
              title: 'Signup',
              footerSubmitTitle: 'Register',
            },
          ],
          initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
          },
          fields: [
            {
              id: 'firstName',
              type: 'text',
              title: 'First name',
              config: {
                placeholder: 'John',
              },
              validationSchema: [
                ['yup.string'],
                ['yup.required', 'First name is required'],
              ],
            },
            {
              id: 'lastName',
              type: 'text',
              title: 'Last name',
              config: {
                placeholder: 'Doe',
              },
              validationSchema: [
                ['yup.string'],
                ['yup.required', 'Last name is required'],
              ],
            },
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
      />
    </AuthLayout>
  );
};

export default SignupPage;
