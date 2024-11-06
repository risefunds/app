import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from 'context/AppContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface IDashboardLayoutProps {
  selected: string;
}

const DashboardLayout: React.FC<IDashboardLayoutProps> = ({ selected }) => {
  const router = useRouter();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    router.push(`/user/dashboard/${newValue}`);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Tabs
        value={selected}
        onChange={handleTabChange}
        aria-label="dashboard tabs"
        centered
      >
        <Tab label="Profile" value="profile" />
        <Tab label="Documents" value="document" />
      </Tabs>
    </Box>
  );
};

export default DashboardLayout;
