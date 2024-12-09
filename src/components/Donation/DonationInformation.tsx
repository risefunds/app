import {
  Close,
  Done,
  ExpandMore,
  HourglassBottom,
  Lock,
  LockOpen,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { formSchemas, models, utils } from '@risefunds/sdk';
import { AppContext } from 'context/AppContext';
import { FormBuilderJSON } from 'components/FormBuilder';
import { GenericButton } from 'components/generic/Button';
import { GenericListItemText } from 'components/generic/GenericListItemText';
import matchmaking from 'public/images/matchmaking.jpg';
import _ from 'lodash';

import { useContext, useState, useEffect } from 'react';
import theme from 'utils/theme';
import Image from 'next/image';

interface IDonationInformationProps {
  donation: models.DonationEntityModel;
  jwt: string;
}

export const DonationInformation: React.FC<IDonationInformationProps> = (
  props,
) => {
  const [editDonation, setEditDonation] = useState(false);
  const [sponsoredCampaign, setSponsoredCampaign] = useState<
    models.CampaignEntityModel | undefined
  >(undefined);
  const [donation, setDonation] = useState<
    models.DonationEntityModel | undefined
  >(props.donation);
  const appContext = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const isPaymentComplete =
    donation?.stripeCheckoutSessionDetails?.status === 'complete' || false;

  useEffect(() => {
    if (isPaymentComplete && donation) {
      const getCampaign = async () => {
        const campaign =
          await appContext.sdkServices?.core.CampaignEntityService.get(
            donation.details.campaignId,
          );
        if (campaign) {
          setSponsoredCampaign(campaign);

          const amountDonated = Number(donation.details.amount);
          campaign.currentAmount = campaign?.updateAmount(amountDonated);
          console.log({ currentAmount: campaign.currentAmount });

          await appContext.sdkServices?.core.CampaignEntityService.persist(
            campaign,
          );
        }
      };

      getCampaign();
    }
  }, []);

  return (
    <>
      <Paper>
        <Accordion
          sx={{
            width: '100%',
            height: '100%',
            my: 0,
            '&.MuiAccordion-root': { my: 0 },
          }}
        >
          <AccordionSummary>
            <Grid
              container
              sx={{ width: '100%' }}
              justifyContent="space-between"
              alignItems={'center'}
            >
              <Grid>
                <Grid container spacing={2} alignItems={'center'}>
                  <Grid>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: theme.palette.success.main,
                      }}
                    >
                      <Done
                        sx={{
                          fontSize: theme.typography.body2.fontSize,
                        }}
                      />
                    </Avatar>
                  </Grid>
                  <Grid>
                    <GenericListItemText
                      primaryTypographyProps={{ variant: 'body1' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                      sx={{ my: 0 }}
                      primary={`${donation?.details.displayName} Backing`}
                      secondary={'We have received your backing request.'}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid>
                <ExpandMore />
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <FormBuilderJSON
              FormBuilderProps={{
                readOnly: !editDonation,
                initialValues: {
                  ...formSchemas.DonateFormSchema.donateInitialValues,
                  ...donation?.details,
                },
                onSubmit: async (values) => {
                  try {
                    if (donation) {
                      donation.details = values;
                      const persistedBooking =
                        await appContext.sdkServices?.core.DonationEntityService.persist(
                          donation,
                        );
                      setDonation(persistedBooking);
                    }
                  } catch (error) {
                    appContext.helper.showError(error);
                  }
                  setEditDonation(false);
                },
              }}
              schema={formSchemas.DonateFormSchema.getSchema()}
            />
          </AccordionDetails>
          {!editDonation && (
            <AccordionActions sx={{ p: 1 }}>
              <GenericButton
                fullWidth={false}
                size="small"
                variant="text"
                onClick={() => {
                  setEditDonation((er) => !er);
                }}
              >
                Edit Request
              </GenericButton>
            </AccordionActions>
          )}
        </Accordion>
        <Accordion
          sx={{
            width: '100%',
            height: '100%',
            my: 0,
            '&.MuiAccordion-root': { my: 0 },
          }}
          defaultExpanded={!isPaymentComplete}
        >
          <AccordionSummary>
            <Grid
              container
              sx={{ width: '100%' }}
              justifyContent="space-between"
              alignItems={'center'}
            >
              <Grid>
                <Grid container spacing={2} alignItems={'center'}>
                  <Grid>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: isPaymentComplete
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                      }}
                    >
                      {isPaymentComplete ? (
                        <Done
                          sx={{
                            fontSize: theme.typography.body2.fontSize,
                          }}
                        />
                      ) : (
                        <Lock
                          sx={{
                            fontSize: theme.typography.body2.fontSize,
                          }}
                        />
                      )}
                    </Avatar>
                  </Grid>
                  <Grid>
                    <GenericListItemText
                      primaryTypographyProps={{ variant: 'body1' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                      sx={{ my: 0 }}
                      primary={
                        isPaymentComplete
                          ? 'Payment Received'
                          : 'Send Backing'
                      }
                      secondary={
                        'Thank you for you interest in supporting a campaign.'
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid>
                <ExpandMore />
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            {!isPaymentComplete && (
              <>
                {/* <Image src={matchmaking} alt="lolve" /> */}
                <Box mb={2}>
                  <Typography variant="body1">Company</Typography>
                  <Typography variant="body2">Risefunds</Typography>
                </Box>
              </>
            )}

            <List disablePadding>
              <ListItem disableGutters dense>
                <GenericListItemText
                  secondaryTypographyProps={{
                    sx: { textTransform: 'capitalize' },
                  }}
                  secondary={
                    donation?.stripeCheckoutSessionDetails?.status ?? 'Pending'
                  }
                  primary="Payment Status"
                />
              </ListItem>
              <ListItem disableGutters dense>
                <GenericListItemText
                  secondary={utils.paymentUtils.parseCentsString(
                    donation?.stripeCheckoutSessionDetails?.amount ?? 0,
                  )}
                  primary="Amount"
                />
              </ListItem>

              {!isPaymentComplete && (
                <ListItem
                  disableGutters
                  dense
                  onClick={async () => {
                    try {
                      setLoading(true);
                      if (!donation) throw new Error('Job Request not found');
                      if (!donation.stripeCheckoutSessionDetails) {
                        const createPaymentLinkResponse =
                          await appContext.sdkServices?.base.backendService.request<{
                            paymentLink: string;
                          }>(
                            '/pub/addon/entity/Donation/createPaymentLink',
                            {
                              donation: donation.id,
                              jwt: props.jwt,
                              amount: donation.details.amount,
                            },
                            false,
                          );
                        if (createPaymentLinkResponse)
                          window.location.replace(
                            createPaymentLinkResponse.paymentLink,
                          );
                      } else {
                        window.location.replace(
                          donation.stripeCheckoutSessionDetails.url,
                        );
                      }
                    } catch (error) {
                      appContext.helper.showError(error);
                    }
                    setLoading(false);
                  }}
                >
                  <>
                    <GenericButton
                      size="large"
                      color="success"
                      endIcon={<LockOpen />}
                      loading={loading}
                    >
                      Pay to back campaign
                    </GenericButton>
                  </>
                </ListItem>
              )}
            </List>
          </AccordionDetails>
        </Accordion>
        <Accordion
          sx={{
            width: '100%',
            height: '100%',
            my: 0,
            '&.MuiAccordion-root': { my: 0 },
          }}
          defaultExpanded={isPaymentComplete}
          disabled={!isPaymentComplete}
        >
          <AccordionSummary>
            <Grid
              container
              sx={{ width: '100%' }}
              justifyContent="space-between"
              alignItems={'center'}
            >
              <Grid>
                <Grid container spacing={2} alignItems={'center'}>
                  <Grid>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: theme.palette.primary.main,
                      }}
                    >
                      {isPaymentComplete ? (
                        <Done
                          sx={{
                            fontSize: theme.typography.body2.fontSize,
                          }}
                        />
                      ) : (
                        <Typography variant="caption">3</Typography>
                      )}
                    </Avatar>
                  </Grid>
                  <Grid>
                    <GenericListItemText
                      primaryTypographyProps={{ variant: 'body1' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                      sx={{ my: 0 }}
                      primary="Payment in progress."
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid>
                <ExpandMore />
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            {isPaymentComplete && (
              <>
                <Box mb={2}>
                  <Typography variant="body1">Company</Typography>
                  <Typography variant="body2">Risefunds</Typography>
                </Box>
              </>
            )}
          </AccordionDetails>
        </Accordion>
      </Paper>
    </>
  );
};
