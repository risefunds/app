'use client';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'next/navigation';
import { AppContext } from 'context/AppContext';
import { NavigationLayout } from 'layouts/NavigationLayout';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import CircularProgress from '@mui/material/CircularProgress';
import { models } from '@risefunds/sdk';

const CampaignDetails: React.FC = () => {
  const params = useParams();
  const appContext = useContext(AppContext);
  const [campaign, setCampaign] = useState<
    models.CampaignEntityModel | undefined
  >(undefined);
  const [creativeUser, setCreativeUser] = useState<
    models.CreativeUserEntityModel | undefined
  >(undefined);
  const [creativeId, setCreativeId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const campaignId = params?.campaignId?.[0];

  useEffect(() => {
    const fetchData = async () => {
      if (campaignId) {
        let campaigns =
          await appContext.sdkServices?.core.CampaignEntityService.where({
            params: [
              {
                key: 'archive',
                value: false,
                operator: '==',
              },
              {
                key: 'id',
                value: campaignId,
                operator: '==',
              },
            ],
          });
        let campaign = campaigns?.[0];
        setCreativeId(campaign?.parentReference.CreativeUser);
        setCampaign(campaign);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (creativeId) {
        let creatives =
          await appContext.sdkServices?.core.CreativeUserEntityService.where({
            params: [
              {
                key: 'archive',
                value: false,
                operator: '==',
              },
              {
                key: 'id',
                value: creativeId,
                operator: '==',
              },
            ],
          });
        let creative = creatives?.[0];
        setCreativeUser(creative);
        setLoading(false);
      }
    };
    fetchData();
  }, [campaign]);

  if (!campaignId) return <div>Loading...</div>;

  return (
    <NavigationLayout>
      {campaign && creativeUser ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
            maxWidth: 1200,
            mx: 'auto',
          }}
        >
          {/* Main Section with Image and Details Side by Side */}
          <Paper
            elevation={3}
            sx={{
              maxWidth: 1200,
              width: '100%',
              mx: 'auto',
              p: 3,
              mb: 3,
              borderRadius: 3,
            }}
          >
            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {/* Image Section */}
              <Grid size={6}>
                <Paper
                  elevation={3}
                  sx={{ overflow: 'hidden', borderRadius: 3 }}
                >
                  <img
                    src={campaign.campaignCard?.files[0].url}
                    alt={`Campaign ${campaignId} image`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '12px',
                    }}
                  />
                </Paper>
              </Grid>

              {/* Campaign Details Section */}
              <Grid size={6}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <Box>
                    <Typography
                      variant="overline"
                      color="success.main"
                      sx={{ fontWeight: 'bold', mb: 1 }}
                    >
                      FUNDING
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 'bold', mb: 1.5 }}
                    >
                      {campaign.campaignTitle}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      gutterBottom
                    >
                      {campaign.campaignTagline}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {creativeUser.details.firstName}{' '}
                      {creativeUser.details.lastName} |{' '}
                      {campaign.campaignCategory?.value?.toString()} |{' '}
                      {campaign.campaignLocation}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      $2,098 CAD
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      30% of $6,934 Flexible Goal
                    </Typography>

                    <Box sx={{ width: '100%', mt: 1, mb: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={30}
                        sx={{
                          height: 8,
                          borderRadius: 3,
                          bgcolor: '#f1f1f1',
                          '& .MuiLinearProgress-bar': { bgcolor: '#4caf50' },
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        44 backers
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {campaign.campaignDuration} days left
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: '#3f51b5',
                        color: '#fff',
                        fontWeight: 'bold',
                        py: 1.5,
                        borderRadius: 3,
                        mb: 1,
                        '&:hover': { bgcolor: '#303f9f' },
                      }}
                    >
                      BACK THIS CAMPAIGN
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          {/* Tabs Section */}
          <Paper
            elevation={3}
            sx={{
              maxWidth: 1000,
              width: '100%',
              mx: 'auto',
              mt: 2,
              borderRadius: 3,
            }}
          >
            <Divider />
          </Paper>
        </Box>
      ) : (
        <>
          <CircularProgress size="3rem" />
        </>
      )}
    </NavigationLayout>
  );
};

export default CampaignDetails;
