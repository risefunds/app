'use client';
import { NavigationLayout } from 'layouts/NavigationLayout';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from 'context/AppContext';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import SULayout from 'layouts/SULayout';
import { models } from '@risefunds/sdk';
import { CreativeDataTable } from 'components/su/creative/CreativeDataTable';

const SUCreativesPage = () => {
  const appContext = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [creatives, setCreatives] = useState<models.CreativeUserEntityModel[]>(
    [],
  );
  const creativeSubscription = useRef<Function | undefined>();
  useEffect(() => {
    const fetchCreatives = async () => {
      try {
        creativeSubscription.current =
          await appContext.sdkServices?.core.CreativeUserEntityService.subscribe(
            {
              params: [],
            },
            async (error, response) => {
              try {
                setLoading(true);
                if (error) throw error;
                const newCreatives = await response;
                if (!newCreatives) throw new Error('Error featching creatives');

                setCreatives(newCreatives);
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

    fetchCreatives();
    return () => {
      if (creativeSubscription.current) {
        creativeSubscription.current();
      }
    };
  }, []);

  return (
    <NavigationLayout>
      <SULayout selected="creative" />
      <Container maxWidth="xl">
        <Paper sx={{ mt: 2 }}>
          <CreativeDataTable creatives={creatives} loading={loading} />
        </Paper>
      </Container>
    </NavigationLayout>
  );
};

export default SUCreativesPage;
