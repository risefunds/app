'use client';

import { NavigationLayout } from 'layouts/NavigationLayout';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Image from 'next/image';
import { CampaignCard } from 'components/generic/CampaignCard';

const imgContainer = {
  filter: 'grayscale()',
  backgroundColor: '#eff1f700',
  border: '1px solid #131f5b33',
  transition: 'filter .2s',
  borderRadius: '.375rem',
  flex: 'none',
  justifyContent: 'center',
  alignItems: 'center',
  width: '14rem',
  height: '6rem',
  padding: '1rem 2rem',
  position: 'relative',
  display: 'flex',
};

const imageStyle = {
  height: '100%',
  verticalAlign: 'middle',
  maxWidth: '100%',
  display: 'inline-block',
  padding: '1rem',
};

const buttonStyles = {
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 'bold',
  width: 'fit-content',
};

const itemData = [
  {
    img: '/Home/hero1.webp',
    title: 'Bed',
  },
  {
    img: '/Home/hero2.jpg',
    title: 'Kitchen',
  },
];

const popularCampaigns = [
  {
    img: '/Home/pop1.webp',
    name: 'ChessUp 2 : Chess.com on a Real Board',
    category: 'tech',
    amountRaised: 2512191,
  },
  {
    img: '/Home/pop2.webp',
    name: 'OCTOPUNX: New Site and Content for Octopunk Media',
    category: 'web series & tv shows',
    amountRaised: 16284,
  },
  {
    img: '/Home/pop3.webp',
    name: 'Odin2 Portal: The Ultimate 7 OLED Gaming Handheld',
    category: 'video games',
    amountRaised: 128689,
  },
  {
    img: '/Home/pop4.webp',
    name: 'C&Rsenal SOFT T-Shirts 2024',
    category: 'arts',
    amountRaised: 45125,
  },
  {
    img: '/Home/pop5.webp',
    name: 'Kabata: Take the Guesswork Out of Your Workout.',
    category: 'health & fitness',
    amountRaised: 599624,
  },
  {
    img: '/Home/pop6.webp',
    name: 'Meraki: Ultimate Espresso',
    category: 'home',
    amountRaised: 2668285,
  },
];

export default function Home() {
  const router = useRouter();
  return (
    <NavigationLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={2}
          sx={{ minHeight: 'calc(85vh - 60px);', margin: '2rem' }}
        >
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

              <Button
                variant="contained"
                sx={buttonStyles}
                onClick={() => router.push('/campaigns/start-campaign')}
              >
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
      <Box
        sx={{
          margin: '3rem 0',
          padding: '2rem',
        }}
      >
        <Typography
          component="h2"
          sx={{
            mr: 2,
            fontSize: '4rem',
            width: '50%',
            lineHeight: 1,
            letterSpacing: '.01rem',
            color: 'inherit',
            marginBottom: '5rem',
          }}
        >
          We’re proud to partner with the best
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Box sx={imgContainer}>
            <Image
              src="/Featured/lig.png"
              layout="fill"
              style={imageStyle}
              objectFit="contain"
              alt="Picture of the author"
            />
          </Box>

          <Box sx={imgContainer}>
            <Image
              src="/Featured/horizon-partners.png"
              layout="fill"
              style={imageStyle}
              objectFit="contain"
              alt="Picture of the author"
            />
          </Box>

          <Box sx={imgContainer}>
            <Image
              src="/Featured/keystone.png"
              layout="fill"
              style={imageStyle}
              objectFit="contain"
              alt="Picture of the author"
            />
          </Box>

          <Box sx={imgContainer}>
            <Image
              src="/Featured/my-insurance-solutions.png"
              layout="fill"
              style={imageStyle}
              objectFit="contain"
              alt="Picture of the author"
            />
          </Box>

          <Box sx={imgContainer}>
            <Image
              src="/Featured/tapestry.png"
              layout="fill"
              style={imageStyle}
              objectFit="contain"
              alt="Picture of the author"
            />
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          margin: '3rem 0',
          padding: '2rem',
          backgroundColor: 'secondary.main',
        }}
      >
        <Typography
          component="h2"
          sx={{
            mr: 2,
            fontSize: '4rem',
            width: '50%',
            lineHeight: 1,
            letterSpacing: '.01rem',
            color: 'inherit',
            marginBottom: '5rem',
          }}
        >
          Popular Campaigns
        </Typography>

        <Grid
          container
          spacing={3}
          sx={{ margin: '3rem', width: '100%' }}
          justifyContent="center"
        >
          {popularCampaigns.map((campaign) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={campaign.name}>
              <CampaignCard
                img={campaign.img}
                name={campaign.name}
                category={campaign.category}
                amountRaised={campaign.amountRaised}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Button
            variant="outlined"
            sx={buttonStyles}
            onClick={() => router.push('/auth/login')}
          >
            Explore All Campaigns
          </Button>
        </Box>
      </Box>
    </NavigationLayout>
  );
}
