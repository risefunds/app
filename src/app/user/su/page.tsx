'use client';
import { NavigationLayout } from 'layouts/NavigationLayout';
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from 'context/AppContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SULayout from 'layouts/SULayout';

const SUCreativesPage = () => {
  const appContext = useContext(AppContext);
  const searchParams = useSearchParams();

  return (
    <NavigationLayout>
      <SULayout selected="" />
    </NavigationLayout>
  );
};

export default SUCreativesPage;
