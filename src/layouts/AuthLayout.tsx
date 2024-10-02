import {
  Box,
  Container,
  List,
} from '@mui/material';
import React from 'react';

import { GenericSection } from 'components/generic/GenericSection';

export const AuthLayout: React.FC<any> = (props) => {
  return (
    <>
      <Container maxWidth={'sm'}>
        <Box mt={8}>
          <GenericSection>
            <img
              src="/images/Logo.png"
              alt="Logo"
              style={{ marginLeft: '30px', maxWidth: '100px', borderRadius: '50%' }} />
            <List>
            </List>
            <Box>{props.children}</Box>
          </GenericSection>
        </Box>
      </Container>
    </>
  );
};
