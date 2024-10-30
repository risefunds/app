import { Box, Typography } from '@mui/material';
import React from 'react';

export const LegalFooter: React.FC = () => {
  return (
    <Box>
      <Box>
        <Box>
          <Typography
            variant="caption"
            sx={{ lineHeight: 1.75, display: 'block' }}
          >
            RiseFunds is a capstone initiative created by a team of three Web
            Development students at Conestoga College. The platform, inspired by
            leading crowdfunding sites like Indiegogo and Kickstarter, is
            designed to empower creators by providing a user-friendly space to
            launch and manage fundraising campaigns.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
