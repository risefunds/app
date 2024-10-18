'use client';

import { NavigationLayout } from 'layouts/NavigationLayout';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

const buttonStyles = {
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 'bold',
  width: 'fit-content',
};

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
    title: 'Bed',
  },
  {
    img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
    title: 'Kitchen',
  },
];

export default function Home() {
  return (
    <NavigationLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} sx={{ height: '80vh', margin: '2rem' }}>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{ padding: '8rem 2rem 2rem 2rem' }}
          >
            <Stack spacing={3}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  mr: 2,
                  fontSize: '5rem',
                  fontWeight: 500,
                  lineHeight: 1,
                  letterSpacing: '.08rem',
                  color: 'secondary.contrastText',
                  textDecoration: 'none',
                }}
              >
                Fuel your ideas, ignite your impact.
              </Typography>

              <Typography
                component="p"
                sx={{
                  mr: 2,
                  fontSize: '1.5rem',
                  lineHeight: 1.5,
                  letterSpacing: '.01rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                Join a community of visionaries and backers. Share your story,
                get funded, and turn your passion into reality.
              </Typography>

              <Button variant="contained" sx={buttonStyles}>
                Start a Campaign
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ padding: '2rem' }}>
            <ImageList
              sx={{ width: '100%', height: '450' }}
              variant="woven"
              cols={2}
              gap={8}
            >
              {itemData.map((item) => (
                <ImageListItem key={item.img}>
                  <img
                    srcSet={`${item.img}?w=161&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.img}?w=161&fit=crop&auto=format`}
                    alt={item.title}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>
        </Grid>
      </Box>
    </NavigationLayout>
  );
}
