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
            N3Plus' is based at the NEW INC, the world’s first museum-led
            incubator for art, technology and design located in the heart of the
            Lower East Side in Manhattan.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
