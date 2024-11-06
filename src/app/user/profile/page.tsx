'use client';

import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from 'context/AppContext';
import { useAuth } from 'hooks/useAuth';
import { NavigationLayout } from 'layouts/NavigationLayout';
import { formSchemas, models } from '@risefunds/sdk';
import { ProfileLayout } from 'layouts/ProfileLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { FormBuilderJSON } from 'components/FormBuilder';
import Typography from '@mui/material/Typography';

const UserProfile = () => {
  const { user } = useAuth();
  const appContext = useContext(AppContext);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [creativeUser, setCreativeUser] = useState<
    models.CreativeUserEntityModel | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  // Ref to track if `getCreativeUser` has already been executed
  const isFetchingCreativeUser = useRef(false);

  // Handle tab change and update URL without affecting creativeUser
  const handleTabChange = (event: any, newValue: number) => {
    setSelectedTab(newValue);
    const newTab = newValue === 0 ? 'profile' : 'documents';
    router.push(`?tab=${newTab}`, undefined);
  };

  // Manage tab state independently
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'profile') {
      setSelectedTab(0);
    } else if (tab === 'campaign') {
      setSelectedTab(1);
    }
  }, [searchParams]);

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
        isFetchingCreativeUser.current = false; // Reset ref after completion
      }
    };

    // Only fetch/create creativeUser if platformUser exists and creativeUser hasn't been fetched/created yet
    if (
      appContext.helper.platformUser &&
      !creativeUser &&
      !isFetchingCreativeUser.current
    ) {
      isFetchingCreativeUser.current = true; // Set ref to prevent duplicate calls
      getCreativeUser();
    }
    setLoading(false);
  }, [appContext.helper.platformUser, creativeUser]);

  const getProfileValues = () => (creativeUser ? creativeUser.details : {});
  const getDocumentValues = () => (creativeUser ? creativeUser.documents : {});

  if (!user) {
    return <p>Loading...</p>;
  }

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <NavigationLayout>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="dashboard tabs"
          centered
        >
          <Tab label="Profile" />
          <Tab label="Documents" />
        </Tabs>
      </Box>

      {selectedTab === 0 && (
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

          <FormBuilderJSON
            FormBuilderProps={{
              initialValues: {
                ...getProfileValues(),
                firstName:
                  appContext.helper.firebaseUser?.displayName?.split(' ')[0] ||
                  '',
                lastName:
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
        </ProfileLayout>
      )}
      {selectedTab === 1 && (
        <ProfileLayout>
          {!creativeUser?.isVerified ? (
            <FormBuilderJSON
              FormBuilderProps={{
                initialValues: { ...getDocumentValues() },
                onSubmit: async (values) => {
                  try {
                    if (!creativeUser)
                      throw new Error('Creative user not resolved');
                    creativeUser.documents = {
                      ...creativeUser.documents,
                      ...values,
                    };
                    creativeUser.portoflioPercentage =
                      creativeUser.getPercentage();
                    await appContext.sdkServices?.core.CreativeUserEntityService.persist(
                      creativeUser,
                    );
                    appContext.helper.showSuccess('Success');
                  } catch (error) {
                    appContext.helper.showError('Profile update failed');
                  }
                },
              }}
              schema={formSchemas.CreativeDocuments.getSchema()}
            />
          ) : (
            <p>There are no additional documents to upload at this time</p>
          )}
        </ProfileLayout>
      )}
    </NavigationLayout>
  );
};

export default UserProfile;
