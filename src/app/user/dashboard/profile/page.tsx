'use client';

import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { AppContext } from 'context/AppContext';
import { useAuth } from 'hooks/useAuth';
import { NavigationLayout } from 'layouts/NavigationLayout';
import { formSchemas, models } from '@risefunds/sdk';
import { ProfileLayout } from 'layouts/ProfileLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { FormBuilderJSON } from 'components/FormBuilder';
import Typography from '@mui/material/Typography';
import DashboardLayout from 'layouts/DashboardLayout';
import CircularProgress from '@mui/material/CircularProgress';

const UserProfile = () => {
  const { user } = useAuth();
  const appContext = useContext(AppContext);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [creativeUser, setCreativeUser] = useState<
    models.CreativeUserEntityModel | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);

  // Isolate creativeUser fetching logic with `isFetchingCreativeUser` guard
  useEffect(() => {
    const getCreativeUser = async () => {
      try {
        setLoading(true);
        if (!appContext.helper.platformUser)
          throw new Error('Platform user not resolved.');

        // Fetch existing creativeUser linked to platformUser
        const creativeUsers =
          await appContext.sdkServices?.core.CreativeUserEntityService.where({
            params: [
              {
                key: 'parentReference.PlatformUser',
                value: appContext.helper.platformUser.id,
                operator: '==',
              },
            ],
          });

        let creativeUser = creativeUsers?.[0];
        console.log({ details: creativeUser?.details });

        if (!creativeUser) {
          // Create a new creativeUser only if it doesn't already exist
          creativeUser =
            await appContext.sdkServices?.core.CreativeUserEntityService.persist(
              new models.CreativeUserEntityModel({
                [appContext.helper.platformUser.collection]:
                  appContext.helper.platformUser.id,
              }),
            );
        }

        setCreativeUser(creativeUser);
      } catch (error) {
        console.log(error);
        appContext.helper.showError(error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch/create creativeUser if platformUser exists and creativeUser hasn't been fetched/created yet
    if (appContext.helper.platformUser) {
      getCreativeUser();
    }
    setLoading(false);
  }, [appContext.helper.platformUser]);

  const getProfileValues = () => (creativeUser && creativeUser.details) || {};

  if (!user) {
    return <p>Loading...</p>;
  }

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <NavigationLayout>
      <DashboardLayout selected="profile" />

      <ProfileLayout>
        <Typography
          component="h2"
          sx={{
            mr: 2,
            fontSize: '2rem',
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: '.08rem',
            color: 'secondary.contrastText',
            textDecoration: 'none',
          }}
        >
          Welcome {user.email}
        </Typography>
        {creativeUser ? (
          <FormBuilderJSON
            FormBuilderProps={{
              initialValues: {
                ...getProfileValues(),
                firstName:
                  creativeUser?.details?.firstName ||
                  appContext.helper.firebaseUser?.displayName?.split(' ')[0] ||
                  '',
                lastName:
                  creativeUser?.details?.lastName ||
                  appContext.helper.firebaseUser?.displayName?.split(' ')[1] ||
                  '',
              },
              onSubmit: async (values) => {
                try {
                  if (!creativeUser)
                    throw new Error('Creative user not resolved');
                  creativeUser.details = { ...creativeUser.details, ...values };
                  creativeUser.portoflioPercentage =
                    creativeUser.getPercentage();
                  creativeUser.email = user.email;
                  await appContext.sdkServices?.core.CreativeUserEntityService.persist(
                    creativeUser,
                  );
                  appContext.helper.showSuccess('Success');
                } catch (error) {
                  appContext.helper.showError('Profile update failed');
                }
              },
            }}
            schema={formSchemas.CreativeProfile.getSchema()}
          />
        ) : (
          <CircularProgress />
        )}
      </ProfileLayout>
    </NavigationLayout>
  );
};

export default UserProfile;
