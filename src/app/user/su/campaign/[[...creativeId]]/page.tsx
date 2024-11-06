'use client';
import { NavigationLayout } from 'layouts/NavigationLayout';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from 'context/AppContext';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import SULayout from 'layouts/SULayout';
import { models } from '@risefunds/sdk';
import { CampaignDataTable } from 'components/su/campaign/CampaignDataTable';

const SUCampaignsPage = () => {
  const appContext = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<models.CampaignEntityModel[]>([]);
  const campaignSubscription = useRef<Function | undefined>();
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        campaignSubscription.current =
          await appContext.sdkServices?.core.CampaignEntityService.subscribe(
            {
              params: [
                {
                  key: 'archive',
                  value: false,
                  operator: '==',
                },
              ],
            },
            async (error, response) => {
              try {
                setLoading(true);
                if (error) throw error;
                const newCampaigns = await response;
                if (!newCampaigns) throw new Error('Error featching creatives');

                setCampaigns(newCampaigns);
              } catch (error) {
                appContext.helper.showError((error as Error).message);
              }
              setLoading(false);
            },
          );
      } catch (error) {
        appContext.helper.showError((error as Error).message);
      }
    };

    fetchCampaigns();
    return () => {
      if (campaignSubscription.current) {
        campaignSubscription.current();
      }
    };
  }, []);

  return (
    <NavigationLayout>
      <SULayout selected="campaign" />
      <Container maxWidth="xl">
        <Paper sx={{ mt: 2 }}>
          <CampaignDataTable campaigns={campaigns} loading={loading} />
        </Paper>
      </Container>
    </NavigationLayout>
  );
};

export default SUCampaignsPage;
