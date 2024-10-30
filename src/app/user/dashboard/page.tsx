'use client';

import React, { useEffect, useState, useContext } from 'react';
import { useAuth } from 'hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ProfileLayout } from 'layouts/ProfileLayout';
import UserCampaign from 'components/UserCampaign';
import UserProfile from 'components/UserProfile';
import { NavigationLayout } from 'layouts/NavigationLayout';
import Box from '@mui/material/Box';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State to control selected tab
  const [selectedTab, setSelectedTab] = useState(0);

  // Set selected tab based on URL query parameter
  useEffect(() => {
    // const tab = new URLSearchParams(window.location.search).get('tab');
    const tab = searchParams.get('tab');
    if (tab === 'profile') {
      setSelectedTab(0);
    } else if (tab === 'campaign') {
      setSelectedTab(1);
    }
  }, [searchParams]);

  // Handle tab change and update URL
  const handleTabChange = (event: any, newValue: number) => {
    setSelectedTab(newValue);
    const newTab = newValue === 0 ? 'profile' : 'campaign';
    router.push(`?tab=${newTab}`, undefined);
  };

  if (!user) {
    return <p>Loading...</p>;
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
          <Tab label="Campaigns" />
        </Tabs>
      </Box>

      {/* Conditional rendering based on selected tab */}
      {selectedTab === 0 && (
        <ProfileLayout pageTitle="User Profile">
          <UserProfile />
        </ProfileLayout>
      )}
      {selectedTab === 1 && <UserCampaign />}
    </NavigationLayout>
  );
}
