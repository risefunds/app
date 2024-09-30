import {
  Box,
  Container,
  Typography,
  Alert,
  AlertTitle,
  IconButton,
  ListItem,
  List,
  Link,
} from '@mui/material';
import React from 'react';
import theme from '../utils/theme';

import { LogoGraphic } from 'components/Graphics/LogoGraphic';
import { LegalFooter } from 'components/AuthLayout/LegalFooter';
import { GenericSection } from 'components/generic/GenericSection';

export const AuthLayout: React.FC<any> = (props) => {
  return (
    <>
      <Container maxWidth={'sm'}>
        <Box mt={8}>
          <GenericSection>
            <List>
              <ListItem>
                <LogoGraphic displayName={props.pageTitle} />
              </ListItem>
              <ListItem>
                <Typography sx={{ pb: 2 }} variant="subtitle1">
                  Welcome and thank you for expressing your interest in our
                  community. N3plus is launching its platform live!
                  <br />
                  <br /> We are looking to showcase our first wave of 20 artists
                  and creative makers. If you wish to be part of this opening,
                  make sure you signup and share some of the works you proud of.
                  We’ll advertise your creativity, for free, on our homepage and
                  on Instagram.
                  <br />
                  <br /> If you would like to know more about us, feel free to
                  reach out at{' '}
                  <Link href="mailto:team@newplus.com?subject=feature">
                    team@n3plus.com.
                  </Link>
                  <br />
                  <br />
                  We’ll proceed on a final selection and we’ll get back to you
                  in 5 business days informing you on the final choice.
                </Typography>
              </ListItem>
            </List>
            <Box>{props.children}</Box>
            <List>
              <ListItem>
                <LegalFooter />
              </ListItem>
            </List>
          </GenericSection>
        </Box>
      </Container>
    </>
  );
};
