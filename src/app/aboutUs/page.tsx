'use client';

import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { useEffect } from 'react';

// About Us Page component
const About = () => {
  useEffect(() => {
    // This can be used later for animations or any other dynamic updates
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ padding: '50px 0', textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
          About Rise Funds
        </Typography>
        <Typography variant="h5" paragraph sx={{ color: '#555' }}>
          We are a group of passionate students from Conestoga College working to change the world through crowdfunding.
        </Typography>
        <Typography variant="body1" sx={{ color: '#777', marginBottom: '40px' }}>
          Rise Funds is a platform where students, startups, and communities can raise funds for their projects, ideas, and causes. We believe in the power of collective action and want to make it easier for great ideas to get the support they deserve.
        </Typography>

        {/* Grid for displaying skills */}
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                padding: 2,
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                Crowdfunding Expertise
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', marginTop: '10px' }}>
                Our team has experience in launching successful crowdfunding campaigns that help bring innovative ideas to life.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                padding: 2,
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                Innovation
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', marginTop: '10px' }}>
                We are always pushing the boundaries of what’s possible in the crowdfunding space with innovative solutions and technology.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                padding: 2,
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                Community-Driven
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', marginTop: '10px' }}>
                We believe in the power of community to drive positive change. Our platform empowers everyone to participate in funding projects they believe in.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                padding: 2,
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                Student-Powered
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', marginTop: '10px' }}>
                As students of Conestoga College, we understand the struggles of student entrepreneurs and aim to provide them with the resources they need.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Call to Action */}
        <Box sx={{ marginTop: '50px' }}>
          <Typography variant="h6" sx={{ marginBottom: '20px', color: '#3f51b5' }}>
            Join us in making a difference!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              borderRadius: '25px',
              padding: '12px 30px',
              textTransform: 'none',
              fontWeight: 'bold',
              boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: '#303f9f',
              },
            }}
          >
            Start Your Campaign
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default About;
