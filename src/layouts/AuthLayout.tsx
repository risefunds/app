import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React from 'react';

import { LogoGraphic } from 'components/Graphics/LogoGraphic';
import { LegalFooter } from 'components/AuthLayout/LegalFooter';
import { GenericSection } from 'components/generic/GenericSection';

interface AuthLayoutProps {
  pageTitle: string;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  pageTitle,
  children,
}) => {
  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <GenericSection>
          <List>
            <ListItem>
              <LogoGraphic displayName={pageTitle} />
            </ListItem>
            <ListItem>
              <Typography sx={{ pb: 2 }} variant="subtitle1">
                Welcome and thank you for expressing your interest in our
                community. RISEFUNDS is launching its platform live!
                <br />
              </Typography>
            </ListItem>
          </List>
          <Box>{children}</Box>
          <List>
            <ListItem>
              <LegalFooter />
            </ListItem>
          </List>
        </GenericSection>
      </Box>
    </Container>
  );
};
