import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React from 'react';

import { LogoGraphic } from 'components/Graphics/LogoGraphic';
import { LegalFooter } from 'components/AuthLayout/LegalFooter';

interface ProfileLayoutProps {
  pageTitle: string;
  children: React.ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  pageTitle,
  children,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        px: { xs: 2, md: 4 }, // Responsive horizontal padding
        py: { xs: 4, md: 8 }, // Responsive vertical padding
        bgcolor: 'background.default', // Background color from theme
      }}
    >
      <Container maxWidth="lg" sx={{ flex: 1 }}>
        <Box sx={{ mt: 4 }}>{children}</Box>
      </Container>
    </Box>
  );
};
