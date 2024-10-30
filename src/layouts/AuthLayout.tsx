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
                community. N3plus is launching its platform live!
                <br />
                <br /> We are looking to showcase our first wave of 20 artists
                and creative makers. If you wish to be part of this opening,
                make sure you signup and share some of the works you are proud
                of. We’ll advertise your creativity, for free, on our homepage
                and on Instagram.
                <br />
                <br /> If you would like to know more about us, feel free to
                reach out at{' '}
                <Link href="mailto:team@newplus.com?subject=feature">
                  team@n3plus.com
                </Link>
                .
                <br />
                <br />
                We’ll proceed with a final selection and get back to you within
                5 business days regarding the final choice.
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
