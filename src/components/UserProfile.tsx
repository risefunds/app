'use client';

import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from 'context/AppContext';
import { useAuth } from 'hooks/useAuth';
import { formSchemas, models } from '@risefunds/sdk';
import { ProfileLayout } from 'layouts/ProfileLayout';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { FormBuilderJSON } from 'components/FormBuilder';
import Typography from '@mui/material/Typography';

const UserProfile = () => {
  const { user } = useAuth();
  const appContext = useContext(AppContext);
  const [creativeUser, setCreativeUser] = useState<
    models.CreativeUserEntityModel | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getCreativeUser = async () => {
      try {
        setLoading(true);
        if (!appContext.helper.platformUser)
          throw new Error('Platform user not resolved.');
        let creativeUsers =
          await appContext.sdkServices?.core.CreativeUserEntityService.where(
            {
              params: [ { key: 'parentReference.PlatformUser', value: appContext.helper.platformUser.id, operator: '==' }],
            }
          );


        let creativeUser = creativeUsers?.[0];
        if (!creativeUser) {
          creativeUser =
            await appContext.sdkServices?.core.CreativeUserEntityService.persist(
              new models.CreativeUserEntityModel({
                [appContext.helper.platformUser.collection]:
                  appContext.helper.platformUser.id,
              })
            );
        }

        setCreativeUser(creativeUser);
      } catch (error) {
        console.log(error);
        appContext.helper.showError(error);
      }

      setLoading(false);
    };
    if (appContext.helper.platformUser) getCreativeUser();
  }, [appContext.helper.platformUser]);

  // Function to get values for the form
  const getValues = () => {
    if (creativeUser) return creativeUser?.details;
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <ProfileLayout pageTitle="Register">
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
          initialValues: { ...getValues() },
          onSubmit: async (values) => {
            try {
              if (!creativeUser) throw new Error('Creative user not resolved');
              creativeUser.details = { ...creativeUser.details, ...values };
              await appContext.sdkServices?.core.CreativeUserEntityService.persist(
                creativeUser
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
  );
};

export default UserProfile;
