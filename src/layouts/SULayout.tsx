import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from 'context/AppContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface ISULayoutProps {
  selected: string;
}

const SULayout: React.FC<ISULayoutProps> = ({ selected }) => {
  const appContext = useContext(AppContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(selected);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    // setSelectedTab(newValue);
    router.push(`/user/su/${newValue}`);
  };

  //   useEffect(() => {
  //     setSelectedTab(selected);
  //   }, [selected]);

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
