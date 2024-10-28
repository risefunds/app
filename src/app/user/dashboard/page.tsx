'use client';

import React, { useEffect, useState, useContext } from 'react';
import { useAuth } from 'hooks/useAuth';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ProfileLayout } from 'layouts/ProfileLayout';
// import CampaignLayout from 'layouts/CampaignLayout';
import UserProfile from 'components/UserProfile';
import { NavigationLayout } from 'layouts/NavigationLayout';
import Box from '@mui/material/Box';

// import UserCampaign from 'components/UserCampaign';

export default function Dashboard() {
  const { user, appContext } = useAuth();

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (
    event: any,
    newValue: React.SetStateAction<number>
  ) => {
    setSelectedTab(newValue);
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <NavigationLayout>
      {/* Tabs for navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="dashboard tabs"
          centered // Centers the tabs
        >
          <Tab label="Profile" />
          <Tab label="Campaigns" />
        </Tabs>
      </Box>

      {/* Conditional rendering based on selected tab */}
      {selectedTab === 0 && (
        <ProfileLayout pageTitle="User Profile">
          <UserProfile />
        </ProfileLayout>
      )}
      {selectedTab === 1 && (
        // <CampaignLayout pageTitle="User Campaigns">
        //   <UserCampaign />
        // </CampaignLayout>
        <h1>Na wedy here</h1>
      )}
    </NavigationLayout>
  );
}
