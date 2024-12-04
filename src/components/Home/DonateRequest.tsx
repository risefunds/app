import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useState } from 'react';
import { GenericButton, IGenericButtonProps } from 'components/generic/Button';
import { FormBuilderJSON } from 'components/FormBuilder';
import { Close } from '@mui/icons-material';
import { formSchemas } from '@risefunds/sdk';
import { useContext } from 'react';
import { AppContext } from 'context/AppContext';
import { useRouter } from 'next/navigation';

interface IJobRequestProps {
  ButtonProps?: IGenericButtonProps;
  campaignId: string;
}
export const DonateRequest: React.FC<IJobRequestProps> = ({
  ButtonProps = {},
  campaignId,
  ...props
}) => {
  const appContext = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const donateSchema = formSchemas.DonateFormSchema.getSchema();

  return (
    <>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box p={1}>
          <IconButton
            onClick={() => {
              setOpen(false);
            }}
            size="small"
          >
            <Close />
          </IconButton>
        </Box>
        <Grid direction="column" container sx={{ width: '100%' }}>
          <Grid size={{ md: 6 }}>
            <Box>
              <DialogContent>
                <Typography variant="h6">Post a Job for FREE!</Typography>
                <Typography variant="body1">
                  Create your job listing in less than 2 minutes.
                </Typography>
              </DialogContent>
            </Box>
          </Grid>
          <Grid size={{ md: 6 }}>
            <Box p={3}>
              <FormBuilderJSON
                schema={donateSchema}
                FormBuilderProps={{
                  onChange: (values) => {
                    console.log(values);
                  },
                  initialValues: {
                    ...donateSchema.initialValues,
                    email: appContext.helper.firebaseUser?.email ?? '',
                    name:
                      appContext.helper.firebaseUser?.displayName ??
                      appContext.helper.platformUser?.name ??
                      '',
                  },
                  onSubmit: async (values) => {
                    try {
                      appContext.helper.setLocalStoreValue(
                        'signInEmail',
                        values.email,
                      );

                      const donateResponse =
                        await appContext.sdkServices?.base.backendService.request<{
                          customToken: string;
                          donation: string;
                          platformUserId: string;
                        }>(
                          '/pub/addon/entity/Donation/createDonation',
                          {
                            ...values,
                            donateId: (
                              (values.donateId || '') as string
                            ).replace('/donate/', ''),
                            campaignId,
                          },
                          false,
                        );

                      router.push(
                        `/user/client/donate/${donateResponse?.donation}?n3Code=autoSignin&jwt=${donateResponse?.customToken}&uid=${donateResponse?.platformUserId}/${values.amount}`,
                      );
                    } catch (error) {
                      appContext.helper.showError(error);
                    }
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <br />
      </Dialog>

      <GenericButton
        variant="outlined"
        fullWidth={true}
        size="large"
        onClick={() => {
          setOpen(true);
        }}
        {...ButtonProps}
      >
        Back This Campaign
      </GenericButton>
    </>
  );
};
