'use client';

import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { AppContext } from 'context/AppContext';
import { useAuth } from 'hooks/useAuth';
import { NavigationLayout } from 'layouts/NavigationLayout';
import { formSchemas, models } from '@risefunds/sdk';
import { ProfileLayout } from 'layouts/ProfileLayout';
import LinearProgress from '@mui/material/LinearProgress';
import { FormBuilderJSON } from 'components/FormBuilder';
import Box from '@mui/material/Box';
import { blue, grey, purple } from '@mui/material/colors';
import VerifiedIcon from '@mui/icons-material/Verified';
import Typography from '@mui/material/Typography';
import DashboardLayout from 'layouts/DashboardLayout';
import CircularProgress from '@mui/material/CircularProgress';

const UserProfile = () => {
  const { user } = useAuth();
  const appContext = useContext(AppContext);

  const [creativeUser, setCreativeUser] = useState<
    models.CreativeUserEntityModel | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);

  // Use ref to track whether creativeUser has been initialized
  const isFetchingCreativeUser = useRef(false);

  useEffect(() => {
    const getCreativeUser = async () => {
      try {
        setLoading(true);
        if (!appContext.helper.platformUser)
          throw new Error('Platform user not resolved.');
        console.log({ platformUser: appContext.helper.platformUser });
        // Check if the user is already fetching to prevent duplicates
        if (isFetchingCreativeUser.current) return;

        isFetchingCreativeUser.current = true;

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
        isFetchingCreativeUser.current = false;
      }
    };

    // Only fetch/create creativeUser if platformUser exists and creativeUser hasn't been fetched/created yet
    if (appContext.helper.platformUser && !creativeUser) {
      getCreativeUser();
    }
  }, [appContext.helper.platformUser, creativeUser]);

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
        ></Typography>
        {creativeUser ? (
          <>
            <Box
              p={2}
              mr={3}
              bgcolor={
                creativeUser.isVerified &&
                creativeUser.profileCompletedEmailSent
                  ? blue[700]
                  : creativeUser.profileCompletedEmailSent
                    ? purple[200]
                    : purple[900]
              }
              color={grey[100]}
            >
              <Typography
                variant="body1"
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                Welcome {appContext.helper.firebaseUser?.displayName}
                {creativeUser.isVerified &&
                creativeUser.profileCompletedEmailSent ? (
                  <>
                    <VerifiedIcon
                      fontSize="small"
                      style={{ verticalAlign: 'middle', marginLeft: 4 }}
                    />
                  </>
                ) : creativeUser.profileCompletedEmailSent ? (
                  '. Verification request under review.'
                ) : (
                  '. Get your profile verified by adding a first and last name that matches your ID, and uploading all documents under the documents tab.'
                )}
              </Typography>
            </Box>
            <FormBuilderJSON
              FormBuilderProps={{
                initialValues: {
                  ...getProfileValues(),
                  firstName:
                    creativeUser?.details?.firstName ||
                    appContext.helper.firebaseUser?.displayName?.split(
                      ' ',
                    )[0] ||
                    '',
                  lastName:
                    creativeUser?.details?.lastName ||
                    appContext.helper.firebaseUser?.displayName?.split(
                      ' ',
                    )[1] ||
                    '',
                },
                onSubmit: async (values) => {
                  try {
                    if (!creativeUser)
                      throw new Error('Creative user not resolved');
                    creativeUser.details = {
                      ...creativeUser.details,
                      ...values,
                    };
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
          </>
        ) : (
          <CircularProgress />
        )}
      </ProfileLayout>
    </NavigationLayout>
  );
};

export default UserProfile;
