'use client';

import React, { useState, useContext, useEffect } from 'react';
import { NavigationLayout } from 'layouts/NavigationLayout';

import {
  Container,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { v4 } from 'uuid';
import LinearProgress from '@mui/material/LinearProgress';
import { FormBuilderJSON } from 'components/FormBuilder';
import { AppContext } from 'context/AppContext';
import { formSchemas, models } from '@risefunds/sdk';

const UserCampaign = () => {
  const appContext = useContext(AppContext);
  const [creativeUser, setCreativeUser] = useState<
    models.CreativeUserEntityModel | undefined
  >(undefined);
  const [campaigns, setCampaigns] = useState<models.CampaignEntityModel[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<
    models.CampaignEntityModel | undefined
  >(undefined);
  const [currentCampaign, setCurrentCampaign] = useState<
    models.CampaignEntityModel | undefined
  >(undefined);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch campaigns on load
  useEffect(() => {
    const getCreativeUserCampaigns: () => Promise<void> = async () => {
      try {
        setLoading(true);
        if (!appContext.helper.platformUser)
          throw new Error('Platform user not resolved.');
        let creativeUsers =
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
        console.log({
          creativeUser: creativeUser?.parentReference.PlatformUser,
        });
        setCreativeUser(creativeUser);

        if (creativeUser) {
          const creativeUserCampaigns =
            await appContext.sdkServices?.core.CampaignEntityService.where({
              params: [
                {
                  key: 'archive',
                  value: false,
                  operator: '==',
                },
                {
                  key: 'parentReference.CreativeUser',
                  value: creativeUser.id,
                  operator: '==',
                },
              ],
            });

          console.log({ creativeUser: creativeUserCampaigns });

          if (creativeUserCampaigns) {
            setCampaigns(creativeUserCampaigns);
          }
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        appContext.helper.showError(error);
      }
      setLoading(false);
    };
    if (appContext.helper.platformUser) getCreativeUserCampaigns();
  }, [appContext.helper.platformUser?.id, creativeUser?.id]);

  // show the form only after selectedCampaign is set
  useEffect(() => {
    if (selectedCampaign === undefined && showForm) {
      setShowForm(true);
    } else if (selectedCampaign) {
      setShowForm(true);
    }
  }, [selectedCampaign]);

  // Handler to add a new campaign
  const handleAddCampaign = async () => {
    setSelectedCampaign(undefined); // Reset selected campaign to create new one
    setShowForm(false);
    try {
      // Create a new campaign
      setLoading(true);
      if (!appContext.helper.platformUser || !creativeUser)
        throw new Error('User not resolved.');

      const campaignCol =
        await appContext.sdkServices?.core.CampaignEntityService.persist(
          new models.CampaignEntityModel({
            [appContext.helper.platformUser.collection]:
              appContext.helper.platformUser.id,
            [creativeUser.collection]: creativeUser.id,
          }),
        );

      setSelectedCampaign(campaignCol);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Handler to select a campaign for editing
  const handleSelectCampaign = (campaign: models.CampaignEntityModel) => {
    setShowForm(false); // Hide the form initially
    setSelectedCampaign(campaign);
  };

  // Handler to save a campaign
  const handleSaveCampaign = async (values: models.CampaignEntityModel) => {
    try {
      setLoading(true);
      if (!creativeUser) throw new Error('Creative user not resolved.');

      if (selectedCampaign) {
        // Update an existing campaign
        // selectedCampaign.details = { ...selectedCampaign, ...values };
        console.log({ selectedCampaign });

        selectedCampaign.campaignTitle = values.campaignTitle;
        selectedCampaign.campaignTagline = values.campaignTagline;
        selectedCampaign.campaignCategory = values.campaignCategory;
        selectedCampaign.campaignTags = values.campaignTags;
        selectedCampaign.campaignLocation = values.campaignLocation;
        selectedCampaign.campaignDuration = values.campaignDuration;
        selectedCampaign.campaignCard = values.campaignCard;

        await appContext.sdkServices?.core.CampaignEntityService.persist(
          selectedCampaign,
        );
      }
      const listedCampaigns =
        await appContext.sdkServices?.core.CampaignEntityService.where({
          params: [
            {
              key: 'archive',
              value: false,
              operator: '==',
            },
            {
              key: 'parentReference.CreativeUser',
              value: creativeUser.id,
              operator: '==',
            },
          ],
        });

      if (listedCampaigns) {
        setCampaigns(listedCampaigns);
      }
      appContext.helper.showSuccess('Campaign Saved');
      setLoading(false);
      // setShowForm(false);
      setSelectedCampaign(undefined);
    } catch (error) {
      appContext.helper.showError(error);
    }
  };

  return (
    <NavigationLayout>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Left Navigation Panel */}
          <Grid size={{ xs: 12, sm: 3 }}>
            {isMobile ? (
              <Tabs
                value={
                  showForm
                    ? 'form'
                    : selectedCampaign
                      ? selectedCampaign
                      : 'new'
                }
                onChange={(event, value) => {
                  if (value === 'new') handleAddCampaign();
                  else {
                    const campaign = campaigns.find((c) => c.id === value);
                    handleSelectCampaign(campaign!);
                  }
                }}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Campaign Tabs"
              >
                <Tab label="Add New Campaign" value="new" />
                {campaigns.map((campaign) => (
                  <Tab
                    label={campaign.campaignTitle || 'Untitled'}
                    value={campaign.id}
                    key={campaign.id}
                  />
                ))}
              </Tabs>
            ) : (
              <List component="nav">
                <ListItemButton onClick={handleAddCampaign}>
                  <ListItemText primary="+ Add New Campaign" />
                </ListItemButton>
                {campaigns.map((campaign) => (
                  <ListItemButton
                    key={campaign.id}
                    onClick={() => handleSelectCampaign(campaign)}
                  >
                    <ListItemText
                      primary={campaign.campaignTitle || 'Untitled'}
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Main Content Panel */}
          <Grid size={{ xs: 12, sm: 9 }}>
            <Box>
              {showForm ? (
                <FormBuilderJSON
                  FormBuilderProps={{
                    initialValues: selectedCampaign ? selectedCampaign : {},
                    onSubmit: async (values: any) => {
                      await handleSaveCampaign(values);
                    },
                  }}
                  schema={formSchemas.CampaignBasics.getSchema()}
                />
              ) : (
                <></>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </NavigationLayout>
  );
};

export default UserCampaign;
