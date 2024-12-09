'use client';
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from 'context/AppContext';
import { Box, TextField, InputAdornment, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import Filters from 'components/generic/Filters';
import { CampaignCard } from 'components/generic/CampaignCard';
import { NavigationLayout } from 'layouts/NavigationLayout';
import { models } from '@risefunds/sdk';

const ExplorePage = () => {
  const appContext = useContext(AppContext);
  const [selectedFilter, setSelectedFilter] = useState({
    category: 'All Categories',
  });
  const [allCampaigns, setAllCampaigns] = useState<
    models.CampaignEntityModel[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!appContext.helper.authUserLoading) {
        const campaigns =
          await appContext.sdkServices?.core.CampaignEntityService.where({
            params: [
              {
                key: 'archive',
                value: false,
                operator: '==',
              },
              {
                key: 'featured',
                value: 'all',
                operator: 'array-contains',
              },
            ],
          });
        if (campaigns) {
          setAllCampaigns(campaigns);
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [appContext.helper.authUserLoading]);

  const filteredCampaigns = allCampaigns.filter(
    (campaign) =>
      selectedFilter.category === 'All Categories' ||
      campaign.campaignCategory?.label?.toString() === selectedFilter.category,
  );

  return (
    <NavigationLayout>
      {/* Header Section */}
      <Box
        sx={{
          width: '100%',
          height: '300px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)', // Optional for better readability
          }}
        >
          Explore it all
        </Typography>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Stack vertically on small screens
          gap: 3, // Add spacing between filter and grid
          p: 3,
        }}
      >
        {/* Sidebar Filters */}
        <Box
          sx={{
            flex: '1 0 25%', // Take 25% of the width
            maxWidth: '300px',
          }}
        >
          <Filters
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        </Box>

        {/* Campaign Grid */}
        <Box
          sx={{
            flex: '3 0 75%', // Take 75% of the width
          }}
        >
          {/* Campaign Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Responsive columns
              gap: 2, // Spacing between campaign cards
            }}
          >
            {!loading ? (
              allCampaigns &&
              filteredCampaigns.map((campaign) => (
                <CampaignCard
                  campaignId={campaign.id}
                  img={campaign.campaignCard?.files[0].url!}
                  name={campaign.campaignTitle}
                  category={campaign.campaignCategory?.label.toString()!}
                  key={campaign.id}
                />
              ))
            ) : (
              <>
                <CircularProgress size="3rem" />
              </>
            )}
          </Box>
        </Box>
      </Box>
    </NavigationLayout>
  );
};

export default ExplorePage;
