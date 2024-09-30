'use client';

import { Typography, List, ListItem } from '@mui/material';
import React from 'react';
import NextLink from 'next/link';
import { auth } from 'utils/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { AuthLayout } from 'layouts/AuthLayout';
import { FormBuilderJSON } from 'components/FormBuilder';
import { useRouter } from 'next/navigation';

const SignupPage: React.FC = () => {
  const router = useRouter();

  return (
    <AuthLayout pageTitle="Register">
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
              // Ensure this code is only executed in a client context
              await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
              );
              router.push('/dashboard');
            } catch (error: any) {
              console.log(error.message); // Handle errors
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

      <List>
        <ListItem>
          <Typography variant="body2">Already a member,</Typography>
          <Typography
            sx={{ pl: 0.5, textDecoration: 'underline' }}
            variant="body2"
          >
            <NextLink href="/auth/login" passHref>
              Login
            </NextLink>
          </Typography>
        </ListItem>
      </List>
    </AuthLayout>
  );
};

export default SignupPage;
