'use client';

import { useContext, useEffect } from 'react';
import { AppContext } from 'context/AppContext';
import { Typography, List, ListItem, Box } from '@mui/material';
import NextLink from 'next/link';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from 'utils/firebaseConfig';
import Button from '@mui/material/Button';
import { AuthLayout } from 'layouts/AuthLayout';
import { FormBuilderJSON } from 'components/FormBuilder';
import { useRouter } from 'next/navigation';
import GoogleProvider from 'components/Auth/GoogleProvider';

const SignupPage: React.FC = () => {
  const appContext = useContext(AppContext);
  const router = useRouter();

  // Redirect to the homepage if the user is already logged in
  useEffect(() => {
    if (appContext.helper.firebaseUser) {
      router.push('/');
    }
  }, [appContext.helper.firebaseUser, router]);

  return (
    <AuthLayout pageTitle="Register">
      <FormBuilderJSON
        FormBuilderProps={{
          initialValues: {
            displayName: '',
            email: '',
            password: '',
          },
          onSubmit: async (values) => {
            try {
              const signupResponse =
                await appContext.sdkServices?.base.backendService.request<{
                  customToken: string;
                }>(
                  '/pub/addon/entity/PlatformUser/getPlatformUser',
                  { user: values, type: ['creative'] },
                  false,
                );
              if (!signupResponse)
                throw new Error('Signup failed. Please try again.');
              await appContext.helper.signInWithCustomToken(
                signupResponse.customToken,
              );
              appContext.helper.showSuccess('Sign up Success');
              router.push('/');
            } catch (error: any) {
              console.log(error.message);
              appContext.helper.showError(error);
            }
          },
        }}
        schema={{
          version: 1,
          id: 'signup',
          steps: [
            {
              id: 'signupdetails',
              fields: ['displayName', 'email', 'password'],
              title: 'Signup',
              footerSubmitTitle: 'Register',
            },
          ],
          initialValues: {
            displayName: '',
            email: '',
            password: '',
          },
          fields: [
            {
              id: 'displayName',
              type: 'text',
              title: 'Full name',
              config: {
                placeholder: 'John Doe',
              },
              validationSchema: [
                ['yup.string'],
                ['yup.required', 'Full name is required'],
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

      <Box sx={{ padding: 3 }}>
        {/* View campaign button */}
        <GoogleProvider />
        {/* Member login section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2">Already a member,</Typography>
          <Typography
            sx={{ pl: 0.5, textDecoration: 'underline' }}
            variant="body2"
          >
            <NextLink href="/auth/login" passHref>
              Login
            </NextLink>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default SignupPage;
