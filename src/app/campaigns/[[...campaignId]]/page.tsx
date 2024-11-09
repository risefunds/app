"use client";
import * as React from 'react';
import { useParams } from 'next/navigation';
import { NavigationLayout } from 'layouts/NavigationLayout';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';

const CampaignDetails: React.FC = () => {
  const params = useParams();
  const campaignId = params?.campaignId?.[0]; // Access the campaignId from params

  const [tabIndex, setTabIndex] = React.useState(0);

  if (!campaignId) return <div>Loading...</div>;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <NavigationLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, maxWidth: 1200, mx: 'auto' }}>

        {/* Main Section with Image and Details Side by Side */}
        <Paper elevation={3} sx={{ maxWidth: 1200, width: '100%', mx: 'auto', p: 3, mb: 3, borderRadius: 3 }}>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            
            {/* Image Section */}
            <Grid size={6}>
              <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 3 }}>
                <img
                  src="/Home/hero2.jpg" 
                  alt={`Campaign ${campaignId} image`}
                  style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
                />
              </Paper>
            </Grid>

            {/* Campaign Details Section */}
            <Grid size={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box>
                  <Typography variant="overline" color="success.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                    FUNDING
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                    ATOMIC PUMP: 2.19oz Pocket Size 3-in-1 Air Pump
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Only 2.19oz | 5kPa In/Deflate Pressure | 400L/min Flow | IP44 Waterproof | 1500mAh Built-in Battery
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    by HOAMC | 1 Campaign | LOS ANGELES, United States
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    $2,098 CAD
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    30% of $6,934 Flexible Goal
                  </Typography>
      
                  <Box sx={{ width: '100%', mt: 1, mb: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={30}
                      sx={{
                        height: 8,
                        borderRadius: 3,
                        bgcolor: '#f1f1f1',
                        '& .MuiLinearProgress-bar': { bgcolor: '#4caf50' },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      44 backers
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      35 days left
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#3f51b5',
                      color: '#fff',
                      fontWeight: 'bold',
                      py: 1.5,
                      borderRadius: 3,
                      mb: 1,
                      '&:hover': { bgcolor: '#303f9f' },
                    }}
                  >
                    PICK YOUR PERK
                  </Button>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      sx={{
                        flex: 1,
                        borderColor: '#3f51b5',
                        color: '#3f51b5',
                        fontWeight: 'bold',
                        borderRadius: 3,
                        '&:hover': { borderColor: '#303f9f', color: '#303f9f' },
                      }}
                    >
                      SAVE FOR LATER
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        flex: 1,
                        borderColor: '#3f51b5',
                        color: '#3f51b5',
                        fontWeight: 'bold',
                        borderRadius: 3,
                        '&:hover': { borderColor: '#303f9f', color: '#303f9f' },
                      }}
                    >
                      SHARE
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        {/* Tabs Section */}
        <Paper elevation={3} sx={{ maxWidth: 1000, width: '100%', mx: 'auto', mt: 2, borderRadius: 3 }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ borderRadius: 3 }}
          >
            <Tab label="Story" />
            <Tab label="FAQ" />
            <Tab label="Updates" />
            <Tab label="Discussion" />
          </Tabs>
          <Divider />
          <Box sx={{ p: 3 }}>
            {tabIndex === 0 && <Typography variant="body2" color="text.secondary">Story content goes here.</Typography>}
            {tabIndex === 1 && <Typography variant="body2" color="text.secondary">FAQ content goes here.</Typography>}
            {tabIndex === 2 && <Typography variant="body2" color="text.secondary">Updates content goes here.</Typography>}
            {tabIndex === 3 && <Typography variant="body2" color="text.secondary">Discussion content goes here.</Typography>}
          </Box>
        </Paper>
      </Box>
    </NavigationLayout>
  );
};

export default CampaignDetails;
