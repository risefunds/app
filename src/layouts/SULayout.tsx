import React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface ISULayoutProps {
  selected: string;
}

const SULayout: React.FC<ISULayoutProps> = ({ selected }) => {
  const router = useRouter();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    router.push(`/user/su/${newValue}`);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Tabs
        value={selected}
        onChange={handleTabChange}
        aria-label="dashboard tabs"
        centered
      >
        <Tab label="Creatives" value="creative" />
        <Tab label="Campaigns" value="campaign" />
      </Tabs>
    </Box>
  );
};

export default SULayout;
