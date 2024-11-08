"use client";
import * as React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface CampaignCardProps {
  img: string;
  name: string;
  category: string;
  amountRaised: number;
  campaignId: string;
  sx?: any;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  img,
  name,
  category,
  amountRaised,
  campaignId,
  sx,
}) => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push(`/campaigns/${campaignId}`);
  };

  return (
    <Card sx={{ maxWidth: 345, borderRadius: '8px', boxShadow: 3, ...sx }}>
      <CardMedia
        component="img"
        alt={name}
        height="300"
        image={img}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ fontWeight: 'bold' }}
        >
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Typography>
        <Box sx={{ mt: 1, fontWeight: 'bold', fontSize: '1rem' }}>
          ${amountRaised.toLocaleString()} raised
        </Box>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant="outlined"
          sx={{
            textTransform: 'none',
            padding: '0.5rem 2rem',
            borderRadius: '8px',
          }}
          onClick={handleButtonClick} // Navigate on click
        >
          Back this campaign
        </Button>
      </CardActions>
    </Card>
  );
};
