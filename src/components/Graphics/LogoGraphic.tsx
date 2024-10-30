import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import React from 'react';

interface ILogoGraphicProps {
  displayName?: string;
}
export const LogoGraphic: React.FC<ILogoGraphicProps> = ({ displayName }) => {
  return (
    <Link href="/" passHref>
      <Grid container alignItems="flex-end" sx={{ cursor: 'pointer' }}>
        <Grid>
          <Typography
            variant={'h4'}
            sx={{
              fontWeight: 'bolder',
              textTransform: 'uppercase',
              lineHeight: '.8em',
            }}
          >
            N<span style={{ color: '#01f900' }}>3</span>
          </Typography>
        </Grid>
        <Grid>
          <Typography
            variant={'h4'}
            sx={{ fontWeight: 'light', lineHeight: '.8em' }}
          >
            plus
          </Typography>
        </Grid>
        {displayName && (
          <Grid>
            <Box sx={{ ml: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  lineHeight: displayName?.split(' ')?.[1] ? '1.25em' : '.8em',
                }}
              >
                {displayName?.split(' ')[0]}
              </Typography>
              {displayName?.split(' ')?.[1] && (
                <Typography variant="body2" sx={{ lineHeight: '.8em' }}>
                  {displayName
                    ?.split(' ')
                    ?.filter((_s: string, idx: number) => idx !== 0)
                    .join(' ')}
                </Typography>
              )}
            </Box>
          </Grid>
        )}
      </Grid>
    </Link>
  );
};
